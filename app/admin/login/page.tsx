import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminContext } from "@/lib/auth/admin";

export default async function AdminLoginPage() { const context=await getAdminContext(); if(context.authorized) redirect("/admin"); return <main id="main-content" className="admin-login-page"><div className="admin-login-card"><Link className="brand" href="/"><span>Page</span><strong>Forward</strong><i>↗</i></Link><p className="eyebrow">TEAM ACCESS</p><h1>PageForward operations</h1><p>{context.configured?"Sign in with an approved administrator account.":"Connect the Supabase environment variables before administrator sign-in can be used."}</p><AdminLoginForm /><Link className="underlined-link" href="/">← Return to the public site</Link></div></main>; }
