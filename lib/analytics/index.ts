export type AnalyticsEvent =
  | "program_search" | "program_view" | "mentor_view" | "find_mentor_click"
  | "session_request_started" | "session_request_completed"
  | "mentor_application_started" | "mentor_application_completed"
  | "mentor_unavailable_request";

export function trackEvent(name: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("pageforward:analytics", { detail: { name, properties } }));
}
