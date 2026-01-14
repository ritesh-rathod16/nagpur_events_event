import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const result = await verifyToken();
    
    if (!result || !result.user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(result.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
