export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pageforward-nust-guidance.racing-skunk-1742.chatgpt.site",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL,
};

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function isServerSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}
