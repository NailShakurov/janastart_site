// Логика заявки без React: текст для wa.me, тело запроса к worker (worker/lead.js),
// значения для события form_submit. Значения в dataLayer всегда русские — отчёты в GA4
// и Google Ads не должны разъезжаться по языкам страниц.
import type { Content } from "./content";
import type { Lang } from "./i18n";
import type { UiText } from "./ui-text";

export type LeadFields = { name: string; phone: string; who: string; city: string; topic: string };

type WhatsappText = UiText["whatsapp"];

/** Текст для wa.me: приветствие, затем «Подпись: значение» построчно; источник — если не пуст. */
export function buildWhatsappText(t: WhatsappText, lead: LeadFields, source: string): string {
  return [
    t.greeting,
    `${t.name}: ${lead.name}`,
    `${t.phone}: ${lead.phone}`,
    `${t.who}: ${lead.who}`,
    `${t.city}: ${lead.city}`,
    `${t.topic}: ${lead.topic}`,
    source ? `${t.source}: ${source}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Короткий текст для запасной ссылки «нажмите здесь», одной строкой. */
export function buildFallbackText(t: WhatsappText, lead: LeadFields): string {
  const low = (s: string) => s.toLowerCase();
  return `${t.greeting} ${t.name}: ${lead.name}, ${low(t.phone)}: ${lead.phone}, ${low(t.city)}: ${lead.city}, ${low(t.topic)}: ${lead.topic}`;
}

/** Тело запроса к worker: поля заявки плюс страница, источник, ловушка для ботов и язык. */
export function buildLeadPayload(
  lead: LeadFields,
  extra: { page: string; source: string; website: string; lang: Lang },
): Record<string, string> {
  return { ...lead, ...extra };
}

/** Русское значение по индексу в списке текущего языка; если не найдено — исходное. */
export function toRuValue(
  current: readonly string[],
  ru: readonly string[],
  value: string,
): string {
  const i = current.indexOf(value);
  return i >= 0 ? (ru[i] ?? value) : value;
}

/** Параметры form_submit: client_type, lead_topic, lead_city — всегда по-русски. */
export function formSubmitParams(c: Content, ru: Content, lead: LeadFields) {
  return {
    client_type: toRuValue(c.whoOptions, ru.whoOptions, lead.who),
    lead_topic: toRuValue(c.topicOptions, ru.topicOptions, lead.topic),
    lead_city: toRuValue(c.cityOptions, ru.cityOptions, lead.city),
  };
}
