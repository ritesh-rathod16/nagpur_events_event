import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import crypto from "crypto";
import { processSuccessfulPayment } from "@/lib/services/booking";

export async function POST(req: NextRequest) {
  try {
    console.log('Verify API hit');
    const session = await verifyToken();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, amount } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !eventId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify Signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      console.log('Signature verification failed');
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    console.log('Signature verified');

    await connectDB();

    // 2. Process Booking (Creates DB record, generates PDFs/QR, sends Email)
    const booking = await processSuccessfulPayment({
      userId: (session.user as any).id,
      eventId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amount || 0,
    });

    console.log('Booking created:', booking._id);

    return NextResponse.json({
      success: true,
      message: "Payment verified and booking confirmed. Ticket has been emailed.",
      booking,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
