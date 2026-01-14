import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Seed Admin
    const adminEmail = "eventhead@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("eventhead@2026", 12);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });
    }

    // Seed Events
    const existingEvents = await Event.countDocuments();
    if (existingEvents === 0) {
      const events = [
        {
          title: "Nagpur Elite Tech Summit 2024",
          description: "Join the tech leaders of Nagpur for a day of innovation and networking. Discover the latest in AI and Web3.",
          location: "Radisson Blu, Nagpur",
          price: 2499,
          image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070",
          category: "Conference",
          status: "Registration Open",
          date: new Date("2024-12-15"),
          capacity: 500
        },
        {
          title: "Orange City Music Festival",
          description: "A celebration of music and culture featuring local and national artists under the Nagpur stars.",
          location: "CP Club Grounds, Nagpur",
          price: 1299,
          image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070",
          category: "Music",
          status: "Limited Slots",
          date: new Date("2024-11-20"),
          capacity: 2000
        },
        {
          title: "Vidarbha Business Expo",
          description: "The largest gathering of entrepreneurs and business leaders in Vidarbha region.",
          location: "Suresh Bhat Auditorium, Nagpur",
          price: 499,
          image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2072",
          category: "Business",
          status: "Registration Open",
          date: new Date("2025-01-10"),
          capacity: 1000
        },
        {
          title: "Nagpur Gastronomy Night",
          description: "Experience the finest flavors of Nagpur in an exclusive culinary journey.",
          location: "Zero Mile Metro Station, Nagpur",
          price: 1899,
          image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070",
          category: "Food",
          status: "Selling Fast",
          date: new Date("2024-11-05"),
          capacity: 300
        },
        {
          title: "Futala Lake Marathon",
          description: "A morning run around the scenic Futala Lake to promote fitness in the city.",
          location: "Futala Lake, Nagpur",
          price: 299,
          image: "https://images.unsplash.com/photo-1461896756970-879e09bd245c?q=80&w=2070",
          category: "Sports",
          status: "Registration Open",
          date: new Date("2024-12-01"),
          capacity: 5000
        },
        {
          title: "Luxury Wedding Showcase",
          description: "Plan your dream wedding with Nagpur's premium vendors and designers.",
          location: "The Pride Hotel, Nagpur",
          price: 0,
          image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2046",
          category: "Exhibition",
          status: "Free Entry",
          date: new Date("2024-10-25"),
          capacity: 800
        }
      ];
      await Event.insertMany(events);
      return NextResponse.json({ message: "Admin and Events seeded successfully" }, { status: 201 });
    }

    return NextResponse.json({ message: "Seeding not needed (Admin exists, Events exist)" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
