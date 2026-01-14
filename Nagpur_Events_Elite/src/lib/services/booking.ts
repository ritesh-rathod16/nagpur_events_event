import Booking from "@/lib/models/Booking";
import Event from "@/lib/models/Event";
import User from "@/lib/models/User";
import { generateQRCode } from "./qr";
import { generateTicketPDF, generateInvoicePDF } from "./pdf";
import { uploadBuffer } from "@/lib/supabase";
import { sendBookingConfirmation } from "@/lib/nodemailer";
import crypto from "crypto";

export async function processSuccessfulPayment(data: {
  userId: string;
  eventId: string;
  paymentId: string;
  orderId: string;
  amount: number;
}) {
  const mongoose = await import('mongoose');
  const Payment = (await import('@/lib/models/Payment')).default;
  try {
    const user = await User.findById(data.userId);
    const event = await Event.findById(data.eventId);

    if (!user || !event) {
      throw new Error("User or Event not found");
    }

    // Idempotency: if payment already processed, return existing booking
    const existing = await Booking.findOne({ paymentId: data.paymentId });
    if (existing) {
      console.log('Payment already processed. Returning existing booking:', existing._id);
      return existing;
    }

    // Start a mongoose transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    // Declare filenames in outer scope so cleanup catch can access them
    let ticketFileName: string | undefined;
    let invoiceFileName: string | undefined;

    try {
      // 0. Create Payment record
      const paymentRecord = await Payment.create([{
        user: data.userId,
        event: data.eventId,
        razorpayOrderId: data.orderId,
        razorpayPaymentId: data.paymentId,
        amount: data.amount,
        status: 'captured',
        paidAt: new Date(),
      }], { session });

      console.log('Payment record created:', paymentRecord[0]._id);

      // 1. Generate Unique Ticket ID
      const ticketId = `NE-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now().toString().slice(-4)}`;

      // 2. Generate QR Code (contains ticketId)
      console.log('QR generation started for', ticketId);
      const qrCodeDataUrl = await generateQRCode(ticketId);
      console.log('QR generated');

      // 3. Generate PDFs
      console.log('Generating ticket PDF...');
      const ticketBuffer = await generateTicketPDF({
        bookingId: data.orderId,
        ticketId,
        eventName: event.title,
        eventDate: new Date(event.date).toLocaleDateString(),
        eventTime: event.time || "TBA",
        venue: event.location,
        userName: user.name,
        qrCodeDataUrl,
      });
      console.log('Ticket PDF created');

      console.log('Generating invoice PDF...');
      const invoiceBuffer = await generateInvoicePDF({
        invoiceNo: `INV-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        userName: user.name,
        userEmail: user.email,
        eventName: event.title,
        amount: data.amount,
        paymentId: data.paymentId,
      });
      console.log('Invoice PDF created');

      // 4. Upload to Supabase Storage
      ticketFileName = `ticket-${ticketId}.pdf`;
      invoiceFileName = `invoice-${ticketId}.pdf`;

      const ticketPdfUrl = await uploadBuffer(
        ticketBuffer,
        'tickets',
        ticketFileName,
        'application/pdf'
      );

      const invoicePdfUrl = await uploadBuffer(
        invoiceBuffer,
        'invoices',
        invoiceFileName,
        'application/pdf'
      );

      // 5. Create Booking Record
      const bookingId = `BK-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const booking = await Booking.create([{
        bookingId,
        user: data.userId,
        event: data.eventId,
        quantity: 1,
        payment: paymentRecord[0]._id,
        paymentId: data.paymentId,
        orderId: data.orderId,
        amount: data.amount,
        ticketId,
        qrPath: ticketFileName,
        ticketPdfPath: ticketFileName,
        invoicePdfPath: invoiceFileName,
        qrCodeUrl: qrCodeDataUrl,
        ticketPdfUrl,
        invoicePdfUrl,
        entryStatus: 'NOT_USED',
        status: 'completed',
      }], { session });

      // 6. Send Email
      console.log('Sending email...');
      const emailResult = await sendBookingConfirmation({
        email: user.email,
        userName: user.name,
        eventName: event.title,
        ticketPdf: ticketBuffer,
        invoicePdf: invoiceBuffer,
        ticketId,
      });

      if (!emailResult || !emailResult.success) {
        console.error('Email sending failed:', emailResult);
        throw new Error('Failed to send booking confirmation email');
      }

      console.log('Email sent');

      await session.commitTransaction();
      session.endSession();

      // Return created booking
      return booking[0];
    } catch (err) {
      console.error('Error in transaction, rolling back:', err);

      // Attempt to clean up uploaded files if any
      try {
        const { deleteFile } = await import('@/lib/supabase');
        if (ticketFileName) await deleteFile('tickets', ticketFileName).catch(()=>{});
        if (invoiceFileName) await deleteFile('invoices', invoiceFileName).catch(()=>{});
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }

      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("Error processing booking:", error);
    throw error;
  }
}
