import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email) {
      return NextResponse.json({ 
        message: "Recipient email is required in the JSON body.",
        tip: "Send a POST request with { \"email\": \"your-email@gmail.com\" }"
      }, { status: 400 });
    }

    const testOtp = "123456";
    console.log(`🧪 TEST ROUTE: Sending test OTP email to: ${email}`);
    
    const result = await sendOTPEmail(email, testOtp);

    if (result.success) {
      return NextResponse.json({ 
        message: "✅ Test email sent successfully! Please check your inbox and spam folder.", 
        messageId: result.messageId,
        details: "If you don't see it, check the server logs for any hidden warnings."
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        message: "❌ Failed to send test email.", 
        error: result.error,
        hint: "Check your GMAIL_USER and GMAIL_APP_PASSWORD in .env. Ensure 2-Step Verification is ON and you are using an 'App Password', NOT your regular password."
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("❌ Test email route unexpected error:", error);
    return NextResponse.json({ 
      message: "Internal server error during test email.", 
      error: error.message 
    }, { status: 500 });
  }
}
