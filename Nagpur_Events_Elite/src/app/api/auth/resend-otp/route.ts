import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User is already verified" }, { status: 400 });
    }

    // Delete existing OTPs for this user
    await OTP.deleteMany({ userId: user._id });

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in DB
    await OTP.create({ 
      userId: user._id,
      email, 
      otp: otpCode 
    });

    // Send OTP via Nodemailer
    const emailResult = await sendOTPEmail(email, otpCode);
    
    if (!emailResult.success) {
      console.error("Failed to resend OTP email:", emailResult.error);
      return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "New OTP sent successfully."
    }, { status: 200 });

  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ message: error.message || "Failed to resend OTP" }, { status: 500 });
  }
}
