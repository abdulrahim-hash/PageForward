import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MentorCard } from "@/components/mentors/mentor-card";
import { StatusPill } from "@/components/ui/status-pill";
import { programOfferings } from "@/lib/catalog";
import { getPublicMentorsForOffering, getPublicOfferings } from "@/lib/data/public";

export function generateStaticParams() { return programOfferings.map((offering) => ({ degree: offering.degreeSlug, offering: offering.offeringSlug })); }
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ degree: string; offering: string }> }): Promise<Metadata> {
  const { degree, offering: offeringSlug } = await params;
  const offering = (await getPublicOfferings()).find((item) => item.degreeSlug === degree && item.offeringSlug === offeringSlug);
  if (!offering) return {};
  const title = `${offering.degreeShortName} at NUST ${offering.institutionCode}`;
  const description = `Talk to current students and explore peer guidance for ${offering.degreeShortName} at ${offering.institutionCode}, ${offering.city}.`;
  return { title, description, alternates: { canonical: `/programs/${degree}/${offeringSlug}` }, openGraph: { title, description, images: [] }, twitter: { title, description, images: [] } };
}

export default async function ProgramOfferingPage({ params }: { params: Promise<{ degree: string; offering: string }> }) {
  const { degree, offering: offeringSlug } = await params;
  const offering = (await getPublicOfferings()).find((item) => item.degreeSlug === degree && item.offeringSlug === offeringSlug);
  if (!offering) notFound();
  const mentors = offering.status === "current" ? await getPublicMentorsForOffering(offering.id) : [];
  const availability = mentors.length > 1 ? "available" : mentors.length === 1 ? "limited" : "unavailable";
  return (
    <main id="main-content">
      <section className="offering-hero"><div className="shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/programs">NUST programs</Link><span>›</span><Link href={`/programs?category=${encodeURIComponent(offering.category)}`}>{offering.category}</Link><span>›</span><span>{offering.degreeName}</span></nav><div className="offering-head"><div><p className="eyebrow"><span /> {offering.category}</p><h1>{offering.degreeShortName}</h1><div className="offering-facts"><p><small>INSTITUTION</small><b>{offering.institutionCode}</b><span>{offering.institutionName}</span></p><p><small>CAMPUS</small><b>{offering.city}</b><span>{offering.campusName}</span></p></div></div><aside><StatusPill status={offering.status} availability={availability} count={mentors.length} /><p>{offering.status === "upcoming" ? "This program is listed for an upcoming intake. We won’t show current-student mentors until a cohort exists." : mentors.length ? `${mentors.length} verified ${mentors.length === 1 ? "student is" : "students are"} available to share their experience.` : "We’re still building mentor coverage for this exact program offering."}</p><Link className="button" href={offering.status === "upcoming" ? "/programs" : `/request-session?offering=${encodeURIComponent(offering.id)}`}>{mentors.length ? "Meet Students" : offering.status === "upcoming" ? "Explore current programs" : "Request a Mentor"}<span>→</span></Link></aside></div></div></section>
      <section className="shell offering-content section-space"><div className="mentor-area"><div className="section-heading"><p className="eyebrow">PEOPLE, NOT PROFILES</p><h2>{mentors.length ? "Students you can talk to" : "We don’t have a mentor for this program yet."}</h2>{!mentors.length && offering.status === "current" ? <p>Tell us you’re interested and we’ll work on finding someone from {offering.institutionCode}. Your request also helps us know where mentor recruitment is most needed.</p> : null}</div>{mentors.length ? <div className="mentor-grid">{mentors.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)}</div> : offering.status === "current" ? <div className="no-mentor-card"><div><span>EMPTY SEAT · FOR NOW</span><h3>Be first in line when we find someone.</h3><p>Share your questions and availability. The PageForward team will try to match you with a verified current student.</p></div><Link className="button" href={`/request-session?offering=${encodeURIComponent(offering.id)}`}>Request a Mentor <span>→</span></Link><Link className="underlined-link" href={`/become-a-mentor?offering=${encodeURIComponent(offering.id)}`}>Become the first mentor for this program</Link></div> : null}</div><aside className="question-panel"><p className="eyebrow">WHAT TO ASK</p><h2>Questions students commonly discuss</h2><ul><li>What does a normal week actually feel like?</li><li>How is the workload across a semester?</li><li>What surprised you after joining?</li><li>How do societies, internships and campus life fit in?</li><li>What do you wish you knew before choosing?</li></ul><p className="orientation-note">Mentors share personal experience, not official admissions advice.</p></aside></section>
      <section className="official-source"><div className="shell"><div><p className="eyebrow">OFFICIAL INFORMATION</p><h2>Use peer guidance alongside official sources.</h2><p>Program names and offering locations were last checked against NUST’s official undergraduate catalog on 28 September 2026.</p></div><a className="button button-quiet" href={offering.officialSourceUrl} target="_blank" rel="noreferrer">View official NUST information ↗</a></div></section>
    </main>
  );
}
