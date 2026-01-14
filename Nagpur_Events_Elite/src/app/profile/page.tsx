"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { 
  User, 
  Settings, 
  MapPin, 
  Ticket, 
  Heart, 
  Lock, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  Fingerprint,
  Mail,
  Phone,
  Camera,
  Plus,
  Loader2,
  AlertCircle,
  X,
  Download,
  QrCode,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullUser, setFullUser] = useState<any>(null);
  const router = useRouter();

  // Tab labels and icons
  const tabs = [
    { id: "info", label: "Personal Details", icon: User },
    { id: "tickets", label: "My Tickets", icon: Ticket },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "security", label: "Security & Account", icon: Lock },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setFullUser(data.user);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is permanent.")) return;
    
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      if (res.ok) {
        toast.success("Account deleted");
        handleLogout();
      }
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sapphire flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-8 sticky top-32">
                <div className="flex flex-col items-center mb-10">
                  <div className="relative group w-full">
                    <ImageUpload 
                      value={fullUser?.image || ""}
                      onChange={async (url) => {
                        try {
                          const res = await fetch("/api/user/profile", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ image: url })
                          });
                          if (res.ok) {
                            toast.success("Profile photo updated");
                            fetchProfile();
                          }
                        } catch (error) {
                          toast.error("Failed to update photo");
                        }
                      }}
                      onRemove={async () => {
                        try {
                          const res = await fetch("/api/user/profile", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ image: "" })
                          });
                          if (res.ok) {
                            toast.success("Profile photo removed");
                            fetchProfile();
                          }
                        } catch (error) {
                          toast.error("Failed to remove photo");
                        }
                      }}
                      bucket="profiles"
                    />
                  </div>
                  <h2 className="text-2xl font-poppins font-bold text-pearl mt-6">{fullUser?.name}</h2>
                  <p className="text-pearl/40 text-sm font-inter mt-1 uppercase tracking-widest">{fullUser?.role}</p>
                </div>

              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 font-poppins text-sm tracking-widest uppercase font-semibold ${
                      activeTab === tab.id 
                        ? "bg-gold text-sapphire" 
                        : "text-pearl/60 hover:bg-white/5 hover:text-pearl"
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 font-poppins text-sm tracking-widest uppercase font-semibold text-red-400 hover:bg-red-400/10 mt-4"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 rounded-3xl border border-white/10 p-8 md:p-12"
              >
                {activeTab === "info" && <BasicInfoSection user={fullUser} onUpdate={fetchProfile} />}
                {activeTab === "tickets" && <TicketsSection />}
                {activeTab === "addresses" && <AddressesSection addresses={fullUser?.addresses || []} onUpdate={fetchProfile} />}
                {activeTab === "wishlist" && <WishlistSection />}
                {activeTab === "security" && (
                  <SecuritySection 
                    user={fullUser} 
                    onDelete={handleDeleteAccount} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}

function BasicInfoSection({ user, onUpdate }: { user: any; onUpdate: () => void }) {
    const [formData, setFormData] = useState({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      image: user?.image || ""
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name, phone: formData.phone, image: formData.image })
        });
        if (res.ok) {
          toast.success("Profile updated");
          onUpdate();
        }
      } catch (error) {
        toast.error("Update failed");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-12">
        <div>
          <h3 className="text-3xl font-poppins font-bold text-gold mb-2">Personal Details</h3>
          <p className="text-pearl/60">Manage your basic information and contact details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4 text-gold mb-4">
              <CheckCircle2 size={24} />
              <h4 className="font-poppins font-bold uppercase tracking-widest text-sm">Account Status</h4>
            </div>
            <p className="text-pearl font-inter flex items-center gap-2">
              {user?.isVerified ? "Email Verified" : "Verification Pending"}
              {user?.isVerified && <CheckCircle2 size={16} className="text-green-400" />}
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4 text-gold mb-4">
              <Calendar size={24} />
              <h4 className="font-poppins font-bold uppercase tracking-widest text-sm">Member Since</h4>
            </div>
            <p className="text-pearl font-inter">
              {new Date(user?.createdAt).toLocaleDateString("en-IN", { 
                month: "long", 
                year: "numeric",
                day: "numeric" 
              })}
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4 text-gold mb-4">
              <Fingerprint size={24} />
              <h4 className="font-poppins font-bold uppercase tracking-widest text-sm">User ID</h4>
            </div>
            <p className="text-pearl/40 font-mono text-xs">{user?._id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-pearl/60 text-xs font-poppins font-bold uppercase tracking-widest px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within:text-pearl transition-colors" size={20} />
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-12 bg-white/5 border-white/10 h-16 rounded-xl focus:border-gold focus:ring-1 focus:ring-gold transition-all text-pearl"
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-pearl/60 text-xs font-poppins font-bold uppercase tracking-widest px-1">Email Address</label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
                  <Input 
                    value={formData.email}
                    disabled
                    className="pl-12 bg-white/5 border-white/10 h-16 rounded-xl text-pearl"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-pearl/60 text-xs font-poppins font-bold uppercase tracking-widest px-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within:text-pearl transition-colors" size={20} />
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-12 bg-white/5 border-white/10 h-16 rounded-xl focus:border-gold focus:ring-1 focus:ring-gold transition-all text-pearl"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
            </div>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-gold hover:bg-gold/90 text-sapphire px-12 h-16 rounded-xl font-poppins font-bold tracking-widest uppercase text-sm"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </div>
    );
}

