// Логика заявки без React: текст для wa.me и тело запроса к worker (worker/lead.js).
// Форма собирает только телефон: в мессенджеры и в события уходит минимум данных.
import type { Lang } from "./i18n";
import type { UiText } from "./ui-text";

type WhatsappText = UiText["whatsapp"];

/** Текст заявки для wa.me: «Новая заявка с сайта: +7 …» на языке страницы. */
export function buildLeadText(t: WhatsappText, phone: string): string {
  return `${t.leadPrefix} ${phone}`;
}

/** Тело запроса к worker: телефон, ловушка для ботов и язык страницы. */
export function buildLeadPayload(
  phone: string,
  extra: { website: string; lang: Lang },
): Record<string, string> {
  return { phone, ...extra };
}

/** Телефон Казахстана: 10–11 цифр (с кодом страны или без). */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
}
