import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await verifyToken();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, customBooking } = await req.json();
    await connectDB();

    let bookingData: any = {
      user: (session.user as any).id,
      status: "pending",
      paymentStatus: "pay_later",
      paymentMethod: "cod",
    };

    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
      
      bookingData.event = eventId;
      bookingData.amount = event.price;
    } else if (customBooking) {
      bookingData.isCustom = true;
      bookingData.amount = 0; // Will be decided later
    }

    const booking = await Booking.create(bookingData);
    const populatedBooking = await Booking.findById(booking._id).populate("event");

    return NextResponse.json({ 
      message: "Booking requested successfully", 
      booking: populatedBooking 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
