import Link from "next/link";

interface FooterSectionProps {
  title: string;
  links: { name: string; href: string }[];
}

export function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div>
      <h4 className="text-gold font-poppins text-xs tracking-[0.2em] uppercase mb-8">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              href={link.href} 
              className="text-pearl/60 hover:text-gold transition-colors text-sm font-inter"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
