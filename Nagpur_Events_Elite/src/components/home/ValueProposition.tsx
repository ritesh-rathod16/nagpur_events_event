"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Heart, Check, Zap, Globe } from "lucide-react";
import { useState } from "react";

const props = [
  {
    title: "Nagpur Expertise",
    icon: MapPin,
    morphIcon: Check,
    description: "15+ years of dedicated service in the Nagpur region. We understand the city's pulse and logistics like no one else."
  },
  {
    title: "Local Network",
    icon: Users,
    morphIcon: Zap,
    description: "Strong, exclusive relationships with Nagpur's premier venues and local vendors to ensure competitive pricing and priority service."
  },
  {
    title: "Cultural Mastery",
    icon: Heart,
    morphIcon: Heart,
    description: "Deep expertise in Marathi traditions and multicultural celebrations. We bring local cultural nuances to life with elegance."
  }
];

export function ValueProposition() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">The Elite Advantage</span>
          <h2 className="text-primary font-poppins font-bold text-4xl md:text-5xl mb-6 leading-tight">Why Choose <span className="text-gold">NagpurEvents Elite?</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {props.map((prop, i) => (
            <PropCard key={prop.title} prop={prop} index={i} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}

function PropCard({ prop, index }: { prop: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group p-10 border border-gold/10 hover:border-gold/40 transition-all duration-500 bg-white shadow-sm hover:shadow-xl relative rounded-xl"
    >
      <div className="mb-8 relative w-16 h-16">
        <div className="absolute inset-0 bg-gold/10 rounded-full scale-150 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <motion.div
          animate={isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
          className="relative z-10 w-full h-full flex items-center justify-center text-gold border border-gold/20 rounded-lg"
        >
          {isHovered ? <prop.morphIcon size={32} /> : <prop.icon size={32} />}
        </motion.div>
      </div>
      <h3 className="text-primary font-poppins font-bold text-2xl mb-4 group-hover:text-gold transition-colors">{prop.title}</h3>
      <p className="text-muted-foreground font-inter text-sm leading-relaxed mb-6">
        {prop.description}
      </p>
      <motion.div 
        animate={{ width: isHovered ? "100%" : "0%" }}
        className="h-0.5 bg-gold absolute bottom-0 left-0"
      />
    </motion.div>
  );
}
