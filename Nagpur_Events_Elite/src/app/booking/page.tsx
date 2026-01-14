"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, IndianRupee, Calendar, MapPin, Loader2, 
  ShieldCheck, AlertCircle, Ticket, PartyPopper, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
    const eventId = searchParams.get("eventId");
    const ticketIndex = searchParams.get("ticketIndex");
    const quantity = parseInt(searchParams.get("quantity") || "1");
    
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [event, setEvent] = useState<any>(null);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [orderData, setOrderData] = useState<any>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }, []);

    useEffect(() => {
      if (authLoading) return;
      
      if (!user) {
        toast.error("Please login to book events");
        router.push("/login");
        return;
      }

      if (!eventId) {
        setLoading(false);
        return;
      }

      const createOrder = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const res = await fetch("/api/razorpay/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              eventId, 
              ticketIndex: ticketIndex !== null ? parseInt(ticketIndex) : undefined,
              quantity 
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Failed to create order");
          }

          setOrderData(data);
          setEvent(data.event);
          
          if (ticketIndex !== null && data.event.ticketTypes) {
            setSelectedTicket(data.event.ticketTypes[parseInt(ticketIndex)]);
          }
        } catch (err: any) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };

      createOrder();
    }, [user, authLoading, eventId, ticketIndex, quantity]);


  const handlePayLater = async () => {
    try {
      setProcessing(true);
      const res = await fetch("/api/booking/pay-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId || null,
          customBooking: !eventId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book");

      setBookingDetails(data.booking);
      setBookingSuccess(true);
      toast.success("Booking request received!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!orderData || !window.Razorpay) {
      toast.error("Payment system not ready. Please refresh.");
      return;
    }

    setProcessing(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "NagpurEvents Elite",
      description: `Booking for ${event.title}`,
      order_id: orderData.orderId,
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId,
                amount: orderData.amount / 100,
              }),
            });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            throw new Error(verifyData.error || "Payment verification failed");
          }

          setBookingDetails(verifyData.booking);
          toast.success("Booking confirmed!");
          // Redirect to payment success page with bookingId
          if (verifyData.booking && verifyData.booking.bookingId) {
            router.push(`/payment-success?bookingId=${verifyData.booking.bookingId}`);
          } else {
            setBookingSuccess(true);
          }
        } catch (err: any) {
          toast.error(err.message);
          setError(err.message);
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#FF9933",
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      toast.error(response.error.description || "Payment failed");
      setProcessing(false);
    });
    rzp.open();
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="animate-spin text-gold mx-auto mb-6" size={64} />
            <p className="text-pearl/60 font-poppins text-sm tracking-widest uppercase">
              Preparing your booking...
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (bookingSuccess && bookingDetails) {
    return (
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-white/5 border border-gold/20 rounded-3xl p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <PartyPopper className="text-sapphire" size={48} />
                </motion.div>

                <h1 className="text-pearl font-poppins font-bold text-4xl mb-4 italic">
                  Booking <span className="text-gold">Confirmed!</span>
                </h1>
                <p className="text-pearl/60 font-inter mb-8">
                  {bookingDetails.paymentStatus === 'pay_later' 
                    ? "Your request has been received. Our team will contact you shortly for payment." 
                    : "Your spot has been reserved. Get ready for an amazing experience!"}
                </p>

                <div className="bg-sapphire/50 border border-gold/10 rounded-2xl p-6 mb-8 text-left">
                  <div className="flex items-center gap-3 mb-6">
                    <Ticket className="text-gold" size={24} />
                    <span className="text-gold font-poppins font-bold text-xs tracking-widest uppercase">
                      Booking Details
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gold/10">
                      <span className="text-pearl/60 text-sm">Type</span>
                      <span className="text-pearl font-poppins font-bold">
                        {bookingDetails.event ? bookingDetails.event.title : "Custom Booking"}
                      </span>
                    </div>
                    {bookingDetails.event && (
                      <div className="flex justify-between items-center py-3 border-b border-gold/10">
                        <span className="text-pearl/60 text-sm">Date</span>
                        <span className="text-pearl font-poppins">
                          {new Date(bookingDetails.event.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-gold/10">
                      <span className="text-pearl/60 text-sm">Amount</span>
                      <span className="text-gold font-poppins font-bold flex items-center">
                        <IndianRupee size={16} />
                        {bookingDetails.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gold/10">
                      <span className="text-pearl/60 text-sm">Payment Method</span>
                      <span className="text-pearl/80 font-poppins text-xs uppercase">
                        {bookingDetails.paymentMethod === 'cod' ? 'Cash on Delivery / Pay Later' : 'Online Payment'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-pearl/60 text-sm">Status</span>
                      <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-poppins font-bold uppercase">
                        {bookingDetails.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => router.push("/events")}
                    variant="outline"
                    className="flex-1 border-gold/30 text-pearl hover:bg-white/5 rounded-md py-6 h-auto font-poppins font-bold tracking-widest uppercase text-xs"
                  >
                    Browse More Events
                  </Button>
                  <Button
                    onClick={() => router.push("/")}
                    className="flex-1 bg-gold hover:bg-gold/90 text-sapphire rounded-md py-6 h-auto font-poppins font-bold tracking-widest uppercase text-xs"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Handle No Event Selected (Custom Booking)
  if (!eventId) {
    return (
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-gold font-poppins font-semibold text-sm mb-4 block tracking-widest uppercase italic">
                Custom Booking
              </span>
              <h1 className="text-pearl font-poppins font-bold text-4xl md:text-5xl mb-8">
                Plan Your <span className="text-gold">Own Event</span>
              </h1>
              <div className="bg-white/5 border border-gold/10 p-12 rounded-3xl">
                <p className="text-pearl/60 font-inter mb-12">
                  Looking for a custom event setup in Nagpur? Book a consultation or request a callback. 
                  You can pay later once the details are finalized.
                </p>
                <Button 
                  onClick={handlePayLater}
                  disabled={processing}
                  className="w-full bg-gold hover:bg-gold/90 text-sapphire py-8 text-lg font-poppins font-bold tracking-widest uppercase rounded-xl h-auto"
                >
                  {processing ? "Processing..." : "Book Now, Pay Later"}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <AlertCircle className="text-red-400 mx-auto mb-6" size={64} />
            <h2 className="text-pearl font-poppins font-bold text-2xl mb-4">
              Something went wrong
            </h2>
            <p className="text-pearl/60 font-inter mb-8">
              {error || "Unable to load event details"}
            </p>
            <Button
              onClick={() => router.push("/events")}
              className="bg-gold hover:bg-gold/90 text-sapphire rounded-md py-6 px-8 h-auto font-poppins font-bold tracking-widest uppercase text-xs"
            >
              Back to Events
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      <section className="pt-40 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="text-gold font-poppins font-semibold text-sm mb-4 block tracking-widest uppercase italic">
                Complete Your Booking
              </span>
              <h1 className="text-pearl font-poppins font-bold text-4xl md:text-5xl">
                Secure <span className="text-gold">Booking</span>
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3"
              >
                <div className="bg-white/5 border border-gold/10 rounded-3xl overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sapphire to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-pearl font-poppins font-bold text-2xl md:text-3xl italic">
                        {event.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start gap-3">
                        <Calendar className="text-gold shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-pearl/40 text-[10px] tracking-widest uppercase font-poppins mb-1">
                            Date
                          </p>
                          <p className="text-pearl font-poppins font-bold">
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gold shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-pearl/40 text-[10px] tracking-widest uppercase font-poppins mb-1">
                            Venue
                          </p>
                          <p className="text-pearl font-poppins font-bold">{event.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gold/10 border border-gold/20 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-gold" size={20} />
                        <span className="text-gold font-poppins font-bold text-[10px] tracking-widest uppercase">
                          Booking Policy
                        </span>
                      </div>
                      <p className="text-pearl/60 text-sm font-inter">
                        For specific events, online payment is required to confirm your spot. 
                        Custom services and large corporate events may opt for Pay Later.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                  <div className="bg-white/5 border border-gold/10 p-8 rounded-3xl sticky top-40">
                    <h3 className="text-pearl font-poppins font-bold text-xl mb-8 italic pb-4 border-b border-gold/10">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-pearl/60 text-sm font-inter">
                        <span>
                          {selectedTicket ? selectedTicket.name : "Event Ticket"} (x{quantity})
                        </span>
                        <span className="flex items-center">
                          <IndianRupee size={14} />
                          {((selectedTicket?.price || event.price) * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-pearl/60 text-sm font-inter">
                        <span>Platform Fee</span>
                        <span className="text-green-400">FREE</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gold/10 mb-8">
                      <div className="flex justify-between text-gold font-poppins font-bold text-2xl">
                        <span>Total</span>
                        <span className="flex items-center">
                          <IndianRupee size={20} />
                          {((selectedTicket?.price || event.price) * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>


                  <div className="space-y-4">
                      <Button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-gold hover:bg-gold/90 text-sapphire rounded-xl py-6 h-auto font-poppins font-bold tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2" size={20} />
                            Pay Online
                          </>
                        )}
                      </Button>

                      {event.price === 0 ? (
                        <Button
                          onClick={handlePayLater}
                          disabled={processing}
                          variant="outline"
                          className="w-full border-gold/30 text-pearl hover:bg-white/5 rounded-xl py-6 h-auto font-poppins font-bold tracking-widest uppercase text-[10px]"
                        >
                          <Wallet className="mr-2" size={16} />
                          Confirm Free Booking
                        </Button>
                      ) : (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <p className="text-red-400 text-[10px] text-center font-poppins font-bold tracking-widest uppercase">
                            Online Payment Required for Ticketed Events
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-pearl/40 text-[10px] text-center mt-6 font-inter leading-relaxed">
                      * Secure payment processed via Razorpay.
                    </p>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="animate-spin text-gold mx-auto mb-6" size={64} />
            <p className="text-pearl/60 font-poppins text-sm tracking-widest uppercase">
              Loading...
            </p>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <BookingContent />
    </Suspense>
  );
}
