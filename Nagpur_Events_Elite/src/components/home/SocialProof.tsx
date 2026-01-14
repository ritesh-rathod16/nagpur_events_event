"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Rajesh Kulkarni",
    company: "TCS Nagpur",
    text: "Managing a massive corporate launch at MIHAN was a breeze with NagpurEvents Elite. Their professionalism and local logistics knowledge are unmatched in Central India.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    name: "Sneha Deshpande",
    company: "Private Client",
    text: "Our wedding at Radisson Blu was magical. They understood every Marathi tradition perfectly and executed everything with such grace. Truly Nagpur's best.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    rating: 5
  },
  {
    name: "Dr. A. Verma",
    company: "VNIT Nagpur",
    text: "The most professional event team we've worked with. They handled our university convocation flawlessly, managing over 5,000 attendees with ease.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5
  }
];

const pressLogos = [
  "Nagpur Times", "Lokmat Times", "The Hitavada", "Maharashtra Times", "Nagpur Today", "Punya Nagari"
];

export function SocialProof() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 bg-sapphire overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Testimonial Carousel */}
          <div>
            <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Client Voices</span>
            <h2 className="text-pearl font-poppins font-bold text-5xl md:text-6xl mb-12">Voices of <span className="text-gold">Nagpur</span></h2>
            
            <div className="relative h-[400px]">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ 
                    opacity: activeTab === i ? 1 : 0,
                    x: activeTab === i ? 0 : -50,
                    pointerEvents: activeTab === i ? "auto" : "none"
                  }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="absolute inset-0"
                >
                  <Quote className="text-gold/20 w-24 h-24 absolute -top-10 -left-10" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-pearl/80 font-inter text-xl md:text-2xl leading-relaxed mb-12 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-gold/30 p-1"
                    />
                    <div>
                      <h4 className="text-pearl font-poppins font-bold text-sm tracking-widest uppercase">{testimonial.name}</h4>
                      <p className="text-gold font-poppins text-[10px] tracking-[0.2em] uppercase font-semibold">{testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    activeTab === i ? "w-12 bg-gold" : "w-4 bg-gold/20 hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Press Wall */}
          <div className="relative">
            <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
            <div className="relative grid grid-cols-2 gap-6">
              {pressLogos.map((press, i) => (
                <motion.div
                  key={press}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ rotateY: 15, rotateX: -5, scale: 1.05 }}
                  className="p-10 bg-white/5 border border-gold/10 flex items-center justify-center group cursor-default transition-all hover:border-gold/30 rounded-xl"
                >
                  <span className="text-pearl/40 text-lg font-poppins font-bold tracking-tight group-hover:text-gold transition-colors">
                    {press}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-pearl/30 font-poppins text-[10px] tracking-[0.4em] uppercase mb-6 italic">As Featured In Leading Publications</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
