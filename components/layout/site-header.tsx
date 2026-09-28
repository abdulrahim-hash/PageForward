"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["Explore Programs", "/programs"], ["How It Works", "/how-it-works"],
  ["About", "/about"], ["FAQ", "/faq"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="PageForward home" onClick={() => setOpen(false)}>
        <span>Page</span><strong>Forward</strong><i aria-hidden="true">↗</i>
      </Link>
      <nav aria-label="Primary navigation" className={open ? "nav-open" : ""}>
        {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="mobile-mentor-link" href="/become-a-mentor" onClick={() => setOpen(false)}>Become a Mentor</Link>
      </nav>
      <div className="nav-actions">
        <Link className="text-link" href="/become-a-mentor">Become a Mentor</Link>
        <Link className="button button-small" href="/programs">Find a Mentor <span>→</span></Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}
