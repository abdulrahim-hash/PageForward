import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminContext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export default async function ProtectedAdminLayout({children}:{children:React.ReactNode}) { const context=await getAdminContext(); if(!context.configured) return <main className="admin-setup"><div><p className="eyebrow">SETUP REQUIRED</p><h1>Connect PageForward to Supabase.</h1><p>The admin area is locked until the public URL, anon key and server-only service role key are configured. Follow the repository setup guide, run the migration and seed, then create the first admin user.</p><Link className="button" href="/">Return to site</Link></div></main>; if(!context.user) redirect("/admin/login"); if(!context.authorized) return <main className="admin-setup"><div><h1>Access not approved.</h1><p>Your Supabase account exists, but it is not listed in PageForward’s admin_users table.</p><Link className="button" href="/">Return to site</Link></div></main>; return <AdminShell email={context.user.email ?? "Admin"}>{children}</AdminShell>; }
