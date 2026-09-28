import type { Metadata } from "next";
import { ProgramDirectory } from "@/components/programs/program-directory";
import { getPublicOfferings } from "@/lib/data/public";

export const metadata: Metadata = { title: "Explore NUST Programs", description: "Browse every NUST undergraduate program by degree, institution, campus, status and mentor availability.", alternates: { canonical: "/programs" } };

export default async function ProgramsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const [params, offerings] = await Promise.all([searchParams, getPublicOfferings()]);
  return <main id="main-content"><section className="page-hero directory-hero"><div className="shell"><p className="eyebrow"><span /> COMPLETE NUST CATALOG</p><h1>What are you thinking of studying?</h1><p>Explore every undergraduate program offered at NUST and find students already experiencing it.</p></div></section><section className="shell directory-section"><ProgramDirectory offerings={offerings} initialQuery={params.q ?? ""} initialCategory={params.category ?? "All"} /></section></main>;
}
