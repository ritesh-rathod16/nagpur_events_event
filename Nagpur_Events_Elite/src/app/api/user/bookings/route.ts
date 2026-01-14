import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Event from "@/lib/models/Event"; // Ensure Event model is registered

export async function GET() {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const bookings = await Booking.find({ user: result.user.id })
      .populate("event")
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
