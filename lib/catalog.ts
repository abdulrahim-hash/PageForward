export type ProgramStatus = "current" | "upcoming" | "archived";
export type MentorAvailability = "available" | "limited" | "unavailable";

export const OFFICIAL_NUST_CATALOG_URL =
  "https://nust.edu.pk/admissions/undergraduates/list-of-ug-programmes-and-institutions/";
export const CATALOG_LAST_VERIFIED_AT = "2026-09-28";

export const categories = [
  "Engineering",
  "Computing",
  "Business",
  "Social Sciences",
  "Law",
  "Architecture & Design",
  "Natural Sciences",
  "Applied Sciences",
  "Health Sciences",
  "Interdisciplinary",
] as const;

export type Category = (typeof categories)[number];

type Institution = {
  code: string;
  name: string;
  slug: string;
  campus: string;
  campusSlug: string;
  city: string;
};

export const institutions: Record<string, Institution> = {
  SEECS: { code: "SEECS", name: "School of Electrical Engineering and Computer Science", slug: "seecs", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  SMME: { code: "SMME", name: "School of Mechanical and Manufacturing Engineering", slug: "smme", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  SCEE: { code: "SCEE", name: "School of Civil and Environmental Engineering", slug: "scee", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  SCME: { code: "SCME", name: "School of Chemical and Materials Engineering", slug: "scme", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  NBS: { code: "NBS", name: "NUST Business School", slug: "nbs", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  S3H: { code: "S3H", name: "School of Social Sciences and Humanities", slug: "s3h", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  JSPPL: { code: "JSPPL", name: "Jinnah School of Public Policy and Leadership", slug: "jsppl", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  NLS: { code: "NLS", name: "NUST Law School", slug: "nls", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  CIPS: { code: "CIPS", name: "Centre for International Peace and Stability", slug: "cips", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  SADA: { code: "SADA", name: "School of Art, Design and Architecture", slug: "sada", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  SNS: { code: "SNS", name: "School of Natural Sciences", slug: "sns", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  ASAB: { code: "ASAB", name: "Atta-ur-Rahman School of Applied Biosciences", slug: "asab", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  SINES: { code: "SINES", name: "School of Interdisciplinary Engineering and Sciences", slug: "sines", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  USPCAS_E: { code: "USPCAS-E", name: "US–Pakistan Center for Advanced Studies in Energy", slug: "uspcas-e", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  NSHS: { code: "NSHS", name: "NUST School of Health Sciences", slug: "nshs", campus: "NUST Islamabad", campusSlug: "islamabad", city: "Islamabad" },
  CEME: { code: "CoEME", name: "College of Electrical and Mechanical Engineering", slug: "coeme", campus: "NUST Rawalpindi", campusSlug: "rawalpindi", city: "Rawalpindi" },
  MCS: { code: "MCS", name: "Military College of Signals", slug: "mcs", campus: "NUST Rawalpindi", campusSlug: "rawalpindi", city: "Rawalpindi" },
  MCE: { code: "MCE", name: "Military College of Engineering", slug: "mce", campus: "NUST Risalpur", campusSlug: "risalpur", city: "Risalpur" },
  CAE: { code: "CAE", name: "College of Aeronautical Engineering", slug: "cae", campus: "NUST Risalpur", campusSlug: "risalpur", city: "Risalpur" },
  PNEC: { code: "PNEC", name: "Pakistan Navy Engineering College", slug: "pnec", campus: "NUST Karachi", campusSlug: "karachi", city: "Karachi" },
  NBC: { code: "NBC", name: "NUST Balochistan Campus", slug: "nbc", campus: "NUST Balochistan Campus", campusSlug: "quetta", city: "Quetta" },
};

type DegreeSeed = {
  name: string;
  shortName: string;
  slug: string;
  category: Category;
  institutions: string[];
  status?: ProgramStatus;
  launchTerm?: string;
};

const degreeSeeds: DegreeSeed[] = [
  { name: "Mechanical Engineering", shortName: "BE Mechanical Engineering", slug: "mechanical-engineering", category: "Engineering", institutions: ["SMME", "CEME", "PNEC"] },
  { name: "Electrical Engineering", shortName: "BE Electrical Engineering", slug: "electrical-engineering", category: "Engineering", institutions: ["SEECS", "CEME", "PNEC", "MCS"] },
  { name: "Mechatronics Engineering", shortName: "BE Mechatronics Engineering", slug: "mechatronics-engineering", category: "Engineering", institutions: ["CEME"] },
  { name: "Civil Engineering", shortName: "BE Civil Engineering", slug: "civil-engineering", category: "Engineering", institutions: ["SCEE", "MCE", "NBC"] },
  { name: "Chemical Engineering", shortName: "BE Chemical Engineering", slug: "chemical-engineering", category: "Engineering", institutions: ["SCME"] },
  { name: "Metallurgy and Materials Engineering", shortName: "BE Metallurgy & Materials Engineering", slug: "metallurgy-and-materials-engineering", category: "Engineering", institutions: ["SCME"] },
  { name: "Avionics Engineering", shortName: "BE Avionics Engineering", slug: "avionics-engineering", category: "Engineering", institutions: ["CAE"] },
  { name: "Aerospace Engineering", shortName: "BE Aerospace Engineering", slug: "aerospace-engineering", category: "Engineering", institutions: ["SMME", "CAE"] },
  { name: "Environmental Engineering", shortName: "BE Environmental Engineering", slug: "environmental-engineering", category: "Engineering", institutions: ["SCEE"] },
  { name: "Naval Architecture & Marine Engineering", shortName: "BE Naval Architecture & Marine Engineering", slug: "naval-architecture-marine-engineering", category: "Engineering", institutions: ["PNEC"] },
  { name: "Software Engineering", shortName: "BE Software Engineering", slug: "software-engineering", category: "Engineering", institutions: ["MCS", "SEECS"] },
  { name: "Computer Engineering", shortName: "BE Computer Engineering", slug: "computer-engineering", category: "Engineering", institutions: ["CEME", "SEECS"] },
  { name: "Information Security", shortName: "BE Information Security", slug: "information-security", category: "Engineering", institutions: ["MCS"] },
  { name: "Geoinformatics Engineering", shortName: "BE Geoinformatics Engineering", slug: "geoinformatics-engineering", category: "Engineering", institutions: ["SCEE"] },
  { name: "Energy Engineering", shortName: "BE Energy Engineering", slug: "energy-engineering", category: "Engineering", institutions: ["USPCAS_E"] },
  { name: "Computer Science", shortName: "BS Computer Science", slug: "computer-science", category: "Computing", institutions: ["SEECS", "NBC", "PNEC"] },
  { name: "Data Science", shortName: "BS Data Science", slug: "data-science", category: "Computing", institutions: ["SEECS"] },
  { name: "Artificial Intelligence", shortName: "BS Artificial Intelligence", slug: "artificial-intelligence", category: "Computing", institutions: ["SEECS", "NBC"] },
  { name: "Bioinformatics", shortName: "BS Bioinformatics", slug: "bioinformatics", category: "Computing", institutions: ["SINES"] },
  { name: "Business Administration", shortName: "Bachelor of Business Administration", slug: "business-administration", category: "Business", institutions: ["NBS"] },
  { name: "Accounting and Finance", shortName: "BS Accounting and Finance", slug: "accounting-and-finance", category: "Business", institutions: ["NBS"] },
  { name: "Tourism and Hospitality Management", shortName: "BS Tourism and Hospitality Management", slug: "tourism-hospitality-management", category: "Business", institutions: ["NBS"] },
  { name: "Economics", shortName: "BS Economics", slug: "economics", category: "Social Sciences", institutions: ["S3H"] },
  { name: "Mass Communication", shortName: "BS Mass Communication", slug: "mass-communication", category: "Social Sciences", institutions: ["S3H"] },
  { name: "Psychology", shortName: "BS Psychology", slug: "psychology", category: "Social Sciences", institutions: ["S3H"] },
  { name: "Liberal Arts & Humanities", shortName: "BS Liberal Arts & Humanities", slug: "liberal-arts-humanities", category: "Social Sciences", institutions: ["S3H"] },
  { name: "Public Administration", shortName: "Bachelor of Public Administration", slug: "public-administration", category: "Social Sciences", institutions: ["JSPPL"] },
  { name: "Law", shortName: "LLB", slug: "law", category: "Law", institutions: ["NLS"] },
  { name: "International Relations", shortName: "BS International Relations", slug: "international-relations", category: "Social Sciences", institutions: ["CIPS"], status: "upcoming", launchTerm: "Upcoming intake" },
  { name: "Architecture", shortName: "Bachelor of Architecture", slug: "architecture", category: "Architecture & Design", institutions: ["SADA"] },
  { name: "Industrial Design", shortName: "Bachelor of Industrial Design", slug: "industrial-design", category: "Architecture & Design", institutions: ["SADA"] },
  { name: "Mathematics", shortName: "BS Mathematics", slug: "mathematics", category: "Natural Sciences", institutions: ["SNS"] },
  { name: "Physics", shortName: "BS Physics", slug: "physics", category: "Natural Sciences", institutions: ["SNS"] },
  { name: "Chemistry", shortName: "BS Chemistry", slug: "chemistry", category: "Natural Sciences", institutions: ["SNS"] },
  { name: "Biotechnology", shortName: "BS Biotechnology", slug: "biotechnology", category: "Applied Sciences", institutions: ["ASAB"] },
  { name: "Food Science and Technology", shortName: "BS Food Science and Technology", slug: "food-science-technology", category: "Applied Sciences", institutions: ["ASAB"] },
  { name: "Agriculture", shortName: "BS Agriculture", slug: "agriculture", category: "Applied Sciences", institutions: ["ASAB"] },
  { name: "Environmental Science", shortName: "BS Environmental Science", slug: "environmental-science", category: "Applied Sciences", institutions: ["SCEE"] },
  { name: "Robotics & Artificial Intelligence", shortName: "BS Robotics & Artificial Intelligence", slug: "robotics-artificial-intelligence", category: "Interdisciplinary", institutions: ["SMME", "CEME"], status: "upcoming", launchTerm: "Upcoming intake" },
  { name: "Medicine", shortName: "MBBS — Bachelor of Medicine, Bachelor of Surgery", slug: "medicine-mbbs", category: "Health Sciences", institutions: ["NSHS"] },
  { name: "Human Nutrition & Dietetics", shortName: "BS Human Nutrition & Dietetics", slug: "human-nutrition-dietetics", category: "Health Sciences", institutions: ["NSHS"] },
];

export type ProgramOffering = {
  id: string;
  degreeName: string;
  degreeShortName: string;
  degreeSlug: string;
  category: Category;
  institutionName: string;
  institutionCode: string;
  institutionSlug: string;
  campusName: string;
  campusSlug: string;
  city: string;
  offeringSlug: string;
  status: ProgramStatus;
  launchTerm?: string;
  mentorAvailability: MentorAvailability;
  mentorCount: number;
  officialSourceUrl: string;
  lastVerifiedAt: string;
};

export const programOfferings: ProgramOffering[] = degreeSeeds.flatMap((degree) =>
  degree.institutions.map((institutionKey) => {
    const institution = institutions[institutionKey];
    return {
      id: `${degree.slug}--${institution.slug}-${institution.campusSlug}`,
      degreeName: degree.name,
      degreeShortName: degree.shortName,
      degreeSlug: degree.slug,
      category: degree.category,
      institutionName: institution.name,
      institutionCode: institution.code,
      institutionSlug: institution.slug,
      campusName: institution.campus,
      campusSlug: institution.campusSlug,
      city: institution.city,
      offeringSlug: `${institution.slug}-${institution.campusSlug}`,
      status: degree.status ?? "current",
      launchTerm: degree.launchTerm,
      mentorAvailability: "unavailable",
      mentorCount: 0,
      officialSourceUrl: OFFICIAL_NUST_CATALOG_URL,
      lastVerifiedAt: CATALOG_LAST_VERIFIED_AT,
    };
  }),
);

export const campusCities = [...new Set(programOfferings.map((offering) => offering.city))];
export const institutionOptions = [...new Set(programOfferings.map((offering) => offering.institutionCode))].sort();

export function findOffering(degreeSlug: string, offeringSlug: string) {
  return programOfferings.find(
    (offering) => offering.degreeSlug === degreeSlug && offering.offeringSlug === offeringSlug,
  );
}

export function offeringLabel(offering: ProgramOffering) {
  return `${offering.degreeShortName} — ${offering.institutionCode}, ${offering.city}`;
}
