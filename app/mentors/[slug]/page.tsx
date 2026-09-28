/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicMentor } from "@/lib/data/public";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const mentor = await getPublicMentor(slug); if (!mentor) return {};
  const title = `${mentor.fullName} — Verified NUST Student`;
  const description = `Request a 20–30 minute PageForward conversation with ${mentor.fullName}, studying ${mentor.degreeShortName} at ${mentor.institutionCode}.`;
  return { title, description, openGraph: { title, description, images: mentor.profileImageUrl ? [{ url: mentor.profileImageUrl }] : [] }, twitter: { title, description, images: mentor.profileImageUrl ? [mentor.profileImageUrl] : [] } };
}

export default async function MentorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const mentor = await getPublicMentor(slug); if (!mentor) notFound();
  const initials = mentor.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return <main id="main-content"><section className="mentor-profile-hero"><div className="shell mentor-profile-grid"><div className="mentor-profile-photo">{mentor.profileImageUrl ? <img src={mentor.profileImageUrl} alt={`Portrait of ${mentor.fullName}`} /> : <span>{initials}</span>}</div><div><p className="verified-label">✓ Verified NUST Student</p><h1>{mentor.fullName}</h1><p className="mentor-program">{mentor.degreeShortName}<br /><span>{mentor.institutionCode} · {mentor.city} · {mentor.semester}th Semester</span></p><p className="mentor-bio">{mentor.bio}</p><div className="profile-meta"><div><small>ASK ME ABOUT</small><div className="topic-row">{mentor.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div><div><small>LANGUAGES</small><p>{mentor.languages.join(" · ")}</p></div><div><small>CONVERSATION</small><p>20–30 minutes · Google Meet</p></div></div><Link className="button" href={`/request-session?mentor=${mentor.id}&offering=${encodeURIComponent(mentor.offeringId)}`}>Request a Conversation <span>→</span></Link></div></div></section><section className="shell profile-trust section-space"><h2>A real conversation, with clear boundaries.</h2><div><p>Mentors share their own experience — not official university advice.</p><p>Your contact information stays private and scheduling is mediated by PageForward.</p><p>Sessions are not recorded by PageForward by default.</p></div></section></main>;
}
