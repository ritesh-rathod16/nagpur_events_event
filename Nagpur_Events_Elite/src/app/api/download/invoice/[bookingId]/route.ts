import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    const session = await verifyToken();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const booking = await Booking.findOne({ bookingId: params.bookingId });
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    if (booking.user.toString() !== (session.user as any).id && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const fileUrl = booking.invoicePdfUrl || booking.invoicePdfPath;
    if (!fileUrl) return NextResponse.json({ error: 'Invoice file not available' }, { status: 404 });

    // Proxy the file
    const res = await fetch(fileUrl);
    const arrayBuffer = await res.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="Invoice-${booking.bookingId}.pdf"`);

    return new NextResponse(Buffer.from(arrayBuffer), { status: 200, headers });
  } catch (err: any) {
    console.error('Download invoice error:', err);
    return NextResponse.json({ error: err.message || 'Download failed' }, { status: 500 });
  }
}
