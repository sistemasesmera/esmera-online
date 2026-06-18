// Single integration point for lead submissions.
// There is no backend/CRM wired up yet (decision pending) — until then, leads
// are handed off via a pre-filled mailto so nothing is silently lost.
// Once a CRM is chosen, replace the body of `submitLead` with a fetch() call
// to its API/webhook; no caller needs to change.

export const LEAD_NOTIFICATION_EMAIL = "info@esmeraonline.com";

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  courseOfInterest?: string;
  message?: string;
}

export function submitLead(payload: LeadPayload) {
  const subject = encodeURIComponent(
    `Nueva solicitud de información${payload.courseOfInterest ? ` — ${payload.courseOfInterest}` : ""}`,
  );
  const bodyLines = [
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `Teléfono: ${payload.phone}`,
    payload.courseOfInterest ? `Curso de interés: ${payload.courseOfInterest}` : null,
    payload.message ? `Mensaje: ${payload.message}` : null,
  ].filter(Boolean);
  const body = encodeURIComponent(bodyLines.join("\n"));

  window.location.href = `mailto:${LEAD_NOTIFICATION_EMAIL}?subject=${subject}&body=${body}`;
}
