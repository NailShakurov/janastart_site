// Реклама и аналитика: сохранение UTM-меток (F-04) и события конверсий (F-03).
// События уходят в window.dataLayer — его читает Google Tag Manager (подключается
// через SITE.gtmId). Внутри GTM на них вешаются теги GA4 и Google Ads.
// Персональные данные (имя, телефон) в события не передаются.

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

/**
 * События конверсий. Имена и параметры согласованы с ТЗ по SEO/аналитике:
 * - form_submit: client_type (поле «Кто вы»), lead_topic (поле «Тема»), lead_city (поле «Город»);
 * - phone_click, whatsapp_click: link_location (header | hero | contacts | form | footer | sticky_bar).
 * Ко всем событиям добавляются page_path и сохранённые UTM.
 */
export type ConversionEvent = "form_submit" | "whatsapp_click" | "phone_click";

export type LinkLocation = "header" | "hero" | "contacts" | "form" | "footer" | "sticky_bar";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Кладёт событие конверсии в dataLayer для Google Tag Manager. Без GTM на странице ничего не делает. */
export function track(event: ConversionEvent, data: Record<string, string> = {}) {
  if (!isBrowser()) return;
  const payload = { ...getUtm(), page_path: window.location.pathname, ...data };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}
