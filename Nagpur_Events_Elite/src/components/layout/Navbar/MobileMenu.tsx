import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, User, LogOut } from "lucide-react";
import { Logo } from "../Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { navLinks } from "./NavLinks";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-sapphire flex flex-col p-8"
        >
          <div className="flex justify-between items-center mb-16">
            <Logo />
            <button onClick={onClose} className="text-gold p-2">
              <X size={32} />
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-4xl font-poppins font-bold text-pearl flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight className="text-gold" />
                </Link>
              </motion.div>
              ))}
            </div>

              <div className="mt-auto flex flex-col gap-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-white/5 p-6 rounded-xl border border-gold/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                        <User className="text-gold" />
                      </div>
                      <div>
                        <p className="text-pearl font-poppins font-bold">{user.name}</p>
                        <p className="text-pearl/40 text-xs font-inter">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                  <Button asChild className="w-full bg-gold text-sapphire py-8 text-lg font-poppins font-bold tracking-widest uppercase rounded-md">
                    <Link href="/profile" onClick={onClose}>View Profile</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Button asChild className="w-full bg-gold text-sapphire py-8 text-lg font-poppins font-bold tracking-widest uppercase rounded-md">
                    <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} onClick={onClose}>Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-gold text-sapphire py-8 text-lg font-poppins font-bold tracking-widest uppercase rounded-md">
                    <Link href="/register" onClick={onClose}>Register</Link>
                  </Button>
                </div>
              )}
              <p className="text-pearl/40 text-center font-poppins text-[10px] tracking-widest uppercase">
                Nagpur's Premier Event Partner
              </p>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
