import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { geocodeEventData } from "@/lib/services/geocode";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await verifyToken();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();
    try {
      const coords = await geocodeEventData(body.googleMapUrl, body.fullAddress);
      if (coords) {
        body.locationLat = coords.lat;
        body.locationLng = coords.lng;
      }
    } catch (e) {
      // ignore geocode errors
    }
    const event = await Event.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await verifyToken();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: "Event deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
