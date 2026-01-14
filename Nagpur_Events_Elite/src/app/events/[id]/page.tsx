"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";
import { 
  Calendar, MapPin, Share2, Heart, Users, ShieldCheck, 
  Clock, IndianRupee, Info, Phone, Instagram, Twitter, 
  Globe, ArrowLeft, Star, ChevronRight, Ticket, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        toast.error("Failed to load event details");
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id, router]);

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book tickets");
      router.push("/login");
      return;
    }
    router.push(`/booking?eventId=${event._id}&ticketIndex=${selectedTicket}&quantity=${quantity}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sapphire flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-IN', { 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <main className="min-h-screen bg-sapphire selection:bg-gold selection:text-sapphire">
      <Header />
      
      {/* Hero Header */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sapphire/80 via-sapphire to-sapphire" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link 
            href="/events" 
            className="inline-flex items-center gap-2 text-gold font-poppins text-xs tracking-widest uppercase mb-8 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={14} /> Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Banner Image */}
            <div className="lg:col-span-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-gold/10 shadow-2xl"
              >
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-3">
                  <Badge className="bg-gold text-sapphire border-none rounded-full font-poppins font-bold text-xs tracking-widest uppercase py-1.5 px-6">
                    {event.category}
                  </Badge>
                  <Badge className="glass text-pearl border-none rounded-full font-poppins font-bold text-xs tracking-widest uppercase py-1.5 px-6">
                    {event.status}
                  </Badge>
                </div>
              </motion.div>
            </div>

            {/* Quick Info Sidebar */}
            <div className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-gold/10 p-8 rounded-2xl h-full flex flex-col justify-between"
              >
                <div>
                  <h1 className="text-pearl font-poppins font-bold text-3xl md:text-4xl mb-6 leading-tight italic">
                    {event.title}
                  </h1>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-pearl font-poppins font-semibold text-sm">{formattedDate}</p>
                        <p className="text-pearl/40 font-inter text-xs mt-1">{formattedTime} onwards</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-pearl font-poppins font-semibold text-sm">{event.location}</p>
                        <p className="text-pearl/40 font-inter text-xs mt-1">{event.fullAddress || "Location details provided upon booking"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <IndianRupee size={20} />
                      </div>
                      <div>
                        <p className="text-pearl font-poppins font-semibold text-sm">Starts from ₹{event.price.toLocaleString('en-IN')}</p>
                        <p className="text-pearl/40 font-inter text-xs mt-1">Per Person</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gold/10">
                  <div className="flex gap-4 mb-6">
                    <Button 
                      onClick={handleShare}
                      variant="outline" 
                      className="flex-1 border-gold/20 text-gold hover:bg-gold hover:text-sapphire font-poppins uppercase tracking-widest text-[10px] py-6"
                    >
                      <Share2 size={16} className="mr-2" /> Share
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-14 border-gold/20 text-pearl/40 hover:text-gold font-poppins py-6"
                    >
                      <Heart size={16} />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase py-8 h-auto shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                  >
                    Book Tickets Now
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-gold font-poppins font-bold text-2xl mb-8 flex items-center gap-3 italic">
                  <Info size={24} className="not-italic" /> About the Event
                </h2>
                <div className="text-pearl/70 font-inter text-lg leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="bg-white/5 border border-gold/10 p-10 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-gold/5 pointer-events-none">
                    <Star size={120} />
                  </div>
                  <h2 className="text-gold font-poppins font-bold text-2xl mb-8 flex items-center gap-3 italic">
                    Event Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.highlights.map((highlight: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-sapphire transition-colors">
                          <CheckCircle2 size={14} />
                        </div>
                        <p className="text-pearl/80 font-inter text-sm">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda / Schedule */}
              {event.agenda && event.agenda.length > 0 && (
                <div>
                  <h2 className="text-gold font-poppins font-bold text-2xl mb-8 flex items-center gap-3 italic">
                    <Clock size={24} className="not-italic" /> Event Schedule
                  </h2>
                  <div className="space-y-4">
                    {event.agenda.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-white/5 border border-gold/5 rounded-2xl hover:border-gold/20 transition-all">
                        <div className="w-24 shrink-0 text-gold font-poppins font-bold text-sm tracking-tighter">
                          {item.time}
                        </div>
                        <div className="h-8 w-px bg-gold/10" />
                        <div className="text-pearl font-inter text-sm font-medium">
                          {item.activity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue / Map */}
              <div>
                <h2 className="text-gold font-poppins font-bold text-2xl mb-8 flex items-center gap-3 italic">
                  <MapPin size={24} className="not-italic" /> Venue & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-8 bg-white/5 border border-gold/10 rounded-2xl">
                    <h4 className="text-pearl font-poppins font-bold text-lg mb-2">{event.location}</h4>
                    <p className="text-pearl/60 font-inter text-sm mb-6">{event.fullAddress}</p>
                    {/** Directions link: prefer coords, then googleMapUrl, then fullAddress, then title fallback */}
                    {(() => {
                      const coordsAvailable = event.locationLat && event.locationLng;
                      const coordsHref = coordsAvailable ? `https://www.google.com/maps/dir/?api=1&destination=${event.locationLat},${event.locationLng}&travelmode=driving` : null;
                      const urlHref = event.googleMapUrl || (event.fullAddress ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.fullAddress)}&travelmode=driving` : null);
                      const fallbackHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.title || 'Nagpur')}`;
                      const href = coordsHref || urlHref || fallbackHref;
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gold p-0 font-poppins uppercase tracking-widest text-[10px] h-auto">
                          Get Directions <ChevronRight size={14} className="ml-1" />
                        </a>
                      );
                    })()}
                  </div>
                  <div className="p-8 bg-white/5 border border-gold/10 rounded-2xl">
                    <h4 className="text-pearl font-poppins font-bold text-lg mb-2 italic">Entry Details</h4>
                    <p className="text-pearl/60 font-inter text-sm leading-relaxed">
                      Please carry a valid photo ID. Entry gates open 30 minutes before the scheduled start time. 
                    </p>
                  </div>
                </div>
                {event.googleMapUrl && (
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gold/10">
                    <iframe 
                      src={event.googleMapUrl} 
                      className="w-full h-full border-none grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <div>
                  <h2 className="text-gold font-poppins font-bold text-2xl mb-8 flex items-center gap-3 italic">
                    Previous Event Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((img: string, i: number) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gold/10 group">
                        <img 
                          src={img} 
                          alt={`Gallery ${i}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-gold font-poppins font-bold text-2xl flex items-center gap-3 italic">
                    Attendee Reviews
                  </h2>
                  <div className="flex items-center gap-2 text-gold">
                    <Star size={18} fill="currentColor" />
                    <span className="font-poppins font-bold text-xl">4.9</span>
                    <span className="text-pearl/40 font-inter text-sm">(120 reviews)</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-8 bg-white/5 border border-gold/5 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/20 flex items-center justify-center text-gold font-poppins font-bold">
                            {i === 1 ? "RA" : "VK"}
                          </div>
                          <div>
                            <p className="text-pearl font-poppins font-bold text-sm">{i === 1 ? "Rahul Agrawal" : "Vinay Kulkarni"}</p>
                            <div className="flex text-gold">
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                            </div>
                          </div>
                        </div>
                        <span className="text-pearl/20 font-inter text-[10px] uppercase tracking-widest">Verified Attendee</span>
                      </div>
                      <p className="text-pearl/60 font-inter text-sm leading-relaxed italic">
                        "Absolutely phenomenal event! The hospitality and management in Nagpur were top-notch. Highly recommended for anyone looking for premium experiences."
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Booking / Organizer */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Ticket Selector Card */}
              <div className="sticky top-32 space-y-8">
                <div className="bg-white/5 border border-gold/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />
                  
                  <h3 className="text-pearl font-poppins font-bold text-xl mb-6 flex items-center gap-2 italic">
                    <Ticket size={20} className="not-italic text-gold" /> Select Tickets
                  </h3>

                  <div className="space-y-4 mb-8">
                    {(event.ticketTypes || [{ name: "General Admission", price: event.price, description: "Standard entry ticket" }]).map((ticket: any, i: number) => (
                      <button 
                        key={i}
                        onClick={() => setSelectedTicket(i)}
                        className={`w-full p-6 rounded-2xl border transition-all text-left ${
                          selectedTicket === i 
                          ? "bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
                          : "bg-transparent border-gold/10 hover:border-gold/30"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className={`font-poppins font-bold text-sm ${selectedTicket === i ? "text-gold" : "text-pearl"}`}>
                            {ticket.name}
                          </p>
                          <p className="text-gold font-poppins font-bold text-lg">₹{ticket.price.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-pearl/40 font-inter text-xs">{ticket.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-8 p-4 bg-sapphire/50 rounded-xl border border-gold/10">
                    <p className="text-pearl/60 font-inter text-xs uppercase tracking-widest">Quantity</p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-sapphire transition-all"
                      >-</button>
                      <span className="text-pearl font-poppins font-bold">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-sapphire transition-all"
                      >+</button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gold/10 mb-8">
                    <div className="flex justify-between items-center">
                      <p className="text-pearl/40 font-inter text-sm italic">Total Payable</p>
                      <p className="text-gold font-poppins font-bold text-3xl">
                        ₹{( (event.ticketTypes?.[selectedTicket]?.price || event.price) * quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase py-6 h-auto"
                  >
                    Confirm Booking
                  </Button>
                  
                  <p className="mt-4 text-center text-pearl/20 font-inter text-[10px] uppercase tracking-[0.2em]">
                    <ShieldCheck size={12} className="inline mr-1" /> Secure Checkout
                  </p>
                </div>

                {/* Organizer Details */}
                <div className="bg-white/5 border border-gold/10 p-8 rounded-3xl">
                  <h3 className="text-pearl font-poppins font-bold text-lg mb-6 italic">Organized By</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                      <Users size={32} />
                    </div>
                    <div>
                      <h4 className="text-pearl font-poppins font-bold">{event.organizer?.name || "Orchids Events Nagpur"}</h4>
                      <p className="text-pearl/40 font-inter text-xs">Certified Event Partner</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {event.organizer?.contact && (
                      <div className="flex items-center gap-3 text-pearl/60 hover:text-gold transition-colors text-sm font-inter">
                        <Phone size={14} /> {event.organizer.contact}
                      </div>
                    )}
                    <div className="flex gap-4 pt-2">
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-pearl/40 hover:text-gold hover:bg-gold/10 transition-all">
                        <Instagram size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-pearl/40 hover:text-gold hover:bg-gold/10 transition-all">
                        <Twitter size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-pearl/40 hover:text-gold hover:bg-gold/10 transition-all">
                        <Globe size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Refund Policy */}
                <div className="p-6 bg-gold/5 border border-gold/10 rounded-2xl">
                  <h4 className="text-gold font-poppins font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldCheck size={14} /> Refund Policy
                  </h4>
                  <p className="text-pearl/40 font-inter text-xs leading-relaxed">
                    {event.refundPolicy || "Refunds are available up to 24 hours before the event start time. Transaction fees are non-refundable."}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
