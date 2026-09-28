import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";
import { programOfferings, type MentorAvailability, type ProgramOffering } from "@/lib/catalog";

export type PublicMentor = {
  id: string;
  slug: string;
  fullName: string;
  semester: number;
  graduationYear: number;
  bio: string;
  languages: string[];
  profileImageUrl: string | null;
  availabilityNotes: string | null;
  topics: string[];
  offeringId: string;
  degreeShortName: string;
  institutionCode: string;
  city: string;
};

function publicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getPublicOfferings(): Promise<ProgramOffering[]> {
  const supabase = publicClient();
  if (!supabase) return programOfferings;
  const { data, error } = await supabase.from("public_program_offerings").select("*").order("display_order");
  if (error || !data?.length) return programOfferings;
  return data.map((live) => {
    const mentorCount = Number(live.mentor_count ?? 0);
    const availability: MentorAvailability = mentorCount > 1 ? "available" : mentorCount === 1 ? "limited" : "unavailable";
    return {
      id: live.public_id, degreeName: live.degree_name, degreeShortName: live.degree_short_name,
      degreeSlug: live.degree_slug, category: live.category, institutionName: live.institution_name,
      institutionCode: live.institution_code, institutionSlug: live.institution_slug,
      campusName: live.campus_name, campusSlug: live.campus_slug, city: live.city,
      offeringSlug: `${live.institution_slug}-${live.campus_slug}`, status: live.status,
      launchTerm: live.launch_term ?? undefined, mentorCount, mentorAvailability: availability,
      officialSourceUrl: live.official_source_url, lastVerifiedAt: live.last_verified_at,
    } as ProgramOffering;
  });
}

export async function getPublicMentorsForOffering(publicOfferingId: string): Promise<PublicMentor[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("public_mentors")
    .select("*")
    .eq("offering_public_id", publicOfferingId)
    .order("full_name");
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    semester: row.semester,
    graduationYear: row.graduation_year,
    bio: row.bio,
    languages: row.languages ?? [],
    profileImageUrl: row.profile_image_url,
    availabilityNotes: row.availability_notes,
    topics: row.topics ?? [],
    offeringId: row.offering_public_id,
    degreeShortName: row.degree_short_name,
    institutionCode: row.institution_code,
    city: row.city,
  }));
}

export async function getPublicMentor(slug: string): Promise<PublicMentor | null> {
  const supabase = publicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("public_mentors").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id, slug: data.slug, fullName: data.full_name, semester: data.semester,
    graduationYear: data.graduation_year, bio: data.bio, languages: data.languages ?? [],
    profileImageUrl: data.profile_image_url, availabilityNotes: data.availability_notes,
    topics: data.topics ?? [], offeringId: data.offering_public_id,
    degreeShortName: data.degree_short_name, institutionCode: data.institution_code, city: data.city,
  };
}
