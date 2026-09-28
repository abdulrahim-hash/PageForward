import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "How It Works", description: "From finding an exact NUST program offering to a scheduled Google Meet with a verified current student." };

const steps = [
  ["01", "Find your program", "Choose the exact NUST degree, institution and campus you’re considering. Every undergraduate offering stays discoverable, even when a mentor is not available yet."],
  ["02", "Find someone living it", "View verified current students from that specific program, or ask PageForward to find someone if there is no mentor yet."],
  ["03", "Tell us what matters", "Share the questions you want to discuss and the times that work for you. No account is required."],
  ["04", "Have a real conversation", "The PageForward team confirms a 20–30 minute Google Meet after the student and mentor agree on a time."],
  ["05", "Move forward with more clarity", "Use the conversation as one useful input — alongside official information, family, teachers and your own priorities."],
];

export default function HowItWorksPage() { return <main id="main-content"><section className="page-hero"><div className="shell"><p className="eyebrow"><span /> A SIMPLE HUMAN PROCESS</p><h1>From “I’m considering it” to a real conversation.</h1><p>PageForward handles discovery, matching and scheduling so you can focus on asking better questions.</p></div></section><section className="shell process-list section-space">{steps.map(([number,title,copy]) => <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</section><section className="safe-process"><div className="shell"><div><p className="eyebrow">DESIGNED WITH BOUNDARIES</p><h2>Helpful, without becoming private or informal.</h2></div><div className="safety-grid"><p><b>Verified mentors</b>Student status is checked before a profile is published.</p><p><b>Mediated scheduling</b>Private contact information is not displayed or shared publicly.</p><p><b>Google Meet</b>No custom video system and no recording by PageForward by default.</p><p><b>Clear expectations</b>Mentors share personal experience, not guarantees or official advice.</p></div></div></section><section className="final-cta shell section-space"><p className="chapter-label">READY WHEN YOU ARE</p><h2>Find the exact program you’re thinking about.</h2><Link className="button" href="/programs">Explore NUST Programs <span>→</span></Link></section></main>; }
