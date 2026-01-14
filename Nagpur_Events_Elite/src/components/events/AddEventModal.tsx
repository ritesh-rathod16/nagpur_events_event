"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  fullAddress: z.string().optional(),
  googleMapUrl: z.string().optional(),
  price: z.string().transform((val) => Number(val)),
  image: z.string().url("Please enter a valid image URL"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  date: z.string().min(1, "Date is required"),
  capacity: z.string().optional().transform((val) => val ? Number(val) : undefined),
  highlights: z.string().optional().transform((val) => val ? val.split(',').map(s => s.trim()) : []),
  gallery: z.string().optional().transform((val) => val ? val.split(',').map(s => s.trim()) : []),
  refundPolicy: z.string().optional(),
  organizerName: z.string().optional(),
  organizerContact: z.string().optional(),
  organizerInstagram: z.string().optional(),
  organizerTwitter: z.string().optional(),
  organizerWebsite: z.string().optional(),
});

export function AddEventModal({ onEventAdded }: { onEventAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      location: "",
      fullAddress: "",
      googleMapUrl: "",
      price: "0" as any,
      image: "",
      category: "",
      date: "",
      capacity: "" as any,
      highlights: "" as any,
      gallery: "" as any,
      refundPolicy: "Refunds are available up to 24 hours before the event start time.",
      organizerName: "",
      organizerContact: "",
      organizerInstagram: "",
      organizerTwitter: "",
      organizerWebsite: "",
    },
  });

  async function onSubmit(values: any) {    try {
      setLoading(true);
      
      // Transform values to match schema
      const payload = {
        ...values,
        organizer: {
          name: values.organizerName,
          contact: values.organizerContact,
          social: {
            instagram: values.organizerInstagram,
            twitter: values.organizerTwitter,
            website: values.organizerWebsite,
          }
        },
        // For simplicity, we'll initialize ticketTypes with a default one if not provided
        ticketTypes: [{
          name: "General Admission",
          price: values.price,
          description: "Standard entry ticket",
          quantityAvailable: values.capacity || 100
        }]
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add event");
      }

      toast.success("Event added successfully!");
      setOpen(false);
      form.reset();
      onEventAdded();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase text-xs rounded-md px-6 py-6 h-auto flex items-center gap-2">
          <Plus size={18} /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-sapphire border-gold/20 text-pearl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins font-bold italic text-gold">Add New Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="space-y-4">
                <h4 className="text-gold font-poppins font-bold text-xs uppercase tracking-widest border-b border-gold/10 pb-2">Basic Information</h4>
                <FormField
                  control={form.control as any}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control as any}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter event description" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30 min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">City Area (e.g. Civil Lines)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nagpur location" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Wedding, Tech" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-gold font-poppins font-bold text-xs uppercase tracking-widest border-b border-gold/10 pb-2">Venue & Timing</h4>
                <FormField
                  control={form.control as any}
                  name="fullAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Full Venue Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Full address of the venue" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30 h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="googleMapUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Google Map Embed URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.google.com/maps/embed?..." className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Event Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-gold font-poppins font-bold text-xs uppercase tracking-widest border-b border-gold/10 pb-2">Tickets & Media</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Base Price (INR)</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control as any}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Banner Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="gallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Gallery URLs (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="URL1, URL2, URL3" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30 h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="highlights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Highlights (comma separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Highlight 1, Highlight 2" className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30 h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-gold font-poppins font-bold text-xs uppercase tracking-widest border-b border-gold/10 pb-2">Organizer & Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="organizerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Organizer Name</FormLabel>
                        <FormControl>
                          <Input className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="organizerContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Contact Info</FormLabel>
                        <FormControl>
                          <Input className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="refundPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gold/80 font-poppins uppercase tracking-widest text-[10px]">Refund Policy</FormLabel>
                      <FormControl>
                        <Textarea className="bg-white/5 border-gold/10 text-pearl focus:border-gold/30 h-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase py-6 h-auto"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create Detailed Event"}
              </Button>
            </form>

        </Form>
      </DialogContent>
    </Dialog>
  );
}
