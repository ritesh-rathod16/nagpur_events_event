import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await verifyToken();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since we're using a custom JWT auth, we'll assume verification is handled during login/sign-up
    // But if we want to keep the isVerified check, we'd need it in the JWT payload
    // if (!(session.user as any).isVerified) {
    //   return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    // }

    const { eventId, ticketIndex, quantity = 1 } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    await connectDB();
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Determine price based on ticket type
    let price = event.price;
    let ticketName = "General Admission";

    if (event.ticketTypes && event.ticketTypes.length > 0 && ticketIndex !== undefined) {
      const selectedTicket = event.ticketTypes[ticketIndex];
      if (selectedTicket) {
        price = selectedTicket.price;
        ticketName = selectedTicket.name;
      }
    }

    const totalAmount = price * quantity;

const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`.slice(0, 40),
      notes: {
        eventId: eventId,
        eventTitle: event.title,
        ticketName: ticketName,
        quantity: quantity.toString(),
        userId: (session.user as any).id,
        userEmail: session.user.email,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      event: {
        id: event._id,
        title: event.title,
        price: event.price,
        date: event.date,
        location: event.location,
        image: event.image,
      },
    });
  } catch (error: any) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
