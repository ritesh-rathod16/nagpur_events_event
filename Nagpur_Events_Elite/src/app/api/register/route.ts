import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import OTP from "@/lib/models/OTP";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json();
    const cleanEmail = email.trim().toLowerCase();

    console.log(`📝 Registration attempt for: ${cleanEmail}`);

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords mismatch" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email: cleanEmail });
    
    if (existingUser) {
      if (existingUser.isVerified) {
        console.log(`⚠️ User already exists and is verified: ${cleanEmail}`);
        return NextResponse.json({ message: "Email already exists. Please login." }, { status: 400 });
      }
      console.log(`🔄 User exists but not verified. Updating password for: ${cleanEmail}`);
      const hashedPassword = await bcrypt.hash(password, 12);
      existingUser.name = name;
      existingUser.password = hashedPassword;
      await existingUser.save();
    } else {
      console.log(`👤 Creating new unverified user: ${cleanEmail}`);
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: cleanEmail === 'eventhead@gmail.com' ? 'admin' : 'user',
        isVerified: false,
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in DB
    console.log(`🔢 Saving OTP to database for: ${email}`);
    await OTP.create({ 
      userId: user._id,
      email, 
      otp: otpCode 
    });

    console.log(`✅ OTP saved successfully for ${email}: ${otpCode}`);

    // Send OTP via Nodemailer
    console.log(`📧 Calling sendOTPEmail for: ${email}`);
    const emailResult = await sendOTPEmail(email, otpCode);
    
    if (!emailResult.success) {
      console.error(`❌ Registration succeeded but email failed for ${email}:`, emailResult.error);
      return NextResponse.json({ 
        message: "Account created but verification email failed to send. Please try the 'Resend OTP' button on the next page.",
        email: email,
        emailError: emailResult.error
      }, { status: 201 });
    }

    console.log(`✅ Registration and email successful for: ${email}`);
    return NextResponse.json({ 
      message: "User registered successfully. Please check your email for the verification code.",
      email: email
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Registration route error:", error);
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 });
  }
}
