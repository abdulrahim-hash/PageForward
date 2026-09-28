import type { Metadata } from "next";
import { RequestForm } from "@/components/forms/request-form";
import { getPublicOfferings } from "@/lib/data/public";

export const metadata: Metadata = { title: "Request a Conversation", description: "Ask PageForward to connect you with a verified current NUST student for a 20–30 minute Google Meet conversation.", robots: { index: false, follow: false } };

export default async function RequestSessionPage({ searchParams }: { searchParams: Promise<{ offering?: string; mentor?: string }> }) {
  const [params, offerings] = await Promise.all([searchParams, getPublicOfferings()]);
  return <main id="main-content" className="form-page"><section className="page-hero form-hero"><div className="shell"><p className="eyebrow"><span /> REQUEST A CONVERSATION</p><h1>Bring the questions that matter to you.</h1><p>Tell us what you’re considering and when you’re free. We’ll review your request, find the right verified student, and arrange a 20–30 minute Google Meet.</p></div></section><section className="shell form-layout"><aside><p className="chapter-label">WHAT HAPPENS NEXT</p><ol><li><span>01</span><b>We review your request</b><p>A PageForward team member checks the exact program and your questions.</p></li><li><span>02</span><b>We find the right student</b><p>We match you with an available verified mentor from that offering.</p></li><li><span>03</span><b>We confirm a time</b><p>You’ll receive the Google Meet details after everyone agrees.</p></li></ol><div className="privacy-note"><b>Your privacy matters.</b><p>Your details are never public. Communication stays mediated by PageForward in Phase 1.</p></div></aside><RequestForm offerings={offerings} initialOffering={params.offering ?? ""} preferredMentorId={params.mentor ?? ""} /></section></main>;
}
