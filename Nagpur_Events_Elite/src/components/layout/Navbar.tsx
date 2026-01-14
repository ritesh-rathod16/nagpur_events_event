"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Menu } from "lucide-react";
import Link from "next/link";
import { DesktopMenu } from "./Navbar/DesktopMenu";
import { MobileMenu } from "./Navbar/MobileMenu";

interface NavbarProps {
  isScrolled?: boolean;
}

export function Navbar({ isScrolled = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={`transition-all duration-500 ${
          isScrolled ? "py-4 glass border-b border-gold/10 shadow-2xl" : "py-8 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <DesktopMenu />

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-gold p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}
