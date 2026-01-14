"use client";

import { motion } from "framer-motion";
import { Calendar, Layout, Play, Trophy } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "CONSULTATION",
    icon: Calendar,
    description: "Free in-person meeting at our Nagpur office to understand your vision and cultural requirements for your event."
  },
  {
    id: 2,
    title: "LOCAL PLANNING",
    icon: Layout,
    description: "Detailed planning using our extensive Nagpur network, from selecting venues like Radisson Blu to sourcing local Nagpur decorators."
  },
  {
    id: 3,
    title: "EXECUTION",
    icon: Play,
    description: "Our on-ground Nagpur team manages every detail with precision, ensuring a flawless flow across venues in the city."
  },
  {
    id: 4,
    title: "PERFECTION",
    icon: Trophy,
    description: "Post-event follow-up and feedback. We ensure every Nagpur celebration becomes a cherished memory for years to come."
  }
];

export function InteractiveTimeline() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-32 bg-sapphire border-y border-gold/10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Our Proven Process</span>
          <h2 className="text-pearl font-poppins font-bold text-5xl md:text-6xl mb-6">How We Make <span className="text-gold">Nagpur</span> Events Elite</h2>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gold/10 -translate-y-1/2 hidden md:block" />
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${(activeStep - 1) * 33.33}%` }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-0 h-px bg-gold -translate-y-1/2 z-10 hidden md:block"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-20">
            {steps.map((step, i) => (
              <div 
                key={step.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setActiveStep(step.id)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-500 mb-8 bg-sapphire ${
                    activeStep >= step.id ? "border-gold text-gold shadow-[0_0_20px_rgba(255,153,51,0.3)]" : "border-gold/20 text-gold/30"
                  }`}
                >
                  <step.icon size={28} />
                </motion.div>
                
                <h3 className={`font-poppins font-bold text-xs tracking-[0.3em] uppercase mb-4 transition-colors ${
                  activeStep === step.id ? "text-gold" : "text-pearl/40"
                }`}>
                  {step.title}
                </h3>
                
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: activeStep === step.id ? 1 : 0,
                    height: activeStep === step.id ? "auto" : 0
                  }}
                  className="text-center max-w-[250px]"
                >
                  <p className="text-pearl/60 text-sm font-inter leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
