import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET(req: NextRequest, { params }: { params: { bookingId: string }}) {
  try {
    const session = await verifyToken();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const booking = await Booking.findOne({ bookingId: params.bookingId }).populate('event user');
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    if (booking.user._id.toString() !== (session.user as any).id && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (err: any) {
    console.error('Get booking error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch booking' }, { status: 500 });
  }
}
