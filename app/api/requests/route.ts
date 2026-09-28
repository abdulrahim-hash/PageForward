import { NextResponse } from "next/server";
import { guidanceRequestSchema } from "@/lib/validation/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(`request:${ip}`); if (!rate.allowed) return NextResponse.json({ message: "Too many requests from this connection. Please wait a few minutes and try again." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  try {
    const result = guidanceRequestSchema.safeParse(await request.json());
    if (!result.success) return NextResponse.json({ message: result.error.issues[0]?.message ?? "Please check the form and try again." }, { status: 400 });
    const supabase = createAdminClient(); if (!supabase) return NextResponse.json({ message: "Request intake is being configured. Your answers are still on this page — please try again shortly." }, { status: 503 });
    const input = result.data; const { data: offering } = await supabase.from("program_offerings").select("id").eq("public_id", input.offeringId).eq("active", true).maybeSingle();
    if (!offering) return NextResponse.json({ message: "That program offering is not currently accepting requests. Please choose another." }, { status: 400 });
    const { data: created, error } = await supabase.from("guidance_requests").insert({ student_name: input.studentName, student_email: input.studentEmail, phone_optional: input.phoneOptional || null, school_college: input.schoolCollege, education_level: input.educationLevel, offering_id: offering.id, preferred_mentor_id: input.preferredMentorId || null, reason: input.reason, questions: input.questions, availability: input.availability, under_18: input.under18, guardian_acknowledgement: input.guardianAcknowledgement, status: "new" }).select("id").single();
    if (error) { console.error("guidance_request_insert_failed", error.code); return NextResponse.json({ message: "Something went wrong while sending your request. Your answers haven’t been intentionally discarded. Please try again." }, { status: 500 }); }
    await Promise.allSettled([sendEmail({ to: input.studentEmail, subject: "We’ve got your PageForward request", html: `<h1>We’ve got your request.</h1><p>We’ll review your program and availability and work on connecting you with the right NUST student.</p><p>Reference: ${created.id}</p>` }), ...(env.adminNotificationEmail ? [sendEmail({ to: env.adminNotificationEmail, subject: "New PageForward guidance request", html: `<p>A new request is ready for review.</p><p>Reference: ${created.id}</p>` })] : [])]);
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) { console.error("guidance_request_unhandled", error instanceof Error ? error.message : "unknown"); return NextResponse.json({ message: "Something went wrong while sending your request. Your answers haven’t been intentionally discarded. Please try again." }, { status: 500 }); }
}
