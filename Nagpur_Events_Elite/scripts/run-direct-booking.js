require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

function prepareFonts(doc) {
  try {
    const fontDir = path.join(process.cwd(), 'public', 'fonts');
    const r = path.join(fontDir, 'Roboto-Regular.ttf');
    const b = path.join(fontDir, 'Roboto-Bold.ttf');
    const fonts = { regular: 'Helvetica', bold: 'Helvetica-Bold' };
    if (fs.existsSync(r)) { doc.registerFont('ROBOTO', r); fonts.regular = 'ROBOTO'; }
    if (fs.existsSync(b)) { doc.registerFont('ROBOTO_BOLD', b); fonts.bold = 'ROBOTO_BOLD'; }
    return fonts;
  } catch (e) { console.warn('prepareFonts failed', e); return { regular: 'Helvetica', bold: 'Helvetica-Bold' }; }
}
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) { console.error('Supabase env vars missing'); }

async function pdfBufferFrom(fn) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    const doc = new PDFDocument();
    doc.on('data', (d) => buffers.push(d));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
    try { fn(doc); doc.end(); } catch (e) { reject(e); }
  });
}

async function generateTicketPDF({ ticketId, eventName, eventDate, userName, qrDataUrl }) {
  return pdfBufferFrom((doc) => {
    const fonts = prepareFonts(doc);
    doc.font(fonts.bold).fontSize(20).text('Ticket', { align: 'center' });
    doc.moveDown();
    doc.font(fonts.regular).fontSize(14).text(`Ticket ID: ${ticketId}`);
    doc.text(`Event: ${eventName}`);
    doc.text(`Date: ${eventDate}`);
    doc.text(`Name: ${userName}`);
    doc.moveDown();
    doc.image(Buffer.from(qrDataUrl.split(',')[1], 'base64'), { fit: [150, 150] });
  });
}

