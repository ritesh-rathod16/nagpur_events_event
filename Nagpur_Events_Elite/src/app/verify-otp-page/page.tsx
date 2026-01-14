"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { ShieldCheck, Loader2 } from "lucide-react";

import { useAuth } from "@/lib/hooks/useAuth";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { login } = useAuth();

  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setTimer(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

        if (res.ok) {
          toast.success(data.message);
            if (data.user) {
              login(data.user);
              
              // Redirect to home page immediately as requested
              router.push("/");
              router.refresh();
            } else {
            router.push("/login");
          }
        } else {

        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-sapphire flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -translate-y-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-gold/10 p-8 rounded-2xl relative z-10 backdrop-blur-sm"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-gold" size={40} />
          </div>
          <h1 className="text-pearl font-poppins font-bold text-4xl mb-2">Verify Email</h1>
          <p className="text-pearl/50 font-inter">We've sent a 6-digit code to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gold font-poppins text-xs tracking-widest uppercase font-semibold">Verification Code</label>
            <Input 
              type="text" 
              required 
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="bg-white/5 border-gold/20 focus:border-gold text-pearl text-center py-8 rounded-md font-poppins text-3xl tracking-[0.5em] font-bold"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-sapphire py-6 rounded-md font-poppins font-bold tracking-widest uppercase text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify & Activate"}
          </Button>
        </form>

          <p className="mt-8 text-center text-pearl/50 font-poppins text-xs tracking-widest uppercase">
            Didn't receive the code?{" "}
            <button 
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className={`text-gold font-bold hover:underline ${timer > 0 || resending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resending ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
          </p>

      </motion.div>
    </main>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sapphire flex items-center justify-center text-pearl">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
