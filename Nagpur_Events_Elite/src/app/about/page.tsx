"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      {/* Hero */}
      <section className="pt-40 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Our Legacy</span>
            <h1 className="text-pearl font-poppins font-bold text-5xl md:text-8xl mb-8 leading-tight italic">
              Nagpur's <br />
              <span className="text-gold">Own Story</span>
            </h1>
            <p className="text-pearl/50 font-inter text-lg max-w-3xl mx-auto leading-relaxed">
              Founded in 2008, NagpurEvents Elite was born from a passion for the vibrant culture of Maharashtra and the growing aspirations of the Orange City. We don't just plan events; we craft legacies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-primary font-poppins font-bold text-4xl md:text-5xl mb-8 italic">Rooted in Nagpur, <br /><span className="text-gold">Global in Vision</span></h2>
              <div className="space-y-6 text-muted-foreground font-inter leading-relaxed">
                <p>
                  For over 15 years, we have been at the forefront of the event management industry in Central India. Our journey started in a small office in Sitabuldi and has grown into a premier agency serving the biggest names in the region.
                </p>
                <p>
                  We believe that every celebration in Nagpur—be it a grand wedding at Radisson Blu or a tech fest at VNIT—deserves a touch of excellence and cultural sensitivity.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2">
                    <h4 className="text-primary font-bold text-3xl">2008</h4>
                    <p className="text-xs uppercase tracking-widest">Year Founded</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-primary font-bold text-3xl">1.2K+</h4>
                    <p className="text-xs uppercase tracking-widest">Events Managed</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="relative">
              <div className="absolute -inset-4 border border-gold/20 rounded-2xl -rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
                alt="Nagpur Celebration" 
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

        {/* Our Team */}
        <section className="py-16 bg-sapphire relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-3"
              >
                <h2 className="text-pearl font-poppins font-bold text-3xl md:text-4xl italic tracking-tighter whitespace-nowrap">
                  Meet Our <span className="text-gold">Nagpur Team</span>
                </h2>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-pearl/50 font-inter text-sm italic whitespace-nowrap"
              >
                Our multi-disciplinary team combines global expertise with local Nagpur insight.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {[
                {
                  name: "Ritesh Rathod",
                  role: "Founder & Creative Director",
                  description: "A visionary leader with over 15 years of excellence in luxury event management.",
                  image: "https://instasize.com/p/1cd28cf1c825d70d9bcdb6e9302bc6e06dca7618def4c6fbb4eaf9cb5dfcd43d",
                  social: {
                    insta: "#",
                    phone: "tel:+917121234567",
                    whatsapp: "https://wa.me/917121234567"
                  }
                },
                {
                  name: "Ananya Deshpande",
                  role: "Head of Operations",
                  description: "The mastermind behind Nagpur's most complex logistics and grand celebrations.",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
                  social: {
                    insta: "#",
                    phone: "tel:+919876543210",
                    whatsapp: "https://wa.me/919876543210"
                  }
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative bg-white/5 border border-gold/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-500"
                >
                  {/* Distinct Floating Image Frame */}
                  <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden border-[6px] border-pearl/10 shadow-xl">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sapphire/80 via-transparent to-transparent opacity-40" />
                  </div>
                  
                  {/* Social Icons - Above Name */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    {[
                      { icon: <Instagram size={12} />, href: member.social.insta, color: "text-[#E4405F]", hoverBg: "hover:bg-[#E4405F]/10" },
                      { icon: <Phone size={12} />, href: member.social.phone, color: "text-[#34B7F1]", hoverBg: "hover:bg-[#34B7F1]/10" },
                      { icon: <MessageCircle size={12} />, href: member.social.whatsapp, color: "text-[#25D366]", hoverBg: "hover:bg-[#25D366]/10" }
                    ].map((s, i) => (
                      <a 
                        key={i}
                        href={s.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center ${s.color} ${s.hoverBg} transition-all duration-300 border border-white/10`}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-pearl font-poppins font-bold text-lg mb-1 italic tracking-tight">{member.name}</h3>
                    <p className="text-gold font-poppins text-[9px] uppercase tracking-[0.3em] mb-3 font-bold">{member.role}</p>
                    <p className="text-pearl/40 font-inter text-[11px] leading-relaxed max-w-[200px] mx-auto italic">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Office & Details */}
      <section className="py-32 bg-white/5 border-y border-gold/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <h2 className="text-pearl font-poppins font-bold text-4xl italic">Visit Our <span className="text-gold">Nagpur Office</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <MapPin className="text-gold shrink-0" size={24} />
                  <div>
                    <h4 className="text-pearl font-bold mb-2 uppercase text-xs tracking-widest">Address</h4>
                    <p className="text-pearl/50 text-sm font-inter">101, Elite Plaza, Civil Lines, Nagpur, Maharashtra 440001</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="text-gold shrink-0" size={24} />
                  <div>
                    <h4 className="text-pearl font-bold mb-2 uppercase text-xs tracking-widest">Hours</h4>
                    <p className="text-pearl/50 text-sm font-inter">Mon - Sat: 9 AM - 7 PM IST<br />Sun: By Appointment</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="text-gold shrink-0" size={24} />
                  <div>
                    <h4 className="text-pearl font-bold mb-2 uppercase text-xs tracking-widest">Phone</h4>
                    <p className="text-pearl/50 text-sm font-inter">+91 712-123-4567<br />+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="text-gold shrink-0" size={24} />
                  <div>
                    <h4 className="text-pearl font-bold mb-2 uppercase text-xs tracking-widest">Email</h4>
                    <p className="text-pearl/50 text-sm font-inter">info@nagpureventselite.com<br />vikram@nagpureventselite.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[400px] bg-white/5 rounded-2xl border border-gold/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-sapphire/60 z-10 flex items-center justify-center p-8 text-center">
                 <div>
                    <MapPin size={48} className="text-gold mb-6 mx-auto animate-bounce" />
                    <h3 className="text-pearl font-poppins font-bold text-xl mb-2 italic">Nagpur City Center</h3>
                    <p className="text-pearl/40 text-xs uppercase tracking-widest">Serving Nagpur & Nearby Districts</p>
                 </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Nagpur Map" 
                className="w-full h-full object-cover opacity-20"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
