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

/** Телефон Казахстана: 11 цифр с кодом страны (поле начинается с «+7 »). */
export function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length === 11;
}

/** Поле телефона всегда начинается с «+7 »: номер вводят с кода оператора. Вставка и автозаполнение «+7…», «7…», «8…» префикс не дублируют. */
export function withCountryCode(value: string): string {
  let rest = (value.startsWith("+7") ? value.slice(2) : value.replace(/^\+/, "")).trimStart();
  const digits = rest.replace(/\D/g, "");
  if (digits.length === 11 && /^[78]/.test(digits)) rest = rest.replace(/^\D*[78]\s*/, "");
  return `+7 ${rest}`;
}
