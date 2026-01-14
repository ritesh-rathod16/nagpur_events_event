import { Logo } from "../Logo";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export function FooterBrand() {
  const socialLinks = [
    { Icon: Facebook, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Linkedin, href: "#" },
  ];

  return (
    <div className="space-y-6">
      <Logo />
      <p className="text-pearl/60 font-inter text-sm leading-relaxed max-w-xs">
        Nagpur's premier event management partner. Elevating the standards of celebrations across Central India since 2008.
      </p>
      <div className="flex gap-4">
        {socialLinks.map(({ Icon, href }, i) => (
          <a
            key={i}
            href={href}
            className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-sapphire transition-all duration-300"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  );
}
