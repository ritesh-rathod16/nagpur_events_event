import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";

export async function POST(req: NextRequest) {
  try {
    const session = await verifyToken();

    // Check if user is admin
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { ticketId } = await req.json();

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findOne({ ticketId }).populate("event user");

    if (!booking) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid Ticket ID. Booking not found." 
      }, { status: 404 });
    }

    if (booking.entryStatus === "USED") {
      return NextResponse.json({ 
        success: false, 
        message: `Ticket already used at ${new Date(booking.updatedAt).toLocaleString()}`,
        booking 
      });
    }

    // Mark as USED
    booking.entryStatus = "USED";
    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Entry verified successfully! Welcome to the event.",
      booking
    });
  } catch (error: any) {
    console.error("Entry verification error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
