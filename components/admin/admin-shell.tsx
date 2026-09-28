import Link from "next/link";

const links = [["Overview","/admin"],["Requests","/admin/requests"],["Sessions","/admin/sessions"],["Mentors","/admin/mentors"],["Applications","/admin/mentor-applications"],["Programs","/admin/programs"],["Feedback","/admin/feedback"]];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) { return <div className="admin-app"><aside className="admin-sidebar"><Link className="brand" href="/admin"><span>Page</span><strong>Forward</strong><i>↗</i></Link><p>OPERATIONS</p><nav>{links.map(([label,href])=><Link key={href} href={href}>{label}<span>→</span></Link>)}</nav><div className="admin-user"><span>Signed in as</span><b>{email}</b><form action="/api/auth/signout" method="post"><button type="submit">Sign out</button></form></div></aside><main className="admin-main" id="main-content">{children}</main></div>; }
