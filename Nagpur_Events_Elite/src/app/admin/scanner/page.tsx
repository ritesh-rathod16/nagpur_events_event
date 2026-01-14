"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-hot-toast";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Camera, 
  User, 
  Ticket as TicketIcon, 
  Calendar, 
  ArrowLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AdminScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastScan, setLastScan] = useState<string>("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, []);

  async function onScanSuccess(decodedText: string) {
    if (decodedText === lastScan || isVerifying) return;
    
    setLastScan(decodedText);
    setIsVerifying(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/admin/verify-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: decodedText })
      });

      const data = await res.json();
      setScanResult(data);

      if (data.success) {
        toast.success("Entry Verified!");
      } else {
        toast.error(data.message || "Invalid Ticket");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setIsVerifying(false);
      // Reset after 5 seconds to allow next scan
      setTimeout(() => setLastScan(""), 5000);
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  return (
    <main className="min-h-screen bg-sapphire">
      <Header />
      
      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Button asChild variant="ghost" className="text-pearl hover:text-gold">
              <Link href="/admin/events"><ArrowLeft size={20} className="mr-2" /> Back</Link>
            </Button>
            <h1 className="text-4xl font-poppins font-bold text-pearl">Entry Verification</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Scanner Area */}
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-6">
                <div id="reader" className="w-full"></div>
                <div className="mt-6 flex items-center justify-center gap-3 text-pearl/40 uppercase tracking-widest text-[10px] font-bold">
                  <Camera size={14} /> Align QR code within the frame
                </div>
              </div>

              {isVerifying && (
                <div className="flex items-center justify-center gap-3 text-gold animate-pulse">
                  <Loader2 className="animate-spin" />
                  <span className="font-poppins font-bold uppercase tracking-widest text-sm">Verifying Ticket...</span>
                </div>
              )}
            </div>

            {/* Result Area */}
            <div className="space-y-6">
              {scanResult ? (
                <div className={`rounded-3xl border p-8 ${
                  scanResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <div className="flex items-center gap-4 mb-8">
                    {scanResult.success ? (
                      <CheckCircle2 size={48} className="text-green-500" />
                    ) : (
                      <XCircle size={48} className="text-red-500" />
                    )}
                    <div>
                      <h3 className={`text-2xl font-poppins font-bold ${
                        scanResult.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {scanResult.success ? "Access Granted" : "Access Denied"}
                      </h3>
                      <p className="text-pearl/60 text-sm">{scanResult.message}</p>
                    </div>
                  </div>

                  {scanResult.booking && (
                    <div className="space-y-6 border-t border-white/10 pt-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="text-pearl/40 text-[10px] uppercase font-bold tracking-widest">Attendee</p>
                          <p className="text-pearl font-bold">{scanResult.booking.user?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                          <TicketIcon size={24} />
                        </div>
                        <div>
                          <p className="text-pearl/40 text-[10px] uppercase font-bold tracking-widest">Event</p>
                          <p className="text-pearl font-bold">{scanResult.booking.event?.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <p className="text-pearl/40 text-[10px] uppercase font-bold tracking-widest">Event Date</p>
                          <p className="text-pearl font-bold">
                            {new Date(scanResult.booking.event?.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[400px] bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-pearl/20 mb-6">
                    <QrCode size={40} />
                  </div>
                  <h4 className="text-pearl/40 font-poppins font-bold text-xl uppercase tracking-widest">Ready to Scan</h4>
                  <p className="text-pearl/20 text-sm mt-2">Scan a ticket QR code to verify entry</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Add QrCode icon since it wasn't imported properly or is missing
function QrCode({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <line x1="7" y1="7" x2="7" y2="7.01" />
      <line x1="17" y1="7" x2="17" y2="7.01" />
      <line x1="7" y1="17" x2="7" y2="17.01" />
      <line x1="17" y1="17" x2="17" y2="17.01" />
    </svg>
  );
}
