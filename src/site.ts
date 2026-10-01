// Все контакты и реквизиты — в одном месте.
// ⚠️ Сейчас здесь ЗАГЛУШКИ. Заменить на реальные данные перед запуском.

export const SITE = {
  name: "JanaStart",
  tagline: "Банкротство · Казахстан",
  city: "Алматы",
  phone: "+7 700 000-00-00",
  phoneHref: "tel:+77000000000",
  // Номер WhatsApp в международном формате без «+» и пробелов
  whatsapp: "77000000000",
  whatsappLabel: "+7 700 000-00-00",
  email: "info@janastart.kz",
  telegram: "janastart",
  address: "г. Алматы, ул. Примерная, 1, офис 100",
  addressNote: "БЦ «Пример», 1 этаж",
  hours: "пн–пт, 9:00–19:00",
  legalName: "ТОО «JanaStart»",
  bin: "000000000000",
  foundedYear: 2026,
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
