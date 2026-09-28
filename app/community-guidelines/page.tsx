import type { Metadata } from "next";
export const metadata: Metadata = { title: "Community Guidelines", description: "The standards that keep PageForward peer guidance respectful, honest, neutral and safe." };
const rules = [
  ["Be respectful", "Listen without judgment. Harassment, discrimination, intimidation and sexualized conduct are not acceptable."],
  ["Be honest about what you know", "Distinguish personal experience and opinion from fact. Say when you are unsure and point to official sources when appropriate."],
  ["Never guarantee an outcome", "Do not promise admission, scholarships, grades, internships, jobs or a particular university experience."],
  ["Do not represent NUST", "Mentors may identify themselves as verified current students, but must not claim to be official counsellors or university representatives."],
  ["Keep guidance neutral", "Do not pressure someone toward NUST, a program or your personal path. A useful conversation can help someone decide a program is not right for them."],
  ["Protect privacy", "Do not ask for unnecessary sensitive information, share private details, publish meeting links or record without clear consent."],
  ["Keep communication appropriate", "Do not move students into inappropriate private channels, privately solicit money, sell services or use the session for recruitment."],
  ["Report concerns", "Tell PageForward if someone does not attend, behaves unsafely or needs follow-up beyond what a peer mentor should provide."],
];
export default function GuidelinesPage() { return <main id="main-content"><section className="page-hero"><div className="shell"><p className="eyebrow"><span /> COMMUNITY GUIDELINES</p><h1>Honest guidance needs clear boundaries.</h1><p>These standards apply to mentors, prospective students and everyone helping a PageForward conversation happen.</p></div></section><section className="shell guideline-grid section-space">{rules.map(([title,copy],index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="concern-band"><div className="shell"><div><p className="eyebrow">SOMETHING FELT WRONG?</p><h2>Report it. We will take it seriously.</h2><p>For an immediate danger, contact local emergency services or a trusted adult first. For a PageForward concern, email the safety team with the session date and what happened.</p></div><a className="button button-lime" href="mailto:safety@pageforward.org">Report a Concern <span>→</span></a></div></section></main>; }
