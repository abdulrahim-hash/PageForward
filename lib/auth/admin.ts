import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, isServerSupabaseConfigured } from "@/lib/env";

export async function getAdminContext() {
  if (!isSupabaseConfigured() || !isServerSupabaseConfigured()) return { configured: false as const, user: null, authorized: false as const };
  const authClient = await createServerSupabaseClient(); const { data: { user } } = await authClient!.auth.getUser();
  if (!user) return { configured: true as const, user: null, authorized: false as const };
  const admin = createAdminClient(); const { data } = await admin!.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return { configured: true as const, user, authorized: Boolean(data) };
}

export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context.configured) throw new Error("Supabase is not configured");
  if (!context.user) redirect("/admin/login");
  if (!context.authorized) throw new Error("This account is not an approved PageForward administrator");
  return context.user;
}
