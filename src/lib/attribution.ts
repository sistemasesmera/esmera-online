const ATTR_KEY  = "esmera_attribution";
const FIRST_KEY = "esmera_attr_first";
const LS_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const UTM_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid", "fbclid",
] as const;

type UtmKey = typeof UTM_KEYS[number];
type Stored = Partial<Record<UtmKey | "landing_page" | "referrer", string>> & {
  _saved_at?: number;
};
export type Attribution = Record<UtmKey | "landing_page" | "referrer" | "fbp" | "fbc", string>;

function hasConsent(): boolean {
  try { return localStorage.getItem("esmera-cookie-consent") === "granted"; } catch { return false; }
}

function hasData(s: Stored): boolean {
  return Object.keys(s).some(k => k !== "_saved_at");
}

function readLs(): Stored {
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return {};
    const p: Stored = JSON.parse(raw);
    if (p._saved_at && Date.now() - p._saved_at > LS_TTL_MS) {
      localStorage.removeItem(ATTR_KEY);
      return {};
    }
    return p;
  } catch { return {}; }
}

function writeLs(data: Stored): void {
  try { localStorage.setItem(ATTR_KEY, JSON.stringify({ ...data, _saved_at: Date.now() })); } catch {}
}

function readSs(): Stored {
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch { return {}; }
}

function writeSs(data: Stored): void {
  try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(data)); } catch {}
}

function persist(data: Stored): void {
  writeSs(data);
  if (hasConsent()) writeLs(data);
}

function getCookie(name: string): string {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

export function captureAttribution(): void {
  const params      = new URLSearchParams(window.location.search);
  const hasUtms     = UTM_KEYS.some(k => params.has(k));
  const isFirstPage = !sessionStorage.getItem(FIRST_KEY);
  sessionStorage.setItem(FIRST_KEY, "1");

  if (!hasUtms && !isFirstPage) return;

  const incoming: Stored = {};
  UTM_KEYS.forEach(k => { const v = params.get(k); if (v) incoming[k] = v; });
  incoming.landing_page = window.location.pathname + window.location.search;
  if (isFirstPage && document.referrer) incoming.referrer = document.referrer;

  // Último clic: si hay UTMs nuevos o es primera página, reemplaza el bloque completo
  persist(incoming);
}

export function getAttribution(): Attribution {
  let stored: Stored = {};

  if (hasConsent()) {
    stored = readLs();
    if (!hasData(stored)) {
      // captureAttribution corrió antes de que se diera consentimiento → promover sessionStorage
      const ss = readSs();
      if (hasData(ss)) { writeLs(ss); stored = ss; }
    }
  } else {
    stored = readSs();
  }

  const fbclid = stored.fbclid ?? "";
  const fbp    = getCookie("_fbp");
  let   fbc    = getCookie("_fbc");
  if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;

  return {
    utm_source:   stored.utm_source   ?? "",
    utm_medium:   stored.utm_medium   ?? "",
    utm_campaign: stored.utm_campaign ?? "",
    utm_term:     stored.utm_term     ?? "",
    utm_content:  stored.utm_content  ?? "",
    gclid:        stored.gclid        ?? "",
    gbraid:       stored.gbraid       ?? "",
    wbraid:       stored.wbraid       ?? "",
    fbclid,
    landing_page: stored.landing_page ?? "",
    referrer:     stored.referrer     ?? "",
    fbp,
    fbc,
  };
}
