"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Globe, 
  Instagram, 
  Twitter, 
  Phone, 
  User as UserIcon,
  Clock,
  LayoutList,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function AdminEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  const initialFormState = {
    title: "",
    description: "",
    location: "",
    fullAddress: "",
    googleMapUrl: "",
    price: "",
    image: "",
    category: "",
    date: "",
    capacity: "",
    highlights: [] as string[],
    organizer: {
      name: "",
      contact: "",
      social: { instagram: "", twitter: "", website: "" }
    },
    ticketTypes: [{ name: "General Admission", price: 0, description: "Standard entry ticket", quantityAvailable: 100 }],
    agenda: [{ time: "09:00 AM", activity: "Event Kickoff" }],
    gallery: [] as string[]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newHighlight, setNewHighlight] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push("/login");
      } else {
        fetchEvents();
      }
    }
  }, [authLoading, user, router]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingEvent ? "PUT" : "POST";
    const url = editingEvent ? `/api/events/${editingEvent._id}` : "/api/events";

    // Ensure numeric values are numbers
    const payload = {
      ...formData,
      price: Number(formData.price),
      capacity: formData.capacity ? Number(formData.capacity) : undefined,
      ticketTypes: formData.ticketTypes.map(t => ({ ...t, price: Number(t.price), quantityAvailable: Number(t.quantityAvailable) }))
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingEvent ? "Event updated" : "Event created");
        setIsModalOpen(false);
        setEditingEvent(null);
        setFormData(initialFormState);
        fetchEvents();
      } else {
        const error = await res.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event deleted");
        fetchEvents();
      }
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      fullAddress: event.fullAddress || "",
      googleMapUrl: event.googleMapUrl || "",
      price: event.price?.toString() || "",
      image: event.image || "",
      category: event.category || "",
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
      capacity: event.capacity?.toString() || "",
      highlights: event.highlights || [],
      organizer: {
        name: event.organizer?.name || "",
        contact: event.organizer?.contact || "",
        social: {
          instagram: event.organizer?.social?.instagram || "",
          twitter: event.organizer?.social?.twitter || "",
          website: event.organizer?.social?.website || ""
        }
      },
      ticketTypes: event.ticketTypes?.length ? event.ticketTypes : initialFormState.ticketTypes,
      agenda: event.agenda?.length ? event.agenda : initialFormState.agenda,
      gallery: event.gallery || []
    });
    setIsModalOpen(true);
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [...formData.ticketTypes, { name: "", price: 0, description: "", quantityAvailable: 0 }]
    });
  };

  const removeTicketType = (index: number) => {
    setFormData({
      ...formData,
      ticketTypes: formData.ticketTypes.filter((_, i) => i !== index)
    });
  };

  const addAgendaItem = () => {
    setFormData({
      ...formData,
      agenda: [...formData.agenda, { time: "", activity: "" }]
    });
  };

  const removeAgendaItem = (index: number) => {
    setFormData({
      ...formData,
      agenda: formData.agenda.filter((_, i) => i !== index)
    });
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({ ...formData, highlights: [...formData.highlights, newHighlight.trim()] });
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({ ...formData, highlights: formData.highlights.filter((_, i) => i !== index) });
  };

  const addGalleryImage = (url: string) => {
    setFormData({ ...formData, gallery: [...formData.gallery, url] });
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  if (loading && !isModalOpen) {
    return (
      <div className="min-h-screen bg-sapphire flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-sapphire p-8 md:p-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-pearl font-poppins font-bold text-4xl md:text-5xl">Event <span className="text-gold">Command Center</span></h1>
            <p className="text-pearl/50 font-inter mt-2">Design, Manage, and Track Nagpur's Elite Events</p>
          </div>
          <Button 
            onClick={() => {
              setEditingEvent(null);
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}
            className="bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase px-8 py-6 rounded-md h-auto"
          >
            <Plus className="mr-2" size={20} /> Create Global Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any) => (
            <motion.div 
              key={event._id}
              layout
              className="bg-white/5 border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => openEditModal(event)} className="p-3 bg-sapphire/80 text-gold rounded-xl backdrop-blur-sm hover:bg-gold hover:text-sapphire transition-all shadow-xl">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="p-3 bg-sapphire/80 text-red-400 rounded-xl backdrop-blur-sm hover:bg-red-400 hover:text-white transition-all shadow-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-gold/90 backdrop-blur-sm text-sapphire px-4 py-1 rounded-full text-[10px] font-poppins font-bold tracking-widest uppercase">
                  {event.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 text-gold font-poppins text-xs tracking-widest uppercase mb-4">
                  <Calendar size={14} /> {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <h3 className="text-pearl font-poppins font-bold text-2xl mb-4 italic leading-tight">{event.title}</h3>
                <div className="flex items-center gap-2 text-pearl/40 text-sm mb-8">
                  <MapPin size={16} className="text-gold" /> {event.location}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gold/10">
                  <div className="flex flex-col">
                    <span className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold mb-1">Starting From</span>
                    <span className="text-gold font-poppins font-bold text-2xl">₹{event.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold mb-1">Capacity</span>
                     <span className="text-pearl font-poppins font-bold">{event.capacity || 'Unlimited'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advanced Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-sapphire/95 backdrop-blur-xl"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-5xl bg-sapphire border border-gold/20 rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gold/10 flex items-center justify-between bg-white/5">
                <div>
                   <h2 className="text-pearl font-poppins font-bold text-3xl">
                    {editingEvent ? "Revise Experience" : "New Experience Design"}
                  </h2>
                  <p className="text-gold/50 font-inter text-xs uppercase tracking-[0.3em] mt-1">Configure all aspects of the event showcase</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white/5 text-pearl/40 hover:text-gold hover:bg-gold/10 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content - Scrollable Form */}
              <form onSubmit={handleSubmit} className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  {/* Left Column: Basic Info */}
                  <div className="space-y-12">
                    <section>
                      <h4 className="text-gold font-poppins font-bold text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
                        <LayoutList size={18} /> Primary Details
                      </h4>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Event Showcase Title</label>
                          <Input 
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl focus:border-gold transition-all"
                            placeholder="E.g. The Grand Nagpur Gala 2024"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Collection / Category</label>
                            <Input 
                              required
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl focus:border-gold transition-all"
                              placeholder="Wedding, Corporate..."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Event Date</label>
                            <Input 
                              type="date"
                              required
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl focus:border-gold transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Detailed Description (Rich Text Style)</label>
                          <textarea 
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-40 bg-white/5 border border-gold/10 rounded-xl p-4 text-pearl focus:outline-none focus:border-gold font-inter leading-relaxed"
                            placeholder="Describe the experience..."
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-gold font-poppins font-bold text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
                        <MapPin size={18} /> Location & Venue
                      </h4>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Venue Name / Short Location</label>
                          <Input 
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl focus:border-gold transition-all"
                            placeholder="The Ritz-Carlton, Nagpur"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Full Physical Address</label>
                          <Input 
                            value={formData.fullAddress}
                            onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                            className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl focus:border-gold transition-all"
                            placeholder="Plot 42, Civil Lines, Near High Court..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Google Maps Embed/Share URL</label>
                          <Input 
                            value={formData.googleMapUrl}
                            onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
                            className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl focus:border-gold transition-all"
                            placeholder="https://goo.gl/maps/..."
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                       <h4 className="text-gold font-poppins font-bold text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
                        <CheckCircle2 size={18} /> Experience Highlights
                      </h4>
                      <div className="flex gap-4 mb-4">
                        <Input 
                          value={newHighlight}
                          onChange={(e) => setNewHighlight(e.target.value)}
                          placeholder="E.g. Gourmet 5-Course Meal"
                          className="bg-white/5 border-gold/10 h-12 rounded-xl text-pearl"
                        />
                        <Button type="button" onClick={addHighlight} className="bg-gold text-sapphire h-12 px-6">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.highlights.map((h, i) => (
                          <div key={i} className="bg-white/10 px-4 py-2 rounded-full text-pearl text-xs flex items-center gap-2">
                            {h} <X size={14} className="cursor-pointer text-red-400" onClick={() => removeHighlight(i)} />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Visuals & Commerce */}
                  <div className="space-y-12">
                    <section>
                      <h4 className="text-gold font-poppins font-bold text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
                        <ImageIcon size={18} /> Visual Assets
                      </h4>
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Primary Banner (High Res)</label>
                          <ImageUpload 
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            onRemove={() => setFormData({ ...formData, image: "" })}
                            bucket="events"
                          />
                        </div>
                        <div className="space-y-4">
                           <label className="text-pearl/40 text-[10px] uppercase tracking-widest font-bold ml-1">Gallery Showcase (Previous Events)</label>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             {formData.gallery.map((img, i) => (
                               <div key={i} className="aspect-square relative rounded-xl overflow-hidden group">
                                  <img src={img} className="w-full h-full object-cover" />
                                  <button 
                                    type="button" 
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                               </div>
                             ))}
                             <div className="aspect-square">
                               <ImageUpload 
                                  value=""
                                  onChange={addGalleryImage}
                                  onRemove={() => {}}
                                  bucket="events"
                               />
                             </div>
                           </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-gold font-poppins font-bold text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
                        <IndianRupee size={18} /> Ticket Tiering
                      </h4>
                      <div className="space-y-6">
                         {formData.ticketTypes.map((ticket, i) => (
                           <div key={i} className="bg-white/5 border border-gold/10 p-6 rounded-2xl relative space-y-4">
                              <button 
                                type="button" 
                                onClick={() => removeTicketType(i)}
                                className="absolute top-4 right-4 text-pearl/20 hover:text-red-400 transition-colors"
                              >
                                <X size={16} />
                              </button>
                              <div className="grid grid-cols-2 gap-4">
                                <Input 
                                  placeholder="Tier Name (e.g. VIP)"
                                  value={ticket.name}
                                  onChange={(e) => {
                                    const updated = [...formData.ticketTypes];
                                    updated[i].name = e.target.value;
                                    setFormData({...formData, ticketTypes: updated});
                                  }}
                                  className="bg-sapphire border-gold/10 text-pearl"
                                />
                                <Input 
                                  type="number"
                                  placeholder="Price (₹)"
                                  value={ticket.price}
                                  onChange={(e) => {
                                    const updated = [...formData.ticketTypes];
                                    updated[i].price = Number(e.target.value);
                                    setFormData({...formData, ticketTypes: updated});
                                  }}
                                  className="bg-sapphire border-gold/10 text-pearl"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <Input 
                                  placeholder="Short Description"
                                  value={ticket.description}
                                  onChange={(e) => {
                                    const updated = [...formData.ticketTypes];
                                    updated[i].description = e.target.value;
                                    setFormData({...formData, ticketTypes: updated});
                                  }}
                                  className="bg-sapphire border-gold/10 text-pearl"
                                />
                                <Input 
                                  type="number"
                                  placeholder="Qty Available"
                                  value={ticket.quantityAvailable}
                                  onChange={(e) => {
                                    const updated = [...formData.ticketTypes];
                                    updated[i].quantityAvailable = Number(e.target.value);
                                    setFormData({...formData, ticketTypes: updated});
                                  }}
                                  className="bg-sapphire border-gold/10 text-pearl"
                                />
                              </div>
                           </div>
                         ))}
                         <Button type="button" onClick={addTicketType} variant="outline" className="w-full border-dashed border-gold/30 text-gold/60 hover:text-gold hover:bg-gold/5 py-8">
                           <Plus size={16} className="mr-2" /> Add New Ticket Tier
                         </Button>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-gold font-poppins font-bold text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
                        <UserIcon size={18} /> Organizer Portfolio
                      </h4>
                      <div className="space-y-4">
                        <Input 
                          placeholder="Organizer Brand Name"
                          value={formData.organizer.name}
                          onChange={(e) => setFormData({ ...formData, organizer: { ...formData.organizer, name: e.target.value } })}
                          className="bg-white/5 border-gold/10 h-14 rounded-xl text-pearl"
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="relative">
                             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={16} />
                             <Input 
                                placeholder="Contact Info"
                                value={formData.organizer.contact}
                                onChange={(e) => setFormData({ ...formData, organizer: { ...formData.organizer, contact: e.target.value } })}
                                className="pl-12 bg-white/5 border-gold/10 h-12 rounded-xl text-pearl"
                             />
                           </div>
                           <div className="relative">
                             <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40" size={16} />
                             <Input 
                                placeholder="Instagram Handle"
                                value={formData.organizer.social.instagram}
                                onChange={(e) => setFormData({ ...formData, organizer: { ...formData.organizer, social: { ...formData.organizer.social, instagram: e.target.value } } })}
                                className="pl-12 bg-white/5 border-gold/10 h-12 rounded-xl text-pearl"
                             />
                           </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Submit Block */}
                <div className="mt-20 pt-12 border-t border-gold/10 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="text-pearl/40 font-inter text-xs flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Preview Enabled
                    </div>
                    <div className="w-px h-4 bg-gold/10" />
                    Secure Cloud Storage Activated
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <Button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      variant="outline" 
                      className="flex-1 md:flex-none border-gold/20 text-pearl/60 hover:text-pearl h-16 px-12 rounded-2xl font-bold uppercase tracking-widest text-xs"
                    >
                      Discard Draft
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 md:flex-none bg-gold hover:bg-gold/90 text-sapphire h-16 px-16 rounded-2xl font-poppins font-bold tracking-[0.2em] uppercase text-sm shadow-[0_10px_30px_-10px_rgba(212,175,55,0.4)]"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : (editingEvent ? "Update Master Event" : "Launch Experience")}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
