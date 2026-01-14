import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";

export async function GET() {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(result.user.id).populate("wishlist");

    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { eventId } = await req.json();

    await dbConnect();
    const user = await User.findById(result.user.id);
    
    if (!user.wishlist.includes(eventId)) {
      user.wishlist.push(eventId);
      await user.save();
    }

    return NextResponse.json({ message: "Event added to wishlist", wishlist: user.wishlist });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { eventId } = await req.json();

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      result.user.id,
      { $pull: { wishlist: eventId } },
      { new: true }
    );

    return NextResponse.json({ message: "Event removed from wishlist", wishlist: user.wishlist });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
