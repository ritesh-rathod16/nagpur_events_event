import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function PATCH(req: Request) {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { name, phone, image } = await req.json();

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      result.user.id,
      { $set: { name, phone, image } },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated", user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const result = await verifyToken();
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    await User.findByIdAndDelete(result.user.id);

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
