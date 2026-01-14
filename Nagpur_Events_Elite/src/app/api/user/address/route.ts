import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const address = await req.json();

    await dbConnect();
    const user = await User.findById(result.user.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.addresses.push(address);
    await user.save();

    return NextResponse.json({ message: "Address added", addresses: user.addresses });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { id, ...update } = await req.json();

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { _id: result.user.id, "addresses._id": id },
      { $set: { "addresses.$": { ...update, _id: id } } },
      { new: true }
    );

    if (!user) return NextResponse.json({ message: "User or address not found" }, { status: 404 });

    return NextResponse.json({ message: "Address updated", addresses: user.addresses });
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

    const { id } = await req.json();

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      result.user.id,
      { $pull: { addresses: { _id: id } } },
      { new: true }
    );

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Address deleted", addresses: user.addresses });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
