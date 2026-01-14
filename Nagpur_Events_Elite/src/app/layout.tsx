import './globals.css';
import { ReactNode } from 'react';
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import VisualEditsMessenger from "@/visual-edits/VisualEditsMessenger";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="11e5d1f9-47e1-43d7-bff4-38739c0efa13"
        />
        <Providers>
          {children}
        </Providers>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
