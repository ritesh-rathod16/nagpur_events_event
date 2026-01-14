import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { processSuccessfulPayment } from '@/lib/services/booking';
import Payment from '@/lib/models/Payment';

export async function POST(req: NextRequest) {
  try {
    console.log('Razorpay webhook received');
    const signature = req.headers.get('x-razorpay-signature') || '';
    const body = await req.text();

    // Verify signature
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (!signature || signature !== expected) {
      console.log('Webhook signature verification failed');
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    console.log('Webhook signature verified');

    const payload = JSON.parse(body);

    // Only handle payment.captured events
    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }

      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;
      const amount = (paymentEntity.amount || 0) / 100;
      const notes = paymentEntity.notes || {};
      const eventId = notes.eventId || notes.event_id;
      const userId = notes.userId || notes.user_id;

      if (!razorpayPaymentId || !razorpayOrderId || !eventId || !userId) {
        console.log('Webhook payload missing required fields');
        return NextResponse.json({ ok: false }, { status: 400 });
      }

      await connectDB();

      // Idempotency: check payment exists
      const exists = await Payment.findOne({ razorpayPaymentId });
      if (exists) {
        console.log('Payment already processed via webhook:', razorpayPaymentId);
        return NextResponse.json({ ok: true });
      }

      console.log('Processing webhook payment:', razorpayPaymentId);

      try {
        const booking = await processSuccessfulPayment({
          userId,
          eventId,
          paymentId: razorpayPaymentId,
          orderId: razorpayOrderId,
          amount,
        });

        console.log('Webhook booking created:', booking._id);
        return NextResponse.json({ ok: true });
      } catch (err: any) {
        console.error('Webhook processing error:', err);
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
