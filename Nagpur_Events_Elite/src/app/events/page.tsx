"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { EventsFilter } from "@/components/events/EventsFilter";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Map as MapIcon, ChevronDown, Filter, Heart, MapPin, Timer, IndianRupee, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { AddEventModal } from "@/components/events/AddEventModal";
import EventsMap from "@/components/map/EventsMap";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

export default function EventsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // fetch wishlist when user logs in
    if (user) fetchWishlist();
    else setWishlistIds([]);
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/user/wishlist');
      if (!res.ok) return;
      const data = await res.json();
      const ids = (data.wishlist || []).map((e: any) => e._id || e);
      setWishlistIds(ids);
    } catch (e) {
      // silent
    }
  };

  const toggleWishlist = async (eventId: string) => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    const isW = wishlistIds.includes(eventId);
    try {
      if (!isW) {
        const res = await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId })
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const ids = (data.wishlist || []).map((e: any) => e._id || e);
        setWishlistIds(ids);
        toast.success('Added to wishlist');
      } else {
        const res = await fetch('/api/user/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId })
        });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const ids = (data.wishlist || []).map((e: any) => e._id || e);
        setWishlistIds(ids);
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const fetchEvents = async (filters: any = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set("search", filters.search);
      if (filters.location && filters.location !== "all") queryParams.set("location", filters.location);
      if (filters.categories && filters.categories.length > 0) queryParams.set("categories", filters.categories.join(","));
      if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);

      const res = await fetch(`/api/events?${queryParams.toString()}`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    fetchEvents(filters);
  };

  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      {/* Header */}
      <section className="pt-40 pb-20 bg-gradient-to-b from-sapphire/50 to-sapphire border-b border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Nagpur's Calendar</span>
              <h1 className="text-pearl font-poppins font-bold text-5xl md:text-7xl mb-6">Upcoming <span className="text-gold">Events</span></h1>
              <p className="text-pearl/50 font-inter text-lg">
                Discover the most exclusive gatherings, from royal weddings in Civil Lines to tech summits in MIHAN.
              </p>
            </div>
            
            <div className="flex bg-white/5 border border-gold/10 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-poppins text-xs font-bold tracking-widest uppercase ${
                  viewMode === "grid" ? "bg-gold text-sapphire shadow-lg" : "text-pearl/40 hover:text-pearl/60"
                }`}
              >
                <Grid size={16} /> Grid
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all font-poppins text-xs font-bold tracking-widest uppercase ${
                  viewMode === "map" ? "bg-gold text-sapphire shadow-lg" : "text-pearl/40 hover:text-pearl/60"
                }`}
              >
                <MapIcon size={16} /> Map
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <EventsFilter onFilterChange={handleFilterChange} />
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex flex-col gap-4">
                    <p className="text-pearl/40 font-poppins text-xs tracking-widest uppercase italic">
                      Showing {events.length} Nagpur Events
                    </p>
                    {user?.role === "admin" && (
                      <AddEventModal onEventAdded={() => fetchEvents()} />
                    )}
                  </div>
                  <div className="flex items-center gap-4">

                  <span className="text-pearl/40 font-poppins text-[10px] tracking-widest uppercase">Sort By:</span>
                  <button className="flex items-center gap-2 text-gold font-poppins text-[10px] tracking-widest uppercase font-bold">
                    Latest <ChevronDown size={14} />
                  </button>

                  {/* Mobile filter drawer trigger */}
                  <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <div className="lg:hidden">
                      <DrawerTrigger asChild>
                        <Button className="flex items-center gap-2 text-pearl/60 bg-white/5 border border-gold/10 px-4 py-2 rounded-md">
                          <Filter size={16} /> Filters
                        </Button>
                      </DrawerTrigger>
                    </div>

                    <DrawerContent direction="right" className="p-6">
                      <DrawerHeader className="flex items-center justify-between">
                        <DrawerTitle>Filters</DrawerTitle>
                        <DrawerClose asChild>
                          <Button variant="ghost">Close</Button>
                        </DrawerClose>
                      </DrawerHeader>

                      <div className="mt-4">
                        <EventsFilter onFilterChange={handleFilterChange} onClose={() => setFiltersOpen(false)} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-gold" size={48} />
                  </div>
                ) : viewMode === "grid" ? (
                  <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {events.map((event: any, i) => (
                      <EventCard 
                        key={event._id} 
                        event={event} 
                        index={i} 
                        isWishlisted={wishlistIds.includes(event._id)}
                        onToggleWishlist={() => toggleWishlist(event._id)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="map"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-[600px] bg-white/5 border border-gold/10 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  >
                      <div className="relative z-20 text-center p-6">
                      <h3 className="text-pearl font-poppins font-bold text-2xl mb-4 italic">Nagpur Interactive Map</h3>
                      <p className="text-pearl/60 font-inter mb-6 max-w-md mx-auto">Events are pinned on the map. Click a marker to view event details.</p>
                      <div className="mt-6">
                        <EventsMap events={events} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function EventCard({ event, index, isWishlisted, onToggleWishlist }: { event: any; index: number; isWishlisted: boolean; onToggleWishlist: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [pulse, setPulse] = useState(false);

  const handleViewDetails = () => {
    router.push(`/events/${event._id}`);
  };

  // Trigger a short pulse animation whenever wishlist state changes
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 350);
    return () => clearTimeout(t);
  }, [isWishlisted]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPulse(true);
    onToggleWishlist();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleViewDetails}
      className="group bg-white/5 border border-gold/10 hover:border-gold/30 transition-all rounded-xl overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-gold text-sapphire border-none rounded-full font-poppins font-bold text-[10px] tracking-widest uppercase py-1 px-4">
            {event.category}
          </Badge>
        </div>
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center transition-colors ${isWishlisted ? 'bg-gold text-sapphire' : 'text-pearl/60 hover:text-gold'}`}
          aria-pressed={isWishlisted}
        >
          <motion.span
            animate={{ scale: pulse ? 1.18 : 1 }}
            transition={{ type: 'spring', stiffness: 700, damping: 20 }}
            className="flex items-center justify-center"
          >
            <Heart size={18} />
          </motion.span>
        </button>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-2 text-gold font-poppins text-[10px] tracking-widest uppercase mb-4">
          <Timer size={14} /> {new Date(event.date).toLocaleDateString('en-IN')}
        </div>
        <h3 className="text-pearl font-poppins font-bold text-2xl mb-2 group-hover:text-gold transition-colors italic">{event.title}</h3>
        <div className="flex items-center gap-2 text-pearl/40 text-sm font-inter mb-8">
          <MapPin size={14} className="text-gold" /> {event.location}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gold/10">
          <span className="text-pearl font-poppins font-bold text-xl flex items-center gap-1">
            <IndianRupee size={16} /> {event.price.toLocaleString('en-IN')}
          </span>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase text-[10px] rounded-md h-auto py-3 px-6"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
