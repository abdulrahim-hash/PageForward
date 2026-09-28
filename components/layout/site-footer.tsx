"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><Link className="brand" href="/"><span>Page</span><strong>Forward</strong><i>↗</i></Link><p>Talk to someone already where you want to go.</p></div>
        <div><b>Explore</b><Link href="/programs">Programs</Link><Link href="/how-it-works">How it works</Link><Link href="/become-a-mentor">Become a mentor</Link></div>
        <div><b>PageForward</b><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/community-guidelines">Community guidelines</Link></div>
        <div><b>Legal</b><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:safety@pageforward.org">Report a concern</a></div>
      </div>
      <div className="shell footer-bottom">
        <p>PageForward is an independent student-led nonprofit initiative. It is not affiliated with, sponsored by, or endorsed by NUST. Mentors share their own experiences and do not represent the university.</p>
        <span>© {new Date().getFullYear()} PageForward</span>
      </div>
    </footer>
  );
}
