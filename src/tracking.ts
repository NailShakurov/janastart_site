// Реклама и аналитика: сохранение UTM-меток (F-04) и события конверсий (F-03).
// Счётчик (gtag / Google Tag Manager) на сайте пока не подключён — события
// уходят в window.dataLayer и в gtag, если они появятся на странице.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
const STORAGE_KEY = "janastart_utm";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 дней

type Stored = { params: Record<string, string>; expires: number };

const isBrowser = () => typeof window !== "undefined";

/** Запоминает UTM и gclid при первом заходе; вызывается один раз при загрузке. */
export function captureUtm() {
  if (!isBrowser()) return;
  try {
    const url = new URL(window.location.href);
    const params: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = url.searchParams.get(key);
      if (v) params[key] = v;
    }
    if (Object.keys(params).length === 0) return;
    const stored: Stored = { params, expires: Date.now() + TTL_MS };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* localStorage недоступен (приватный режим) — просто не сохраняем */
  }
}

/** Возвращает сохранённые UTM-параметры, если срок хранения не истёк. */
export function getUtm(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as Stored;
    if (!stored.expires || stored.expires < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return stored.params ?? {};
  } catch {
    return {};
  }
}

export type ConversionEvent = "form_submit" | "whatsapp_click" | "phone_click";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Событие конверсии для Google Ads / GTM. Без счётчика на странице ничего не делает. */
export function track(event: ConversionEvent, data: Record<string, string> = {}) {
  if (!isBrowser()) return;
  const payload = { ...getUtm(), ...data };
  window.dataLayer?.push({ event, ...payload });
  window.gtag?.("event", event, payload);
}
