const ENDPOINT = import.meta.env.PUBLIC_LEADS_ENDPOINT as string;
const API_KEY  = import.meta.env.PUBLIC_LEADS_API_KEY  as string;

export interface LeadPayload {
  nombre:            string;
  telefono:          string;
  email?:            string;
  mensaje?:          string;
  acepta_privacidad: boolean;
  form_location:     "landing" | "ficha_curso" | "popup_asesor";
  course_id:         string;
  course_name?:      string;
  // atribución
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  utm_term?:     string;
  utm_content?:  string;
  gclid?:        string;
  gbraid?:       string;
  wbraid?:       string;
  fbclid?:       string;
  fbc?:          string;
  fbp?:          string;
  landing_page?: string;
  referrer?:     string;
  // honeypot
  website?: string;
}

export interface LeadResult {
  ok:       boolean;
  event_id: string;
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const event_id = crypto.randomUUID();

  const body = {
    nombre:            payload.nombre,
    telefono:          payload.telefono,
    email:             payload.email?.trim().toLowerCase() ?? "",
    mensaje:           payload.mensaje ?? "",
    acepta_privacidad: payload.acepta_privacidad,
    form_location:     payload.form_location,
    course_id:         payload.course_id || "sin_definir",
    course_name:       payload.course_name ?? "",
    event_id,
    utm_source:        payload.utm_source   ?? "",
    utm_medium:        payload.utm_medium   ?? "",
    utm_campaign:      payload.utm_campaign ?? "",
    utm_term:          payload.utm_term     ?? "",
    utm_content:       payload.utm_content  ?? "",
    gclid:             payload.gclid        ?? "",
    gbraid:            payload.gbraid       ?? "",
    wbraid:            payload.wbraid       ?? "",
    fbclid:            payload.fbclid       ?? "",
    fbc:               payload.fbc          ?? "",
    fbp:               payload.fbp          ?? "",
    landing_page:      payload.landing_page ?? "",
    referrer:          payload.referrer     ?? "",
    page_url:          window.location.href,
    website:           payload.website      ?? "",
  };

  try {
    const res = await fetch(`${ENDPOINT}/api/public/leads`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body:    JSON.stringify(body),
    });

    if (res.ok) return { ok: true, event_id };

    const text = await res.text().catch(() => "");
    console.error("[leads] error:", res.status, text);
    return { ok: false, event_id };
  } catch (err) {
    console.error("[leads] fetch error:", err);
    return { ok: false, event_id };
  }
}
