import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import fs from 'fs';
import path from 'path';

function prepareFonts(doc: any) {
  try {
    const fontDir = path.join(process.cwd(), 'public', 'fonts');
    const r = path.join(fontDir, 'Roboto-Regular.ttf');
    const b = path.join(fontDir, 'Roboto-Bold.ttf');
    const fonts: { regular: string; bold: string } = { regular: 'Helvetica', bold: 'Helvetica-Bold' };
    if (fs.existsSync(r)) {
      doc.registerFont('ROBOTO', r);
      fonts.regular = 'ROBOTO';
    }
    if (fs.existsSync(b)) {
      doc.registerFont('ROBOTO_BOLD', b);
      fonts.bold = 'ROBOTO_BOLD';
    }
    return fonts;
  } catch (e) {
    console.warn('Failed to prepare fonts for PDF', e);
    return { regular: 'Helvetica', bold: 'Helvetica-Bold' };
  }
}

export async function generateTicketPDF(data: {
  bookingId: string;
  ticketId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  userName: string;
  qrCodeDataUrl: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const fonts = prepareFonts(doc);
    const chunks: any[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Design
    doc.rect(0, 0, doc.page.width, 150).fill('#1a365d'); // Sapphire Header
    // Prepare fonts and use them (falls back to Helvetica variants if fonts missing)
    try {
      doc.fillColor('#fbbf24').fontSize(30).font(fonts.bold).text('NAGPUR EVENTS ELITE', 50, 60);
      doc.fillColor('#ffffff').fontSize(14).font(fonts.regular).text('Official Entry Ticket', 50, 100);
    } catch (e) {
      // If font loading fails, fall back to default font without throwing (keeps PDF generation going)
      console.warn('PDF font load failed, falling back to default font:', e);
      doc.fillColor('#fbbf24').fontSize(30).text('NAGPUR EVENTS ELITE', 50, 60);
      doc.fillColor('#ffffff').fontSize(14).text('Official Entry Ticket', 50, 100);
    }

    try {
      doc.fillColor('#000000').fontSize(24).font(fonts.bold).text(data.eventName, 50, 180);

      doc.moveTo(50, 220).lineTo(550, 220).stroke('#e2e8f0');

      doc.fontSize(12).font(fonts.regular).fillColor('#64748b').text('DATE & TIME', 50, 240);
      doc.fontSize(14).font(fonts.bold).fillColor('#1a365d').text(`${data.eventDate} at ${data.eventTime}`, 50, 260);

      doc.fontSize(12).font(fonts.regular).fillColor('#64748b').text('VENUE', 300, 240);
      doc.fontSize(14).font(fonts.bold).fillColor('#1a365d').text(data.venue, 300, 260);

      doc.fontSize(12).font(fonts.regular).fillColor('#64748b').text('ATTENDEE', 50, 310);
      doc.fontSize(14).font(fonts.bold).fillColor('#1a365d').text(data.userName, 50, 330);

      doc.fontSize(12).font(fonts.regular).fillColor('#64748b').text('TICKET ID', 300, 310);
      doc.fontSize(14).font(fonts.bold).fillColor('#1a365d').text(data.ticketId, 300, 330);
    } catch (e) {
      console.warn('PDF font load failed, falling back to default font for body text', e);
      doc.fontSize(24).fillColor('#000000').text(data.eventName, 50, 180);

      doc.moveTo(50, 220).lineTo(550, 220).stroke('#e2e8f0');

      doc.fontSize(12).fillColor('#64748b').text('DATE & TIME', 50, 240);
      doc.fontSize(14).fillColor('#1a365d').text(`${data.eventDate} at ${data.eventTime}`, 50, 260);

      doc.fontSize(12).fillColor('#64748b').text('VENUE', 300, 240);
      doc.fontSize(14).fillColor('#1a365d').text(data.venue, 300, 260);

      doc.fontSize(12).fillColor('#64748b').text('ATTENDEE', 50, 310);
      doc.fontSize(14).fillColor('#1a365d').text(data.userName, 50, 330);

      doc.fontSize(12).fillColor('#64748b').text('TICKET ID', 300, 310);
      doc.fontSize(14).fillColor('#1a365d').text(data.ticketId, 300, 330);
    }
    // QR Code and footer — guard font usage
    try {
      doc.image(data.qrCodeDataUrl, 380, 380, { width: 150 });
      doc.fontSize(10).font(fonts.regular).fillColor('#64748b').text('Scan for entry verification', 380, 540, { width: 150, align: 'center' });

      doc.rect(50, 580, 500, 100).fill('#f8fafc');
      doc.fillColor('#1a365d').fontSize(12).font(fonts.bold).text('Important Instructions:', 70, 600);
      doc.fillColor('#475569').fontSize(10).font(fonts.regular).text('• Please carry a valid ID proof along with this ticket.', 70, 620);
      doc.text('• Each ticket allows one person entry only.', 70, 635);
      doc.text('• Do not share the QR code with anyone.', 70, 650);
    } catch (e) {
      console.warn('PDF font load failed for QR/footer, falling back', e);
      doc.image(data.qrCodeDataUrl, 380, 380, { width: 150 });
      doc.fontSize(10).fillColor('#64748b').text('Scan for entry verification', 380, 540, { width: 150, align: 'center' });

      doc.rect(50, 580, 500, 100).fill('#f8fafc');
      doc.fillColor('#1a365d').fontSize(12).text('Important Instructions:', 70, 600);
      doc.fillColor('#475569').fontSize(10).text('• Please carry a valid ID proof along with this ticket.', 70, 620);
      doc.text('• Each ticket allows one person entry only.', 70, 635);
      doc.text('• Do not share the QR code with anyone.', 70, 650);
    }

    doc.end();
  });
}

