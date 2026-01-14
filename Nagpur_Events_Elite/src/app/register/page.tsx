"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

function RegisterContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

    useEffect(() => {
      if (!authLoading && user) {
        // Always redirect to home page after registration if user is already logged in
        router.push("/");
        router.refresh();
      }
    }, [user, authLoading, router]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    toast.loading("Redirecting to Google...");
    window.location.href = "/api/auth/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        router.push(`/verify-otp-page?email=${encodeURIComponent(email)}`);
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
          <h1 className="text-pearl font-poppins font-bold text-4xl mb-2">Create Account</h1>
          <p className="text-pearl/50 font-inter">Join NagpurEvents Elite today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gold font-poppins text-xs tracking-widest uppercase font-semibold">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
              <Input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-white/5 border-gold/20 focus:border-gold text-pearl pl-12 py-6 rounded-md font-poppins text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gold font-poppins text-xs tracking-widest uppercase font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
              <Input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/5 border-gold/20 focus:border-gold text-pearl pl-12 py-6 rounded-md font-poppins text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gold font-poppins text-xs tracking-widest uppercase font-semibold">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
              <Input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-gold/20 focus:border-gold text-pearl pl-12 py-6 rounded-md font-poppins text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gold font-poppins text-xs tracking-widest uppercase font-semibold">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
              <Input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-gold/20 focus:border-gold text-pearl pl-12 py-6 rounded-md font-poppins text-sm"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading || googleLoading}
            className="w-full bg-gold hover:bg-gold/90 text-sapphire py-6 rounded-md font-poppins font-bold tracking-widest uppercase text-xs"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register"}
          </Button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-gold/10" />
          <span className="text-pearl/30 text-[10px] font-poppins uppercase tracking-widest">Or continue with</span>
          <div className="h-[1px] flex-grow bg-gold/10" />
        </div>

        <Button 
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full mt-6 bg-gold hover:bg-gold/90 text-sapphire py-6 rounded-md font-poppins font-bold tracking-widest uppercase text-xs"
        >
          {googleLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {googleLoading ? "Connecting..." : "Register with Google"}
        </Button>

        <p className="mt-8 text-center text-pearl/50 font-poppins text-xs tracking-widest uppercase">
          Already have an account?{" "}
          <Link href="/login" className="text-gold font-bold hover:underline">Login</Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sapphire flex items-center justify-center text-pearl italic uppercase tracking-widest text-xs">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
