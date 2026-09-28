/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { PublicMentor } from "@/lib/data/public";

export function MentorCard({ mentor }: { mentor: PublicMentor }) {
  const initials = mentor.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return (
    <article className="public-mentor-card">
      <div className="mentor-photo">{mentor.profileImageUrl ? <img src={mentor.profileImageUrl} alt={`Portrait of ${mentor.fullName}`} /> : <span>{initials}</span>}<i aria-label="Verified NUST student">✓</i></div>
      <p className="verified-label">Verified NUST Student</p>
      <h3>{mentor.fullName}</h3>
      <p>{mentor.degreeShortName}<br /><span>{mentor.institutionCode} · {mentor.semester}th Semester</span></p>
      <div className="topic-row">{mentor.topics.slice(0, 4).map((topic) => <span key={topic}>{topic}</span>)}</div>
      <Link className="button" href={`/mentors/${mentor.slug}`}>Meet {mentor.fullName.split(" ")[0]} <span>→</span></Link>
    </article>
  );
}
