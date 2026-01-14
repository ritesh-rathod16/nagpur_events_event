import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, default: 1 },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  ticketId: { type: String, unique: true, required: true },
  qrPath: { type: String },
  ticketPdfPath: { type: String },
  invoicePdfPath: { type: String },
  qrCodeUrl: { type: String },
  ticketPdfUrl: { type: String },
  invoicePdfUrl: { type: String },
  entryStatus: { type: String, enum: ['NOT_USED', 'USED'], default: 'NOT_USED' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