async function generateInvoicePDF({ invoiceNo, date, userName, userEmail, eventName, amount, paymentId }) {
  return pdfBufferFrom((doc) => {
    const fonts = prepareFonts(doc);
    doc.font(fonts.bold).fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.font(fonts.regular).fontSize(12).text(`Invoice No: ${invoiceNo}`);
    doc.text(`Date: ${date}`);
    doc.text(`Billed To: ${userName} <${userEmail}>`);
    doc.moveDown();
    doc.text(`Event: ${eventName}`);
    doc.text(`Amount: ₹${amount}`);
    doc.text(`Payment ID: ${paymentId}`);
  });
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  const eventsCol = db.collection('events');
  const usersCol = db.collection('users');
  const paymentsCol = db.collection('payments');
  const bookingsCol = db.collection('bookings');

  const event = await eventsCol.findOne();
  if (!event) { console.error('No event found. Seed required.'); await client.close(); process.exit(1); }
  console.log('Using event:', event._id.toString(), event.title);

  const testEmail = 'test.user@local.test';
  let user = await usersCol.findOne({ email: testEmail });
  if (!user) {
    const res = await usersCol.insertOne({ name: 'Test User', email: testEmail, password: 'notused', role: 'user', isVerified: true, createdAt: new Date(), updatedAt: new Date() });
    user = await usersCol.findOne({ _id: res.insertedId });
    console.log('Created test user:', user._id.toString());
  } else {
    console.log('Found existing test user:', user._id.toString());
  }

  const orderId = `order_test_${Date.now()}`;
  const paymentId = `pay_test_${Date.now()}`;
  const amount = event.price || 0;

  try {
    // 1. Create payment record
    const paymentRes = await paymentsCol.insertOne({ user: user._id, event: event._id, razorpayOrderId: orderId, razorpayPaymentId: paymentId, amount, status: 'captured', paidAt: new Date(), createdAt: new Date() });
    console.log('Payment record created', paymentRes.insertedId.toString());

    // 2. Ticket ID and QR
    const ticketId = `NE-${(Math.random().toString(16).slice(2,10)).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    console.log('TicketId', ticketId);
    const qrDataUrl = await QRCode.toDataURL(ticketId);

    // 3. Generate PDFs
    const ticketBuffer = await generateTicketPDF({ ticketId, eventName: event.title, eventDate: new Date(event.date).toLocaleDateString(), userName: user.name, qrDataUrl });
    console.log('Ticket PDF buffer generated', ticketBuffer.length);
    const invoiceBuffer = await generateInvoicePDF({ invoiceNo: `INV-${Date.now()}`, date: new Date().toLocaleDateString(), userName: user.name, userEmail: user.email, eventName: event.title, amount, paymentId });
    console.log('Invoice PDF buffer generated', invoiceBuffer.length);

    // 4. Upload to Supabase (if configured)
    let ticketUrl = null, invoiceUrl = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const ticketName = `ticket-${ticketId}.pdf`;
      const invoiceName = `invoice-${ticketId}.pdf`;
      const tRes = await supa.storage.from('tickets').upload(ticketName, ticketBuffer, { contentType: 'application/pdf', upsert: true }).catch(e=>({ error:e }));
      if (tRes && tRes.error) { console.error('Ticket upload error:', tRes.error); } else { ticketUrl = `${SUPABASE_URL}/storage/v1/object/public/tickets/${encodeURIComponent(ticketName)}`; }
      const iRes = await supa.storage.from('invoices').upload(invoiceName, invoiceBuffer, { contentType: 'application/pdf', upsert: true }).catch(e=>({ error:e }));
      if (iRes && iRes.error) { console.error('Invoice upload error:', iRes.error); } else { invoiceUrl = `${SUPABASE_URL}/storage/v1/object/public/invoices/${encodeURIComponent(invoiceName)}`; }
      console.log('Uploaded to Supabase', { ticketUrl, invoiceUrl });
    } else {
      console.log('Supabase not configured; skipping upload');
    }

    // 5. Create booking
    const bookingId = `BK-${(Math.random().toString(16).slice(2,8)).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const bookingDoc = {
      bookingId,
      user: user._id,
      event: event._id,
      quantity: 1,
      paymentId,
      orderId,
      amount,
      ticketId,
      qrCodeUrl: qrDataUrl,
      ticketPdfUrl: ticketUrl,
      invoicePdfUrl: invoiceUrl,
      entryStatus: 'NOT_USED',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const bRes = await bookingsCol.insertOne(bookingDoc);
    console.log('Booking created', bRes.insertedId.toString());

    // 6. Send email if SMTP configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
      const mail = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: `Your ticket for ${event.title}`,
        text: `Hi ${user.name}, attached are your ticket and invoice. Ticket ID: ${ticketId}`,
        attachments: [ { filename: `ticket-${ticketId}.pdf`, content: ticketBuffer }, { filename: `invoice-${ticketId}.pdf`, content: invoiceBuffer } ]
      };
      const info = await transporter.sendMail(mail).catch(e=>{ console.error('Email send error', e); return null; });
      if (info) console.log('Email sent', info.response || info.messageId);
    } else {
      console.log('SMTP not configured; skipping email');
    }

    // Print final objects
    const recentPayments = await paymentsCol.find({}).sort({ createdAt: -1 }).limit(3).toArray().catch(()=>[]);
    const recentBookings = await bookingsCol.find({}).sort({ createdAt: -1 }).limit(3).toArray().catch(()=>[]);
    console.log('Recent Payments:', recentPayments.map(p => ({ id: p._id.toString(), razorpayPaymentId: p.razorpayPaymentId, amount: p.amount })));
    console.log('Recent Bookings:', recentBookings.map(b => ({ id: b._id.toString(), user: b.user.toString(), paymentId: b.paymentId, ticketId: b.ticketId })));

  } catch (err) {
    console.error('Error during simulation', err);
  } finally {
    await client.close();
    console.log('Done');
  }
}

main();
