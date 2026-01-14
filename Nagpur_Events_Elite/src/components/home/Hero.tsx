"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Play } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Hero() {
  const [text, setText] = useState("");
  const [particles, setParticles] = useState<any[]>([]);
  const fullText = "Nagpur's Premier Events";
  
  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    const p = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      targetX: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 20
    }));
    setParticles(p);

    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background with Ken Burns effect */}
      <motion.div 
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-sapphire/70 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-sapphire/80 via-transparent to-sapphire z-10" />
        <img 
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2000" 
          alt="Nagpur Event" 
          className="w-full h-full object-cover opacity-50"
        />
      </motion.div>

      {/* Floating Particles (Orange/Saffron) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ y: "110%", x: `${p.x}%`, opacity: 0 }}
            animate={{ 
              y: "-10%", 
              opacity: [0, 0.4, 0],
              x: [`${p.x}%`, `${p.targetX}%`]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: p.delay
            }}
            className="absolute w-1.5 h-1.5 bg-orange-nagpur rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-gold font-poppins font-semibold text-lg md:text-xl mb-4 block tracking-[0.3em] uppercase">
            NagpurEvents Elite
          </span>
          <h1 className="text-pearl font-poppins font-bold text-5xl md:text-8xl mb-8 leading-tight tracking-tight">
            <span className="text-gold">Transforming</span> <br />
            <span className="relative inline-block">
              {text}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -right-4 top-0 h-full w-[2px] bg-gold"
              />
            </span>
          </h1>
          <p className="text-pearl/80 font-inter text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Nagpur's premier event management partner. 
            Transforming visions into unforgettable experiences across Maharashtra.
          </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild className="bg-gold hover:bg-gold/90 text-sapphire px-10 py-8 text-sm font-poppins font-bold tracking-widest uppercase rounded-md transition-all hover:scale-105 group relative overflow-hidden h-auto">
                <Link href="/events">
                  <span className="relative z-10">Explore Our Events</span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  />
                </Link>
              </Button>
              <Button asChild className="bg-gold hover:bg-gold/90 text-sapphire px-10 py-8 text-sm font-poppins font-bold tracking-widest uppercase rounded-md transition-all hover:scale-105 group relative overflow-hidden h-auto">
                <Link href="/contact">
                  <Play size={16} className="mr-2 text-sapphire group-hover:fill-sapphire transition-all" />
                  Get Free Consultation
                </Link>
              </Button>
            </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 z-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-pearl/40 font-poppins text-[10px] tracking-[0.4em] uppercase">Trusted by 200+ Nagpur Businesses</p>
            <ChevronDown className="text-gold/50 animate-bounce mt-4" size={32} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
