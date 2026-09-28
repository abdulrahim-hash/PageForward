"use client";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { educationLevels } from "@/lib/validation/schemas";
import { offeringLabel, type ProgramOffering } from "@/lib/catalog";
import { trackEvent } from "@/lib/analytics";

export function RequestForm({ offerings, initialOffering = "", preferredMentorId = "" }: { offerings: ProgramOffering[]; initialOffering?: string; preferredMentorId?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [under18, setUnder18] = useState(false);
  const selected = useMemo(() => offerings.find((item) => item.id === initialOffering), [offerings, initialOffering]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setError(""); trackEvent("session_request_started", { offering: initialOffering || "selected_in_form" });
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, under18: payload.under18 === "yes", guardianAcknowledgement: payload.guardianAcknowledgement === "on" }) });
    if (response.ok) { setStatus("success"); trackEvent("session_request_completed", { offering: String(payload.offeringId) }); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const body = await response.json().catch(() => ({})) as { message?: string }; setError(body.message ?? "Something went wrong while sending your request. Your answers haven’t been intentionally discarded. Please try again."); setStatus("error");
  }

  if (status === "success") return <div className="confirmation-card"><span className="confirmation-check">✓</span><p className="eyebrow">REQUEST RECEIVED</p><h1>We’ve got your request.</h1><p>We’ll review your program and availability and work on connecting you with the right student.</p><div className="confirmation-steps"><span><b>1</b>Request received</span><i>→</i><span><b>2</b>Mentor matched</span><i>→</i><span><b>3</b>Meeting confirmed</span></div><p className="small-note">Watch your inbox for a message from PageForward. We’ll never share your contact details publicly.</p><Link className="button" href="/programs">Explore more programs <span>→</span></Link></div>;

  return <form className="pf-form" onSubmit={submit} noValidate>
    {selected ? <div className="selected-offering"><span>YOUR REQUEST</span><b>{selected.degreeShortName}</b><p>{selected.institutionCode} · {selected.city}</p></div> : null}
    <fieldset><legend>About you <span>01</span></legend><div className="field-grid"><label>Full name<input name="studentName" required autoComplete="name" /></label><label>Email address<input name="studentEmail" type="email" required autoComplete="email" /></label><label>Current school / college<input name="schoolCollege" required /></label><label>Education level<select name="educationLevel" required defaultValue=""><option value="" disabled>Select one</option>{educationLevels.map((level) => <option key={level}>{level}</option>)}</select></label><label className="full-field">Phone / WhatsApp <em>Optional</em><input name="phoneOptional" type="tel" autoComplete="tel" /><small>Used only if email scheduling becomes difficult.</small></label></div></fieldset>
    <fieldset><legend>Your program <span>02</span></legend><label>Exact NUST program offering<select name="offeringId" required defaultValue={initialOffering}><option value="" disabled>Choose a degree, school and campus</option>{offerings.filter((item) => item.status === "current").map((item) => <option value={item.id} key={item.id}>{offeringLabel(item)}</option>)}</select></label><input type="hidden" name="preferredMentorId" value={preferredMentorId} /><label>Why are you considering this program?<textarea name="reason" required minLength={20} rows={4} placeholder="Tell us what draws you to it, and what you’re weighing up." /></label><label>What would you like to ask?<textarea name="questions" required minLength={10} rows={5} placeholder="Academics, workload, campus life, careers — write the questions that matter to you." /></label></fieldset>
    <fieldset><legend>Availability & safety <span>03</span></legend><label>When are you generally available?<textarea name="availability" required rows={3} placeholder="For example: Weekdays after 5pm PKT, or Saturday mornings." /></label><div className="radio-group"><span>Are you under 18?</span><label><input type="radio" name="under18" value="yes" checked={under18} onChange={() => setUnder18(true)} /> Yes</label><label><input type="radio" name="under18" value="no" checked={!under18} onChange={() => setUnder18(false)} /> No</label></div>{under18 ? <label className="checkbox-field"><input type="checkbox" name="guardianAcknowledgement" required /><span>My parent or guardian is aware that I am requesting a PageForward Google Meet conversation.</span></label> : null}<p className="safety-copy">PageForward mediates scheduling. Mentors will not see your private contact details, and sessions are not recorded by PageForward by default.</p></fieldset>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    {status === "error" ? <p className="form-error" role="alert">{error}</p> : null}<button className="button form-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send My Request"}<span>→</span></button><p className="form-consent">By submitting, you agree to our <Link href="/privacy">privacy policy</Link> and <Link href="/community-guidelines">community guidelines</Link>.</p>
  </form>;
}
