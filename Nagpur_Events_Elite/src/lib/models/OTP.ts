import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // 5 minutes
  },
}, { timestamps: true });

export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
