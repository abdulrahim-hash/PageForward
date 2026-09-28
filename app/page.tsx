import Link from "next/link";
import { programOfferings } from "@/lib/catalog";

const popularIds = ["computer-science--seecs-islamabad", "economics--s3h-islamabad", "mechanical-engineering--smme-islamabad", "architecture--sada-islamabad", "psychology--s3h-islamabad", "medicine-mbbs--nshs-islamabad"];
const popular = popularIds.map((id) => programOfferings.find((item) => item.id === id)!).filter(Boolean);

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Peer guidance for future NUST students</p>
          <h1>Talk to someone already where you want to go.</h1>
          <p className="lede">Considering NUST? Connect with a current student studying the program you’re interested in and get honest, firsthand insight before making your decision.</p>
          <div className="hero-actions"><Link className="button" href="/programs">Find a Mentor <span>→</span></Link><Link className="button button-quiet" href="/become-a-mentor">Become a Mentor</Link></div>
          <p className="trust-note"><span>✓</span> Independent, student-led and focused on honest guidance</p>
        </div>
        <div className="hero-visual" aria-label="A path connecting you to a student in your chosen NUST program">
          <span className="chapter">CHAPTER 01 · FIND YOUR PERSON</span>
          <div className="path-card you-card"><div className="avatar avatar-you">YOU</div><div><small>START HERE</small><b>Your questions</b></div></div>
          <div className="path-line line-one"><span>1</span></div>
          <div className="path-card program-card"><div className="program-mark">CS</div><div><small>YOUR PROGRAM</small><b>BS Computer Science</b><em>SEECS · Islamabad</em></div></div>
          <div className="path-line line-two"><span>2</span></div>
          <div className="path-card mentor-card"><div className="avatar avatar-mentor">PF</div><div><small>SOMEONE ALREADY THERE</small><b>A verified student</b><em><span className="online-dot" /> Ready to share honestly</em></div><i>↗</i></div>
        </div>
      </section>

      <section className="search-strip" aria-label="Search programs">
        <form action="/programs" className="shell search-inner"><div><span className="search-icon" aria-hidden="true">⌕</span><input name="q" aria-label="Search a NUST degree" placeholder="Search a NUST degree..." /></div><span className="search-hint">Try “Economics”, “CS” or “Architecture”</span><button type="submit">Search programs →</button></form>
      </section>

      <section className="problem-section shell section-space">
        <p className="chapter-label">THE DECISION</p>
        <div><h2>Choosing a degree shouldn’t feel like guessing.</h2><p>University websites tell you what you’ll study. Rankings tell you how universities compare. But sometimes the questions that matter most can only be answered by someone actually living the experience.</p></div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="shell section-space"><div className="section-heading"><p className="eyebrow">HOW IT WORKS</p><h2>One good conversation can change how you see the road ahead.</h2></div><div className="steps-grid">
          {[ ["01", "Find your program", "Choose the exact NUST degree and campus you’re considering."], ["02", "Meet someone studying it", "Connect with a verified student already living that experience."], ["03", "Ask the real questions", "Academics, workload, campus life, careers, societies — ask what matters to you."] ].map(([number,title,copy]) => <article key={number}><span>{number}</span><div className="step-mark" aria-hidden="true">{number === "01" ? "⌕" : number === "02" ? "↔" : "✦"}</div><h3>{title}</h3><p>{copy}</p></article>)}
        </div></div>
      </section>

      <section className="shell section-space explore-home">
        <div className="section-heading heading-row"><div><p className="eyebrow">EXPLORE NUST</p><h2>Find the program you’re considering.</h2></div><Link href="/programs">Explore all NUST programs →</Link></div>
        <div className="popular-grid">{popular.map((offering, index) => <Link href={`/programs/${offering.degreeSlug}/${offering.offeringSlug}`} className="program-tile" key={offering.id}><span>0{index + 1}</span><small>{offering.category}</small><h3>{offering.degreeShortName}</h3><p>{offering.institutionCode} · {offering.city}</p><i>→</i></Link>)}</div>
        <p className="catalog-note">Every current NUST undergraduate program is listed — including programs where we’re still recruiting mentors.</p>
      </section>

      <section className="why-section"><div className="shell section-space"><div className="section-heading"><p className="eyebrow">WHY PAGEFORWARD</p><h2>Advice that feels human, because it is.</h2></div><div className="why-grid">{[["Firsthand","Hear from someone actually studying the program."],["Specific","Get perspective relevant to the exact degree and campus."],["Honest","Mentors share experience — they are not selling a university."],["Human","Some decisions become clearer after one good conversation."]].map(([title,copy],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

      <section className="mission-section shell section-space"><div className="mission-mark" aria-hidden="true"><span>←</span><b>YOU</b><i /><b>THEM</b><span>→</span></div><div><p className="eyebrow">OUR MISSION</p><h2>Guidance shouldn’t depend on who you happen to know.</h2><p>PageForward is a student-led nonprofit initiative helping prospective students make better-informed university decisions through conversations with people who have already walked the path.</p><Link className="underlined-link" href="/about">Why we built PageForward →</Link></div></section>

      <section className="mentor-callout"><div className="shell"><div><p className="eyebrow">FOR CURRENT NUST STUDENTS</p><h2>You were once figuring this out too.</h2><p>Someone else is making that decision now. Give them the perspective you wish you had.</p><Link className="button button-lime" href="/become-a-mentor">Become a Mentor <span>→</span></Link></div><div className="chapter-stack" aria-hidden="true"><span>YOUR EXPERIENCE</span><span>THEIR CLARITY</span><span>THE NEXT CHAPTER</span></div></div></section>

      <section className="final-cta shell section-space"><p className="chapter-label">CHAPTER ONE STARTS HERE</p><h2>Your next chapter starts with a conversation.</h2><Link className="button" href="/programs">Find Someone to Talk To <span>→</span></Link></section>
    </main>
  );
}