export async function generateInvoicePDF(data: {
  invoiceNo: string;
  date: string;
  userName: string;
  userEmail: string;
  eventName: string;
  amount: number;
  paymentId: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: any[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Use bundled fonts (standalone) and guard font calls
    const fonts = prepareFonts(doc);
    try {
      doc.fillColor('#1a365d').fontSize(24).font(fonts.bold).text('INVOICE', 50, 50);
      doc.fontSize(10).font(fonts.regular).fillColor('#64748b').text(`Invoice #: ${data.invoiceNo}`, 50, 80);
      doc.text(`Date: ${data.date}`, 50, 95);
    } catch (e) {
      console.warn('PDF invoice font load failed, falling back to default', e);
      doc.fillColor('#1a365d').fontSize(24).text('INVOICE', 50, 50);
      doc.fontSize(10).fillColor('#64748b').text(`Invoice #: ${data.invoiceNo}`, 50, 80);
      doc.text(`Date: ${data.date}`, 50, 95);
    }
    doc.moveTo(50, 120).lineTo(550, 120).stroke('#e2e8f0');

    doc.fillColor('#1a365d').fontSize(12).font(fonts.bold).text('Billed To:', 50, 140);
    doc.fillColor('#000000').fontSize(12).font(fonts.regular).text(data.userName, 50, 160);
    doc.text(data.userEmail, 50, 175);

    doc.rect(50, 220, 500, 30).fill('#1a365d');
    doc.fillColor('#ffffff').fontSize(10).font(fonts.bold).text('Description', 70, 230);
    doc.text('Amount', 450, 230, { width: 100, align: 'right' });

    doc.fillColor('#000000').fontSize(10).font(fonts.regular).text(data.eventName, 70, 270);
    doc.text(`INR ${data.amount.toFixed(2)}`, 450, 270, { width: 100, align: 'right' });

    doc.moveTo(50, 300).lineTo(550, 300).stroke('#e2e8f0');

    doc.fontSize(12).font(fonts.bold).text('Total', 350, 320);
    doc.text(`INR ${data.amount.toFixed(2)}`, 450, 320, { width: 100, align: 'right' });

    doc.fontSize(10).font(fonts.regular).fillColor('#64748b').text(`Payment ID: ${data.paymentId}`, 50, 380);
    doc.text('Status: Paid', 50, 395);

    doc.fontSize(10).font(fonts.regular).fillColor('#64748b').text('Thank you for choosing Nagpur Events Elite!', 50, 500, { align: 'center' });

    doc.end();
  });
}