function TicketsSection() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/user/bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (error) {
        toast.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-3xl font-poppins font-bold text-gold mb-2">My Tickets</h3>
        <p className="text-pearl/60">History of your event bookings and upcoming tickets.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-16 text-center">
          <Ticket className="w-16 h-16 text-pearl/20 mx-auto mb-6" />
          <h4 className="text-pearl font-poppins font-bold text-xl mb-2">No tickets found</h4>
          <p className="text-pearl/40 mb-8">You haven't booked any events yet.</p>
          <Button asChild className="bg-gold text-sapphire px-8 rounded-full">
            <a href="/events">Browse Events</a>
          </Button>
        </div>
      ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col xl:flex-row">
                <div className="xl:w-64 h-48 xl:h-auto relative bg-sapphire">
                  {booking.event?.image && (
                    <Image src={booking.event.image} alt={booking.event.title} fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-sapphire/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      booking.entryStatus === 'USED' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {booking.entryStatus || 'NOT_USED'}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-1">
                  <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
                    <div>
                      <h4 className="text-2xl font-poppins font-bold text-pearl mb-2">{booking.event?.title}</h4>
                      <div className="flex flex-wrap gap-4 text-pearl/60 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gold" />
                          {new Date(booking.event?.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gold" />
                          {booking.event?.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-right">
                        <p className="text-pearl/40 text-[10px] uppercase font-bold tracking-widest">Ticket ID</p>
                        <p className="text-pearl font-mono font-bold">{booking.ticketId}</p>
                      </div>
                      {booking.qrCodeUrl && (
                        <div className="bg-white p-1 rounded-lg">
                          <Image src={booking.qrCodeUrl} alt="QR" width={48} height={48} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button asChild className="bg-gold text-sapphire hover:bg-gold/90 font-bold uppercase tracking-widest text-[10px] h-12">
                      <a href={booking.ticketPdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <Download size={14} /> Download Ticket
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="border-white/10 text-pearl hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-12">
                      <a href={booking.invoicePdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <Download size={14} /> Download Invoice
                      </a>
                    </Button>
                    <div className="flex items-center justify-center px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-pearl/40 text-[10px] font-bold uppercase tracking-widest">
                      Paid ₹{booking.amount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

function AddressesSection({ addresses, onUpdate }: { addresses: any[]; onUpdate: () => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Address added");
        setIsAdding(false);
        onUpdate();
        setFormData({ label: "Home", street: "", city: "", state: "", zipCode: "" });
      }
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch("/api/user/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Address removed");
        onUpdate();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-poppins font-bold text-gold mb-2">Saved Addresses</h3>
          <p className="text-pearl/60">Manage your delivery and billing addresses.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-gold text-sapphire rounded-xl h-12 flex items-center gap-2 px-6">
            <Plus size={18} /> Add New
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-gold/30 rounded-3xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest">Label (e.g. Home, Work)</label>
              <Input 
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                className="bg-sapphire border-white/10 text-pearl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest">Street Address</label>
              <Input 
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="bg-sapphire border-white/10 text-pearl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest">City</label>
              <Input 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="bg-sapphire border-white/10 text-pearl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest">State</label>
                <Input 
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="bg-sapphire border-white/10 text-pearl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest">ZIP Code</label>
                <Input 
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="bg-sapphire border-white/10 text-pearl"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="bg-gold text-sapphire px-8">Save Address</Button>
            <Button variant="ghost" type="button" onClick={() => setIsAdding(false)} className="text-pearl">Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr._id} className="bg-white/5 border border-white/10 rounded-2xl p-8 relative group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gold/20 rounded-xl text-gold">
                <MapPin size={20} />
              </div>
              <h4 className="text-xl font-poppins font-bold text-pearl">{addr.label}</h4>
            </div>
            <div className="space-y-1 text-pearl/60 font-inter">
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state} {addr.zipCode}</p>
              <p>{addr.country}</p>
            </div>
            <button 
              onClick={() => deleteAddress(addr._id)}
              className="absolute top-8 right-8 text-pearl/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {addresses.length === 0 && !isAdding && (
          <div className="md:col-span-2 py-16 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-pearl/20 font-poppins tracking-widest uppercase">No addresses saved</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistSection() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/user/wishlist");
        const data = await res.json();
        setWishlist(data.wishlist || []);
      } catch (error) {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (eventId: string) => {
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
      });
      if (res.ok) {
        toast.success("Removed from wishlist");
        setWishlist(wishlist.filter(e => e._id !== eventId));
      }
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-3xl font-poppins font-bold text-gold mb-2">My Wishlist</h3>
        <p className="text-pearl/60">Events you've saved for later.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-16 text-center">
          <Heart className="w-16 h-16 text-pearl/20 mx-auto mb-6" />
          <h4 className="text-pearl font-poppins font-bold text-xl mb-2">Your wishlist is empty</h4>
          <p className="text-pearl/40 mb-8">Save events you're interested in by clicking the heart icon.</p>
          <Button asChild className="bg-gold text-sapphire px-8 rounded-full">
            <a href="/events">Explore Events</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {wishlist.map((event) => (
            <div key={event._id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
              <div className="h-48 relative">
                {event.image && (
                  <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sapphire to-transparent opacity-60" />
                <button 
                  onClick={() => removeFromWishlist(event._id)}
                  className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-poppins font-bold text-pearl mb-2">{event.title}</h4>
                <p className="text-pearl/60 text-sm mb-6 line-clamp-2">{event.description}</p>
                <Button asChild className="w-full bg-gold text-sapphire font-bold uppercase tracking-widest text-xs h-12">
                  <a href={`/events/${event._id}`}>View Event</a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecuritySection({ user, onDelete }: { user: any; onDelete: () => void }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPassword: formData.currentPassword, 
          newPassword: formData.newPassword 
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-3xl font-poppins font-bold text-gold mb-2">Security & Account</h3>
        <p className="text-pearl/60">Update your credentials and manage account privacy.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          <h4 className="text-xl font-poppins font-bold text-pearl mb-8 flex items-center gap-4">
            <Lock className="text-gold" /> Change Password
          </h4>
          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest px-1">Current Password</label>
              <Input 
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                className="bg-sapphire border-white/10 text-pearl h-14"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest px-1">New Password</label>
              <Input 
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="bg-sapphire border-white/10 text-pearl h-14"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-pearl/40 tracking-widest px-1">Confirm New Password</label>
              <Input 
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="bg-sapphire border-white/10 text-pearl h-14"
                placeholder="••••••••"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gold text-sapphire px-12 h-14 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 md:p-12">
          <h4 className="text-xl font-poppins font-bold text-red-400 mb-4 flex items-center gap-4">
            <AlertCircle /> Danger Zone
          </h4>
          <p className="text-pearl/60 mb-8 max-w-2xl">
            Deleting your account is permanent and cannot be undone. All your bookings, tickets, 
            and personal data will be wiped from our systems.
          </p>
          <Button 
            onClick={onDelete}
            variant="ghost" 
            className="text-red-400 hover:bg-red-400 hover:text-white border border-red-500/20 h-14 px-12 font-bold uppercase tracking-widest text-xs"
          >
            Delete Account Forever
          </Button>
        </div>
      </div>
    </div>
  );
}
