import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const newContact = await Contact.create({
      name,
      email,
      message,
    });

    return NextResponse.json({ 
      message: "Message saved successfully",
      contactId: newContact._id 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
