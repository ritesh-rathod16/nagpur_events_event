import Link from "next/link";

export function FooterBottom() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="pt-12 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-pearl/40 text-[10px] font-poppins tracking-widest uppercase">
        © {currentYear} NAGPUREVENTS ELITE. ALL RIGHTS RESERVED.
      </p>
      <div className="flex gap-8">
        <Link href="/privacy" className="text-pearl/40 hover:text-gold text-[10px] font-poppins tracking-widest uppercase transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="text-pearl/40 hover:text-gold text-[10px] font-poppins tracking-widest uppercase transition-colors">Terms of Service</Link>
        <span className="text-pearl/40 text-[10px] font-poppins tracking-widest uppercase">Central India's Premier Event Partner</span>
      </div>
    </div>
  );
}
