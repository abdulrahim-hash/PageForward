import type { MentorAvailability, ProgramStatus } from "@/lib/catalog";

export function StatusPill({ status, availability, count = 0 }: { status: ProgramStatus; availability: MentorAvailability; count?: number }) {
  if (status === "upcoming") return <span className="status-pill upcoming">Upcoming program</span>;
  if (availability === "available") return <span className="status-pill available">{count} students available</span>;
  if (availability === "limited") return <span className="status-pill limited">Limited availability</span>;
  return <span className="status-pill recruiting">Recruiting a mentor</span>;
}
