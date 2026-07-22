const CRM_URL = import.meta.env.PUBLIC_CRM_URL as string;
const CRM_API_KEY = import.meta.env.PUBLIC_CRM_API_KEY as string;

export interface LeadPayload {
  name: string;
  email?: string;
  phone: string;
  courseOfInterest?: string;
  message?: string;
}

export type LeadResult =
  | { ok: true }
  | { ok: false; duplicate: true; error: "duplicate_lead" | "already_student" }
  | { ok: false; duplicate: false };

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch(`${CRM_URL}/api/public/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CRM_API_KEY,
      },
      body: JSON.stringify({
        full_name: payload.name,
        phone: payload.phone,
        email: payload.email || undefined,
        source: "web",
        interested_course: payload.courseOfInterest ? `Web:${payload.courseOfInterest}` : undefined,
        notes: payload.message || undefined,
      }),
    });

    if (res.status === 201) return { ok: true };

    if (res.status === 409) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, duplicate: true, error: data.error };
    }

    const text = await res.text().catch(() => "");
    console.error("[leads] unexpected status:", res.status, text);
    return { ok: false, duplicate: false };
  } catch (err) {
    console.error("[leads] fetch error:", err);
    return { ok: false, duplicate: false };
  }
}
