export interface TrackLeadParams {
  form_location: "ficha_curso" | "landing" | "popup_asesor";
  course_id: string;
  course_name: string;
  value: number;
  email?: string;
  phone?: string;
}

export function trackLead(params: TrackLeadParams): void {
  (window as any).dataLayer = (window as any).dataLayer || [];

  const user_data: Record<string, string> = {};
  if (params.email) user_data.email = params.email.toLowerCase().replace(/\s/g, "");
  if (params.phone) user_data.phone_number = params.phone;

  const payload: Record<string, unknown> = {
    event: "generate_lead",
    form_location: params.form_location,
    course_id: params.course_id || "sin_definir",
    course_name: params.course_name || "Aún no lo sé",
    value: params.value,
    currency: "EUR",
    event_id: crypto.randomUUID(),
  };

  if (Object.keys(user_data).length > 0) payload.user_data = user_data;

  (window as any).dataLayer.push(payload);
}
