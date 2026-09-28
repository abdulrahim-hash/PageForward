"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { campusCities, categories, institutionOptions, type ProgramOffering } from "@/lib/catalog";
import { StatusPill } from "@/components/ui/status-pill";
import { trackEvent } from "@/lib/analytics";

function acronym(value: string) { return value.split(/[^a-zA-Z]+/).filter(Boolean).map((word) => word[0]).join("").toLowerCase(); }

export function ProgramDirectory({ offerings, initialQuery = "", initialCategory = "All" }: { offerings: ProgramOffering[]; initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [campus, setCampus] = useState("All");
  const [institution, setInstitution] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => offerings.filter((offering) => {
    const needle = query.trim().toLowerCase();
    const searchable = `${offering.degreeName} ${offering.degreeShortName} ${offering.institutionName} ${offering.institutionCode} ${offering.city} ${acronym(offering.degreeName)} ${acronym(offering.degreeShortName)}`.toLowerCase();
    return (!needle || searchable.includes(needle)) && (category === "All" || offering.category === category) && (campus === "All" || offering.city === campus) && (institution === "All" || offering.institutionCode === institution) && (availability === "All" || offering.mentorAvailability === availability) && (status === "All" || offering.status === status);
  }), [offerings, query, category, campus, institution, availability, status]);

  function clearFilters() { setQuery(""); setCategory("All"); setCampus("All"); setInstitution("All"); setAvailability("All"); setStatus("All"); }

  return (
    <div className="directory-layout">
      <aside className="filter-panel" aria-label="Program filters">
        <div className="filter-title"><b>Filter programs</b><button type="button" onClick={clearFilters}>Reset</button></div>
        <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Campus / city<select value={campus} onChange={(event) => setCampus(event.target.value)}><option>All</option>{campusCities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Institution<select value={institution} onChange={(event) => setInstitution(event.target.value)}><option>All</option>{institutionOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Mentor availability<select value={availability} onChange={(event) => setAvailability(event.target.value)}><option>All</option><option value="available">Available</option><option value="limited">Limited</option><option value="unavailable">Recruiting</option></select></label>
        <label>Program status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option value="current">Current</option><option value="upcoming">Upcoming</option></select></label>
      </aside>

      <div className="directory-results">
        <div className="directory-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); trackEvent("program_search", { query: event.target.value }); }} placeholder="Search degree, school or city..." aria-label="Search degree, school or city" /><kbd>/</kbd></div>
        <div className="results-summary"><p><b>{filtered.length}</b> program offerings</p><span>Official NUST catalog · Verified September 2026</span></div>
        {filtered.length ? <div className="program-list">{filtered.map((offering) => (
          <Link className="directory-card" href={`/programs/${offering.degreeSlug}/${offering.offeringSlug}`} key={offering.id}>
            <div className="directory-card-top"><span className="category-label">{offering.category}</span><StatusPill status={offering.status} availability={offering.mentorAvailability} count={offering.mentorCount} /></div>
            <h2>{offering.degreeShortName}</h2>
            <p className="institution-line"><b>{offering.institutionCode}</b><span>{offering.institutionName}</span></p>
            <div className="card-bottom"><span>⌖ {offering.city}</span><strong>{offering.status === "upcoming" ? offering.launchTerm : offering.mentorCount ? `${offering.mentorCount} ${offering.mentorCount === 1 ? "student" : "students"} available` : "Request a mentor"} →</strong></div>
          </Link>
        ))}</div> : <div className="directory-empty"><span>⌕</span><h2>Let’s try a broader search.</h2><p>No program offerings match all of those filters. Clear them and explore the complete NUST catalog.</p><button className="button" type="button" onClick={clearFilters}>Clear filters</button></div>}
      </div>
    </div>
  );
}
