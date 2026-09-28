import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { programOfferings } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/programs", "/request-session", "/become-a-mentor", "/how-it-works", "/about", "/faq", "/privacy", "/terms", "/community-guidelines"];
  return [...pages.map((path) => ({ url: `${env.siteUrl}${path}`, lastModified: new Date("2026-09-28"), changeFrequency: path === "/programs" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })), ...programOfferings.map((item) => ({ url: `${env.siteUrl}/programs/${item.degreeSlug}/${item.offeringSlug}`, lastModified: new Date(item.lastVerifiedAt), changeFrequency: "monthly" as const, priority: .8 }))];
}
