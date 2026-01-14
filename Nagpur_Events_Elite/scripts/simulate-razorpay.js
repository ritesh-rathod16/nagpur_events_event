require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const fetch = globalThis.fetch || require('node-fetch');
const jwt = require('jsonwebtoken');

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

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  console.log('Connected to MongoDB');

  const eventsCol = db.collection('events');
  const usersCol = db.collection('users');
  const bookingsCol = db.collection('bookings');
  const paymentsCol = db.collection('payments');

  const event = await eventsCol.findOne();
  if (!event) {
    console.error('No event found. Run GET /api/admin/seed first.');
    await client.close();
    process.exit(1);
  }
  console.log('Using event:', event._id.toString(), event.title);

  const testEmail = 'test.user@local.test';
  let user = await usersCol.findOne({ email: testEmail });
  if (!user) {
    const res = await usersCol.insertOne({ name: 'Test User', email: testEmail, password: 'notused', role: 'user', isVerified: true, createdAt: new Date(), updatedAt: new Date() });
    user = await usersCol.findOne({ _id: res.insertedId });
    console.log('Created test user:', user._id.toString());
  } else {
    console.log('Found existing test user:', user._id.toString());
  }

  // Wait a bit for the dev server to be ready
  await new Promise((r) => setTimeout(r, 2000));

  // Simulate verify-payment
  const orderId = `order_test_${Date.now()}`;
  const paymentId = `pay_test_${Date.now()}`;
  const sign = `${orderId}|${paymentId}`;
  const expectedSign = crypto.createHmac('sha256', RAZORPAY_SECRET).update(sign).digest('hex');

  const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role, name: user.name }, NEXTAUTH_SECRET, { expiresIn: '1h' });

  console.log('\n--- Simulating verify-payment ---');

  // Retry logic for fetch to handle server startup races
  async function retryFetch(url, opts, attempts = 6, delayMs = 1000) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fetch(url, opts);
      } catch (err) {
        if (i === attempts - 1) throw err;
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  const verifyRes = await retryFetch(`${NEXT_URL}/api/razorpay/verify-payment`, {
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

  // Simulate webhook
  console.log('\n--- Simulating webhook payment.captured ---');
  const bodyObj = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: paymentId + '_webhook',
          order_id: orderId + '_webhook',
          amount: Math.round((event.price || 0) * 100),
          notes: { eventId: event._id.toString(), userId: user._id.toString() }
        }
      }
    }
  };

  const body = JSON.stringify(bodyObj);
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

  // DB checks
  console.log('\n--- DB Checks ---');
  const recentPayments = await paymentsCol.find({}).sort({ createdAt: -1 }).limit(5).toArray().catch(()=>[]);
  const recentBookings = await bookingsCol.find({}).sort({ createdAt: -1 }).limit(5).toArray().catch(()=>[]);

  console.log('Recent Payments:', recentPayments.map(p => ({ id: p._id.toString(), razorpayPaymentId: p.razorpayPaymentId, amount: p.amount })));
  console.log('Recent Bookings:', recentBookings.map(b => ({ id: b._id.toString(), user: b.user && b.user.toString ? b.user.toString() : b.user, paymentId: b.paymentId, ticketId: b.ticketId })));

  await client.close();
  console.log('\nDone');
}

main().catch(err => { console.error('Script error:', err); process.exit(1); });