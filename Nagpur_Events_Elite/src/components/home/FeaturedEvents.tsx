"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Timer, ArrowUpRight, MapPin, IndianRupee, Loader2 } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";

export function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.slice(0, 6)); // Show only top 6
    } catch (error) {
      console.error("Failed to fetch featured events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="events" className="py-32 bg-sapphire">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Our Portfolio</span>
            <h2 className="text-pearl font-poppins font-bold text-5xl md:text-6xl mb-6 leading-tight">Nagpur's Featured <span className="text-gold">Events</span></h2>
            <p className="text-pearl/50 font-inter text-lg">
              Explore our selection of the most prestigious events happening across Nagpur. 
              Each experience is meticulously planned for perfection.
            </p>
          </div>
          <Button asChild variant="outline" className="border-gold/30 hover:border-gold text-gold rounded-md px-8 py-6 h-auto font-poppins tracking-widest uppercase text-xs group">
            <Link href="/events">
              View All Events <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-gold" size={48} />
          </div>
        ) : (
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3 }}>
            <Masonry gutter="32px">
              {events.map((event: any, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: any; index: number }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book events");
      router.push("/login");
      return;
    }

    router.push(`/booking?eventId=${event._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative bg-white/5 border border-gold/10 overflow-hidden rounded-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <motion.img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sapphire via-sapphire/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <Badge className="bg-gold text-sapphire border-none rounded-full font-poppins font-bold text-[10px] tracking-widest uppercase py-1 px-4">
            {event.category}
          </Badge>
          <div className="flex items-center gap-2 bg-sapphire/50 backdrop-blur-md text-gold px-4 py-1 text-[10px] font-poppins font-bold tracking-widest uppercase rounded-full">
            {event.status}
          </div>
        </div>

        <button className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-pearl/60 hover:text-gold transition-colors z-20">
          <Heart size={18} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 text-gold font-poppins text-[10px] tracking-[0.3em] uppercase mb-3">
            <Timer size={12} />
            {new Date(event.date).toLocaleDateString('en-IN')}
          </div>
          <h3 className="text-pearl font-poppins font-bold text-2xl mb-2 italic">{event.title}</h3>
          <div className="flex items-center gap-2 text-pearl/60 text-sm font-inter mb-6">
            <MapPin size={14} className="text-gold" />
            {event.location}
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <span className="text-gold font-poppins font-bold text-xl flex items-center">
              <IndianRupee size={16} /> {event.price.toLocaleString('en-IN')}
            </span>
            <Button 
              onClick={handleBookNow}
              className="bg-gold hover:bg-gold/90 text-sapphire rounded-md font-poppins font-bold text-[10px] tracking-widest uppercase h-auto py-2.5 px-6"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
