"use client";

import { FooterBrand } from "./Footer/FooterBrand";
import { FooterSection } from "./Footer/FooterSection";
import { FooterContact } from "./Footer/FooterContact";
import { FooterBottom } from "./Footer/FooterBottom";

export function Footer() {
  const eventCategories = [
    { name: "Corporate Events", href: "/events" },
    { name: "Royal Weddings", href: "/events" },
    { name: "Cultural Festivals", href: "/events" },
    { name: "Educational Fests", href: "/events" },
  ];

  const quickLinks = [
    { name: "Our Services", href: "/services" },
    { name: "About Nagpur Story", href: "/about" },
    { name: "Latest Events", href: "/events" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-sapphire border-t border-gold/10 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <FooterBrand />
          <FooterSection title="Event Categories" links={eventCategories} />
          <FooterSection title="Quick Links" links={quickLinks} />
          <FooterContact />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
