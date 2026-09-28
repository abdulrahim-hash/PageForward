import "server-only";
import { env } from "@/lib/env";

type EmailMessage = { to: string | string[]; subject: string; html: string };

export async function sendEmail(message: EmailMessage) {
  if (!env.resendApiKey) return { delivered: false, reason: "not_configured" as const };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "PageForward <hello@pageforward.org>", ...message }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return { delivered: true as const };
}
