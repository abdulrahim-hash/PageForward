import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { env } from "@/lib/env";
import "./globals.css";
import "./extended.css";
import "./forms.css";
import "./admin.css";
import "./responsive.css";
import "./overrides.css";

const body = DM_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const display = Manrope({ variable: "--font-display", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: "PageForward | Talk to current NUST students", template: "%s | PageForward" },
  description: "Find verified current NUST students in the exact program and campus you’re considering.",
  alternates: { canonical: "/" },
  openGraph: { title: "Talk to someone already where you want to go.", description: "Peer guidance for future NUST students.", url: "/", siteName: "PageForward", type: "website", images: [{ url: "/og.png", width: 1714, height: 909, alt: "PageForward — peer guidance for future NUST students" }] },
  twitter: { card: "summary_large_image", title: "PageForward", description: "Talk to someone already where you want to go.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${body.variable} ${display.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader />{children}<SiteFooter /></body></html>;
}
