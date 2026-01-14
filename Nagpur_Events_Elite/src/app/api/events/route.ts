import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { geocodeEventData } from "@/lib/services/geocode";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const categories = searchParams.get("categories")?.split(",");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    await connectDB();
    const events = await Event.find(query).sort({ date: 1 });
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
      // ignore geocode errors; creation should still proceed
    }

    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
