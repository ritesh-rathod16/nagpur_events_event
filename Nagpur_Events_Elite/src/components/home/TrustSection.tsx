"use client";

import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ShieldCheck, Headphones, Trophy, Star, Users, MapPin } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

const companies = [
  "TCS Nagpur", "Infosys Mihan", "Tata Motors", "Wipro Nagpur", "Tech Mahindra", 
  "HCL Tech", "Persistent Systems", "KPIT Technologies", "Zensar", 
  "NMC Nagpur", "VNIT Nagpur", "Nagpur Metro", "Orange City Water", "NIT Nagpur"
];

const badges = [
  { icon: ShieldCheck, text: "GST Registered" },
  { icon: Headphones, text: "24/7 Local Support" },
  { icon: Trophy, text: "Nagpur Excellence 2024" },
  { icon: MapPin, text: "Nagpur Rooted" }
];

export function TrustSection() {
  const [eventCount, setEventCount] = useState(1150);

  useEffect(() => {
    const interval = setInterval(() => {
      setEventCount(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-sapphire border-y border-gold/10 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Logo Marquee */}
        <div className="mb-20">
          <p className="text-center text-pearl/40 font-poppins text-xs tracking-[0.4em] uppercase mb-12">Our Esteemed Nagpur Partners</p>
          <Marquee gradient={true} gradientColor="rgb(10, 37, 64)" speed={40}>
            {companies.map((company) => (
              <span 
                key={company} 
                className="mx-16 text-pearl/30 text-2xl font-poppins font-bold hover:text-gold/50 transition-colors cursor-default"
              >
                {company}
              </span>
            ))}
          </Marquee>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Live Counter */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-gold font-poppins text-[10px] tracking-widest uppercase font-bold">Nagpur Impact</span>
            </div>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-pearl font-poppins font-bold text-7xl md:text-8xl">
                <NumberFlow value={eventCount} format={{ useGrouping: true }} />
              </span>
              <span className="text-gold font-poppins text-4xl md:text-5xl">+</span>
            </div>
            <h3 className="text-pearl font-poppins text-xl tracking-[0.2em] uppercase mb-6">Events Successfully Managed</h3>
            <p className="text-pearl/50 font-inter text-sm max-w-md leading-relaxed">
              Serving 800+ Nagpur businesses and families. Our local expertise ensures your events in Nagpur are executed with precision and cultural grace.
            </p>
            <div className="mt-8 flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-pearl font-bold text-2xl">98%</span>
                  <span className="text-gold text-[10px] uppercase tracking-wider">Satisfaction</span>
               </div>
               <div className="h-10 w-[1px] bg-gold/20" />
               <div className="flex flex-col">
                  <span className="text-pearl font-bold text-2xl">15+</span>
                  <span className="text-gold text-[10px] uppercase tracking-wider">Years Experience</span>
               </div>
            </div>
          </motion.div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 gap-6">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white/5 border border-gold/10 hover:border-gold/30 transition-all group rounded-lg"
              >
                <badge.icon className="text-gold mb-6 group-hover:scale-110 transition-transform" size={32} />
                <p className="text-pearl font-poppins text-xs tracking-widest uppercase leading-tight">{badge.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
