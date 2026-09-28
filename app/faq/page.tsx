import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers about PageForward mentors, conversations, privacy, availability and independence from NUST." };
const faqs = [
  ["Is PageForward part of NUST?", "No. PageForward is an independent student-led nonprofit initiative. It is not affiliated with, sponsored by or endorsed by NUST."],
  ["Who are PageForward mentors?", "Current NUST students whose student status PageForward has manually verified before approving their public profile."],
  ["Are mentors official university counsellors?", "No. Mentors share personal experience and opinion. They do not represent NUST or provide official admissions advice."],
  ["What can I ask?", "Academics, workload, student life, societies, internships, university transitions, career thinking and similar questions about lived experience."],
  ["Can mentors guarantee admission?", "No. Mentors cannot predict, influence or guarantee admission, scholarships, grades or employment outcomes."],
  ["How long is a conversation?", "Usually approximately 20–30 minutes."],
  ["Where does the conversation happen?", "On Google Meet. PageForward coordinates the match and meeting details."],
  ["Are sessions recorded?", "Not by PageForward by default. Participants must not record a conversation without clear consent from everyone involved."],
  ["What if my program does not have a mentor?", "Submit a mentor request. It enters the same matching system and helps us see where recruiting a mentor is most urgent."],
  ["Is PageForward free?", "Yes, for the initial nonprofit service."],
];
export default function FaqPage() { return <main id="main-content"><section className="page-hero"><div className="shell"><p className="eyebrow"><span /> FAQ</p><h1>Questions are the whole point.</h1><p>Here are the practical answers about mentors, meetings, privacy and what PageForward can — and cannot — do.</p></div></section><section className="shell faq-list section-space">{faqs.map(([question,answer],index) => <details key={question} open={index===0}><summary><span>{String(index+1).padStart(2,"0")}</span><h2>{question}</h2><i>+</i></summary><p>{answer}</p></details>)}</section><section className="faq-contact"><div className="shell"><div><h2>Still wondering about something?</h2><p>Send a question to the PageForward team. For safety concerns, use the dedicated report address.</p></div><div><a className="button" href="mailto:hello@pageforward.org">Email PageForward</a><a className="underlined-link" href="mailto:safety@pageforward.org">Report a concern →</a></div></div></section><section className="final-cta shell section-space"><h2>Ready to find someone in your program?</h2><Link className="button" href="/programs">Explore Programs <span>→</span></Link></section></main>; }
