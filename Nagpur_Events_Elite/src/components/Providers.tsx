"use client";

import { AuthProvider } from "@/lib/hooks/useAuth";
import { Toaster } from "react-hot-toast";
import UnhandledRejectionNormalizer from "@/components/UnhandledRejectionNormalizer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <UnhandledRejectionNormalizer />
      {children}
    </AuthProvider>
  );
}
