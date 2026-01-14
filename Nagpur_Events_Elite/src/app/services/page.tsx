"use client";

import { Header } from "@/components/layout/Header";
import { motion } from "framer-motion";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Utensils, 
  Music, 
  Camera, 
  LayoutPanelTop, 
  Heart, 
  Briefcase, 
  PartyPopper, 
  Tv, 
  Settings,
  MapPin,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Wedding & Social Events",
    icon: Heart,
    features: ["Bespoke Décor", "Thematic Lighting", "Guest Management", "Photography & Cinematography", "Catering & Menu Planning", "Invitation Suites"]
  },
  {
    title: "Corporate Events",
    icon: Briefcase,
    features: ["Conferences & Seminars", "Product Launches", "Annual Meetups", "Award Ceremonies", "Branding & Collaterals", "Technical AV Setup"]
  },
  {
    title: "Private & Special Occasions",
    icon: PartyPopper,
    features: ["Luxury Birthday Bashes", "Anniversary Celebrations", "Intimate Soirées", "Baby Showers", "Custom Theme Styling", "Cake & Dessert Bar"]
  },
  {
    title: "Entertainment & Production",
    icon: Tv,
    features: ["Artist & Celebrity Booking", "Live Bands & DJs", "Sound & Lighting Production", "Stage & LED Walls", "Special Effects", "Performances"]
  },
  {
    title: "Planning & Event Management",
    icon: Settings,
    features: ["Full Service Planning", "Venue Selection", "Budget Management", "Vendor Coordination", "On-site Coordination", "Logistics & Security"]
  }
];

