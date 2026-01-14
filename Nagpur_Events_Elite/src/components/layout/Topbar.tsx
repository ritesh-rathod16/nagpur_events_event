"use client";

import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Topbar() {
  return (
    <div className="bg-sapphire-dark border-b border-gold/10 py-2 hidden md:block">
      <div className="container mx-auto px-6 flex justify-between items-center text-[10px] tracking-[0.2em] uppercase font-bold text-gold/60">
        <div className="flex gap-8">
          <a href="tel:+917721874530" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Phone size={12} className="text-gold" />
            +91 77218 74530
          </a>
          <a href="mailto:contact@nagpurevents.in" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Mail size={12} className="text-gold" />
            contact@nagpurevents.in
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-gold" />
            Nagpur, Maharashtra
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="hover:text-gold transition-colors"><Instagram size={14} /></a>
          <a href="#" className="hover:text-gold transition-colors"><Facebook size={14} /></a>
          <a href="#" className="hover:text-gold transition-colors"><Twitter size={14} /></a>
        </div>
      </div>
    </div>
  );
}
