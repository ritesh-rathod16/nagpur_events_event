"use client";

import { motion } from "framer-motion";
import { 
  Music, 
  Camera, 
  Utensils, 
  Sparkles, 
  Mic2, 
  Video, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    title: "Corporate Events",
    description: "Elegant professional gatherings, conferences, and gala dinners tailored for Nagpur's business elite.",
    icon: Mic2,
    color: "bg-blue-500",
  },
  {
    title: "Weddings & Socials",
    description: "Exquisite wedding planning and social celebrations that capture the vibrant spirit of Nagpur.",
    icon: Sparkles,
    color: "bg-pink-500",
  },
  {
    title: "Live Entertainment",
    description: "Curated musical performances, DJs, and live acts to elevate your event's atmosphere.",
    icon: Music,
    color: "bg-purple-500",
  },
  {
    title: "Gourmet Catering",
    description: "Delectable culinary experiences featuring both authentic Nagpur cuisine and international flavors.",
    icon: Utensils,
    color: "bg-orange-500",
  },
  {
    title: "Photography & Cinema",
    description: "Capturing your precious moments with cinematic precision and artistic storytelling.",
    icon: Camera,
    color: "bg-cyan-500",
  },
  {
    title: "Digital Production",
    description: "High-end sound, lighting, and visual production for a truly immersive experience.",
    icon: Video,
    color: "bg-indigo-500",
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="py-32 bg-sapphire border-t border-gold/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">What We Offer</span>
          <h2 className="text-pearl font-poppins font-bold text-5xl md:text-6xl mb-6 leading-tight">Elite <span className="text-gold">Services</span> for Extraordinary Occasions</h2>
          <p className="text-pearl/50 font-inter text-lg">
            From meticulous planning to flawless execution, we provide a comprehensive suite of services designed to make your Nagpur event truly unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-gold/10 hover:border-gold/30 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <service.icon className="text-gold w-8 h-8" />
              </div>
              <h3 className="text-pearl font-poppins font-bold text-2xl mb-4 group-hover:text-gold transition-colors">{service.title}</h3>
              <p className="text-pearl/50 font-inter mb-8 leading-relaxed">
                {service.description}
              </p>
              <Link 
                href="/services" 
                className="inline-flex items-center text-gold font-poppins font-bold text-xs tracking-widest uppercase group/link"
              >
                Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button asChild className="bg-gold hover:bg-gold/90 text-sapphire px-10 py-8 rounded-md font-poppins font-bold tracking-widest uppercase text-sm h-auto">
            <Link href="/services">Explore All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