const packages = [
  {
    name: "Silver Package",
    description: "Ideal for small social gatherings and intimate celebrations with high-quality essentials.",
    icon: Star,
    features: [
      "Standard Venue Setup",
      "Essential Lighting",
      "Sound System (Basic)",
      "Standard Decor Elements",
      "On-site Supervisor",
      "Basic Photography"
    ],
    bestSuited: "Birthdays, Small Anniversaries, Intimate Meets",
    featured: false
  },
  {
    name: "Gold Package",
    description: "A premium choice for weddings and corporate galas requiring sophisticated management.",
    icon: Zap,
    features: [
      "Themed Decor & Floral",
      "Professional Sound & Light",
      "Guest Concierge Service",
      "Full Media Coverage",
      "Catering Management",
      "Lead Planner & Assistant"
    ],
    bestSuited: "Weddings, Corporate Launches, Large Parties",
    featured: true
  },
  {
    name: "Platinum Package",
    description: "Pure luxury and grandeur for Nagpur's most elite events. Every detail meticulously crafted.",
    icon: Crown,
    features: [
      "International Decor Standards",
      "Celebrity Artist Management",
      "High-End Cinematography",
      "Gourmet Catering curation",
      "Luxury Transport Logistics",
      "Dedicated Project Director"
    ],
    bestSuited: "Grand Weddings, Elite Corporate Summits",
    featured: false
  },
  {
    name: "Custom Elite",
    description: "A blank canvas for your imagination. Fully personalized and limitless possibilities.",
    icon: LayoutPanelTop,
    features: [
      "Concept Development",
      "Global Vendor Sourcing",
      "VIP Security Protocols",
      "Technology Integration",
      "Custom Gifting Solutions",
      "Total Event Privacy"
    ],
    bestSuited: "Unique, One-of-a-Kind Experiences",
    featured: false
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Elite Solutions</span>
            <h1 className="text-pearl font-poppins font-bold text-5xl md:text-7xl mb-8 leading-tight">Exquisite <span className="text-gold">Services</span> For<br />Every Milestone</h1>
            <p className="text-pearl/50 font-inter text-lg max-w-2xl mx-auto mb-12">
              Nagpur's premier event management firm, delivering luxury, trust, and reliability since inception.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild className="bg-gold hover:bg-gold/90 text-sapphire px-10 py-7 rounded-md font-poppins font-bold tracking-widest uppercase text-sm h-auto">
                <Link href="/booking">Book Now</Link>
              </Button>
              <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-sapphire px-10 py-7 rounded-md font-poppins font-bold tracking-widest uppercase text-sm h-auto">
                <Link href="/contact">Get Free Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 border-y border-gold/10 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-pearl font-poppins font-bold text-4xl md:text-5xl mb-4">Our <span className="text-gold">Expertise</span></h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6 rounded-full" />
            <p className="text-pearl/40 font-inter max-w-xl mx-auto uppercase tracking-widest text-xs font-bold">Comprehensive solutions for every occasion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-sapphire border border-gold/10 rounded-2xl hover:border-gold/30 transition-all group relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <service.icon size={100} />
                </div>
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform">
                  <service.icon size={28} />
                </div>
                <h3 className="text-pearl font-poppins font-bold text-xl mb-6 group-hover:text-gold transition-colors">{service.title}</h3>
                <ul className="space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-pearl/60 text-xs font-inter font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" /> {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-primary font-poppins font-bold text-4xl md:text-5xl mb-6">Service <span className="text-gold">Packages</span></h2>
            <p className="text-muted-foreground font-inter max-w-xl mx-auto italic">Curated experiences designed to exceed expectations. Pricing available on request.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-10 rounded-3xl border flex flex-col h-full ${
                  pkg.featured ? "border-gold shadow-2xl scale-105 z-10 bg-white" : "border-gold/10 bg-white"
                } transition-all hover:shadow-xl`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-sapphire px-6 py-1 rounded-full text-[10px] font-poppins font-bold tracking-widest uppercase">
                    Premium Choice
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl ${pkg.featured ? "bg-gold/20" : "bg-primary/5"} flex items-center justify-center text-gold mb-8`}>
                  <pkg.icon size={24} />
                </div>
                <h3 className="text-primary font-poppins font-bold text-2xl mb-2 italic">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-primary font-poppins font-bold text-xl">Pricing on Request</span>
                </div>
                <p className="text-muted-foreground text-sm font-inter mb-8 leading-relaxed">{pkg.description}</p>
                <div className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-primary/70 text-xs font-inter font-semibold">
                      <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-gold" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-gold/10 mb-8">
                   <p className="text-[10px] font-poppins font-bold uppercase tracking-widest text-gold mb-1">Best Suited For</p>
                   <p className="text-primary/60 text-xs font-inter">{pkg.bestSuited}</p>
                </div>
                <Button asChild className={`w-full py-8 font-poppins font-bold tracking-widest uppercase text-xs rounded-xl ${
                  pkg.featured ? "bg-gold hover:bg-gold/90 text-sapphire shadow-lg" : "bg-primary hover:bg-primary/90 text-white"
                }`}>
                  <Link href="/booking">Select Package</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Served */}
      <section className="py-24 bg-sapphire border-y border-gold/10">
        <div className="container mx-auto px-6">
           <div className="bg-gold p-12 md:p-20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12">
              <div>
                <h2 className="text-sapphire font-poppins font-bold text-4xl mb-4">Central India's Premier Choice</h2>
                <p className="text-sapphire/70 font-poppins font-bold tracking-widest uppercase text-sm">Now Serving the entire Nagpur Region & Surroundings</p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {["Nagpur City", "Wardha", "Amravati", "Chandrapur", "Gondia"].map((city) => (
                    <div key={city} className="px-6 py-3 bg-sapphire/10 border border-sapphire/20 rounded-full text-sapphire font-poppins font-bold text-sm">
                      {city}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Portfolio CTA */}
      <section className="py-32">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-pearl font-poppins font-bold text-4xl mb-12">Witness Our <span className="text-gold">Grandeur</span></h2>
           <div className="grid grid-cols-3 gap-3 md:gap-6 mb-16">
              {[
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2096&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2062&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
              ].map((img, i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden group border border-gold/10">
                   <Image src={img} alt="Portfolio" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-sapphire to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                </div>
              ))}
           </div>
           <Button asChild className="bg-gold hover:bg-gold/90 text-sapphire px-12 py-8 rounded-full font-poppins font-bold tracking-widest uppercase text-sm h-auto">
              <Link href="/events">View All Past Events <ChevronRight className="ml-2" /></Link>
           </Button>
        </div>
      </section>

    </main>
  );
}
