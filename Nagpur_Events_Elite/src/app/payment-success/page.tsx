'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/hooks/useAuth';
import { toast } from 'react-hot-toast';

// Force dynamic rendering since this page uses search params
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  // Wrap the search params usage in a Suspense boundary as required by Next.js
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-sapphire">
          <Header />
          <section className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
            <Loader2 className="animate-spin text-gold" size={48} />
          </section>
          <Footer />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { user, loading } = useAuth();
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.error('Please login to view booking');
      router.push('/login');
      return;
    }

    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        setLoadingBooking(true);
        const res = await fetch(`/api/booking/${bookingId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch booking');
        setBooking(data.booking);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoadingBooking(false);
      }
    };

    fetchBooking();
  }, [bookingId, user, loading, router]);

  if (loading || loadingBooking) {
    return (
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
          <Loader2 className="animate-spin text-gold" size={48} />
        </section>
        <Footer />
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-sapphire">
        <Header />
        <section className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-pearl text-2xl font-bold">Booking not found</h2>
            <Button onClick={() => router.push('/events')} className="mt-6">
              Browse Events
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
          <div className="max-w-2xl mx-auto text-center bg-white/5 p-12 rounded-3xl border border-gold/10">
            <div className="mb-6">
              <Check className="text-gold mx-auto" size={56} />
            </div>
            <h1 className="text-pearl font-poppins text-3xl mb-4">Booking Confirmed!</h1>
            <p className="text-pearl/60 mb-6">
              Booking ID:{' '}
              <strong className="text-gold">{booking.bookingId}</strong>
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.open(`/api/download/ticket/${booking.bookingId}`)}>
                <Download className="mr-2" /> Download Ticket
              </Button>
              <Button onClick={() => window.open(`/api/download/invoice/${booking.bookingId}`)}>
                <Download className="mr-2" /> Download Invoice
              </Button>
            </div>

            <div className="mt-8 text-left">
              <h3 className="text-gold font-bold">Event</h3>
              <p className="text-pearl/80">{booking.event.title}</p>
              <p className="text-pearl/60">
                {new Date(booking.event.date).toLocaleString()}
              </p>
            </div>

            <div className="mt-8">
              <Button onClick={() => router.push('/events')} variant="outline">
                Back to events
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
