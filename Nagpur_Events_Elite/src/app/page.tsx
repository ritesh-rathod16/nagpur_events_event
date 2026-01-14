"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ValueProposition } from "@/components/home/ValueProposition";
import { InteractiveTimeline } from "@/components/home/InteractiveTimeline";
import { SocialProof } from "@/components/home/SocialProof";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-sapphire selection:bg-gold selection:text-sapphire">
      <Header />
      
      <Hero />
      
      <TrustSection />
      
      <FeaturedEvents />

      <ServicesSection />
      
      <ValueProposition />

      <InteractiveTimeline />

      {/* Final CTA */}
      <section className="py-24 bg-gold relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="text-sapphire font-poppins font-bold text-4xl md:text-5xl mb-4 leading-tight">Ready to create something extraordinary in Nagpur?</h2>
              <p className="text-sapphire/70 font-poppins text-sm tracking-widest uppercase font-semibold">Our Nagpur team is standing by to assist you.</p>
            </div>
              <Button asChild className="bg-sapphire hover:bg-sapphire/80 text-gold px-12 py-8 rounded-md font-poppins font-bold tracking-widest uppercase text-sm group h-auto">
                <Link href="/contact" className="flex items-center">
                  Get Started <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
