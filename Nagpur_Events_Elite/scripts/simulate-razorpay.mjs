import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import crypto from 'crypto';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Load models dynamically using project's compiled path
const MONGODB_URI = process.env.MONGODB_URI;
const NEXT_URL = process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3001';
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}
if (!RAZORPAY_SECRET) {
  console.error('RAZORPAY_KEY_SECRET not set in .env');
  process.exit(1);
}
if (!NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET not set in .env');
  process.exit(1);
}

// Import models by path
import UserModelPath from '../src/lib/models/User.js';
import EventModelPath from '../src/lib/models/Event.js';
import BookingModelPath from '../src/lib/models/Booking.js';
import PaymentModelPath from '../src/lib/models/Payment.js';

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: 'eventheadDB' });
  console.log('Connected to MongoDB');

  // Ensure an Event exists
  const Event = (await import('../src/lib/models/Event.js')).default;
  const User = (await import('../src/lib/models/User.js')).default;
  const Booking = (await import('../src/lib/models/Booking.js')).default;
  const Payment = await (async () => {
    try {
      return (await import('../src/lib/models/Payment.js')).default;
    } catch (err) {
      console.warn('Payment model not found. Webhook/verify may fail when trying to write Payment.');
      return null;
    }
  })();

  const event = await Event.findOne();
  if (!event) {
    console.error('No event found. Run GET /api/admin/seed or seed DB first.');
    process.exit(1);
  }

  // Create or find a test user
  const testEmail = 'test.user@local.test';
  let user = await User.findOne({ email: testEmail });
  if (!user) {
    user = await User.create({ name: 'Test User', email: testEmail, password: 'notused', role: 'user', isVerified: true });
    console.log('Created test user:', user._id.toString());
  } else {
    console.log('Found existing test user:', user._id.toString());
  }

  // 1) Simulate verify-payment (requires JWT cookie)
  const orderId = `order_test_${Date.now()}`;
  const paymentId = `pay_test_${Date.now()}`;
  const sign = `${orderId}|${paymentId}`;
  const expectedSign = crypto.createHmac('sha256', RAZORPAY_SECRET).update(sign).digest('hex');

  const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role, name: user.name }, NEXTAUTH_SECRET, { expiresIn: '1h' });

  console.log('\n--- Simulating verify-payment ---');
  const verifyRes = await fetch(`${NEXT_URL}/api/razorpay/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `auth-token=${token}`,
    },
    body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: expectedSign, eventId: event._id.toString(), amount: event.price }),
  });

  console.log('verify-payment status:', verifyRes.status);
  const verifyJson = await verifyRes.text();
  console.log('verify-payment response:', verifyJson);

  // 2) Simulate webhook payment.captured
  console.log('\n--- Simulating webhook payment.captured ---');
  const body = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: paymentId + '_webhook',
          order_id: orderId + '_webhook',
          amount: Math.round(event.price * 100),
          notes: { eventId: event._id.toString(), userId: user._id.toString() }
        }
      }
    }
  });

  const webhookSig = crypto.createHmac('sha256', RAZORPAY_SECRET).update(body).digest('hex');

  const webhookRes = await fetch(`${NEXT_URL}/api/razorpay/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': webhookSig,
    },
    body,
  });

  console.log('webhook status:', webhookRes.status);
  const webhookJson = await webhookRes.text();
  console.log('webhook response:', webhookJson);

  // Inspect DB for created Booking/Payment
  console.log('\n--- DB Checks ---');
  const payments = Payment ? await Payment.find({}).sort({ createdAt: -1 }).limit(5) : [];
  const bookings = await Booking.find({}).sort({ createdAt: -1 }).limit(5);

  console.log('Recent Payments:', payments.map(p => ({ id: p?._id, razorpayPaymentId: p?.razorpayPaymentId, amount: p?.amount } )));
  console.log('Recent Bookings:', bookings.map(b => ({ id: b._id, user: b.user.toString(), paymentId: b.paymentId, ticketId: b.ticketId })));

  await mongoose.disconnect();
  console.log('\nDone');
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});