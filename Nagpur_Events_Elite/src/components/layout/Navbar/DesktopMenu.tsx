import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { navLinks } from "./NavLinks";
import { useAuth } from "@/lib/hooks/useAuth";
import { User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function DesktopMenu() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <div className="hidden md:flex items-center gap-12">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-pearl/80 hover:text-gold font-poppins text-xs tracking-widest uppercase transition-colors relative group font-semibold"
          >
            {link.name}
            <motion.span 
              className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"
            />
          </Link>
          ))}
        </div>

          <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                href="/profile" 
                className="text-pearl/80 hover:text-gold transition-colors flex items-center gap-2"
              >
                <User size={18} className="text-gold" />
                <span className="font-poppins text-xs tracking-widest uppercase font-semibold">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button 
                onClick={logout}
                className="text-pearl/50 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="text-pearl/80 hover:text-gold font-poppins text-xs tracking-widest uppercase font-bold transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase text-[10px] px-8 rounded-md h-auto py-4"
              >
                Register
              </Link>
            </div>
          )}
        </div>
    </>
  );
}
