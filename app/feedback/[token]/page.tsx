import type { Metadata } from "next";
import { FeedbackForm } from "@/components/forms/feedback-form";

export const metadata: Metadata = { title: "Session Feedback", robots: { index: false, follow: false } };

export default async function FeedbackPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ for?: string }> }) {
  const [{ token }, query] = await Promise.all([params, searchParams]); const respondentType = query.for === "mentor" ? "mentor" : "student";
  return <main id="main-content" className="form-page"><section className="page-hero form-hero"><div className="shell"><p className="eyebrow"><span /> AFTER THE CONVERSATION</p><h1>{respondentType === "mentor" ? "A quick mentor check-in." : "Did the conversation help?"}</h1><p>{respondentType === "mentor" ? "Tell us how the session went and flag anything the PageForward team should follow up on." : "Your feedback helps us make future peer-guidance conversations more useful, safe and human."}</p></div></section><section className="shell single-form-section"><FeedbackForm token={token} respondentType={respondentType} /></section></main>;
}
