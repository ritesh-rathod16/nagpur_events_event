"use client";

import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 group cursor-pointer"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-gold/30 rounded-xl group-hover:border-gold transition-colors"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1.5 border-2 border-orange-nagpur/50 rounded-lg group-hover:border-orange-nagpur transition-colors"
        />
        <span className="text-gold font-poppins text-2xl font-bold relative z-10">N</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gold font-poppins text-xl font-bold leading-none tracking-tight">NagpurEvents</span>
        <span className="text-pearl/60 font-poppins text-[10px] tracking-[0.4em] uppercase leading-none mt-1">Elite</span>
      </div>
    </motion.div>
  );
}
