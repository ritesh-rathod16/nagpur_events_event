"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, MessageSquare, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      {/* Header */}
      <section className="pt-40 pb-20 border-b border-gold/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold font-poppins font-semibold text-lg mb-4 block tracking-widest uppercase italic">Get In Touch</span>
            <h1 className="text-pearl font-poppins font-bold text-5xl md:text-7xl mb-8 italic">Contact <span className="text-gold">Our Team</span></h1>
            <p className="text-pearl/50 font-inter text-lg max-w-2xl mx-auto italic">
              Ready to start planning your next extraordinary Nagpur experience? Our concierge team is here to assist you 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-gold/10 p-10 rounded-3xl"
            >
              <h2 className="text-pearl font-poppins font-bold text-3xl mb-8 italic">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Full Name</Label>
                    <Input name="name" required placeholder="Ex: Rahul Deshpande" className="bg-white/5 border-gold/10 text-pearl focus:border-gold py-6 rounded-md" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Email Address</Label>
                    <Input name="email" type="email" required placeholder="rahul@example.com" className="bg-white/5 border-gold/10 text-pearl focus:border-gold py-6 rounded-md" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Phone Number</Label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pearl/30 text-sm font-inter">+91</span>
                       <Input name="phone" required pattern="[0-9]{10}" placeholder="9876543210" className="bg-white/5 border-gold/10 text-pearl focus:border-gold py-6 pl-14 rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Event Type</Label>
                    <Select name="event_type">
                      <SelectTrigger className="bg-white/5 border-gold/10 text-pearl py-6 rounded-md">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-sapphire border-gold/20 text-pearl">
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="wedding">Royal Wedding</SelectItem>
                        <SelectItem value="cultural">Cultural Festival</SelectItem>
                        <SelectItem value="social">Social Gathering</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Expected Date</Label>
                    <Input name="date" type="date" className="bg-white/5 border-gold/10 text-pearl focus:border-gold py-6 rounded-md" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Budget Range (₹)</Label>
                    <div className="relative">
                       <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-pearl/30" size={16} />
                       <Input name="budget" placeholder="Ex: 5,00,000" className="bg-white/5 border-gold/10 text-pearl focus:border-gold py-6 pl-12 rounded-md" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-pearl/60 text-[10px] tracking-widest uppercase font-bold">Your Message</Label>
                  <Textarea name="message" required placeholder="Tell us about your event vision..." className="bg-white/5 border-gold/10 text-pearl focus:border-gold min-h-[150px] rounded-md" />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase py-8 rounded-md group h-auto"
                >
                  {isSubmitting ? "Sending..." : (
                    <>
                      Send Message <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                    </>
                  )}
                </Button>

                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-forest/20 border border-forest/30 text-forest rounded-lg flex items-center gap-3"
                    >
                      <CheckCircle2 size={20} />
                      <p className="text-sm font-inter font-medium">Message sent successfully! Our Nagpur team will contact you soon.</p>
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-maroon/20 border border-maroon/30 text-maroon rounded-lg flex items-center gap-3"
                    >
                      <AlertCircle size={20} />
                      <p className="text-sm font-inter font-medium">Something went wrong. Please try again or call us directly.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-pearl font-poppins font-bold text-3xl italic">Reach Us Directly</h2>
                <div className="space-y-8">
                  <div className="flex gap-6 items-start group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-sapphire transition-all shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-gold font-poppins text-xs tracking-widest uppercase mb-2 font-bold italic">Nagpur Office</h4>
                      <p className="text-pearl font-inter text-lg">101, Elite Plaza, Civil Lines, Nagpur, Maharashtra 440001</p>
                    </div>
                  </div>
                    <div className="flex gap-6 items-start group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-sapphire transition-all shrink-0">
                        <Phone size={24} />
                      </div>
                      <div>
                        <h4 className="text-gold font-poppins text-xs tracking-widest uppercase mb-2 font-bold italic">Call Us</h4>
                        <p className="text-pearl font-inter text-lg">+91 77218 74530</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-start group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-sapphire transition-all shrink-0">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h4 className="text-gold font-poppins text-xs tracking-widest uppercase mb-2 font-bold italic">Email Us</h4>
                        <p className="text-pearl font-inter text-lg">info@nagpureventselite.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-gold rounded-3xl text-sapphire">
                  <h3 className="text-2xl font-poppins font-bold mb-4 italic flex items-center gap-2">
                    <MessageSquare size={24} /> WhatsApp Support
                  </h3>
                  <p className="font-inter mb-8 opacity-80 leading-relaxed">
                    Need an immediate response? Chat with our Nagpur event experts on WhatsApp for quick consultations and booking inquiries.
                  </p>
                  <Button asChild className="w-full bg-sapphire hover:bg-sapphire/90 text-gold font-poppins font-bold tracking-widest uppercase py-7 rounded-xl h-auto">
                    <a href="https://wa.me/917721874530" target="_blank" rel="noopener noreferrer">Chat Now</a>
                  </Button>
                </div>

              <div className="h-[300px] bg-white/5 rounded-3xl border border-gold/20 overflow-hidden relative">
                 <div className="absolute inset-0 bg-sapphire/60 z-10 flex items-center justify-center">
                    <div className="text-center">
                       <MapPin className="text-gold mx-auto mb-4 animate-bounce" size={32} />
                       <p className="text-pearl font-poppins font-bold tracking-widest uppercase text-xs italic">Nagpur City Center</p>
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
