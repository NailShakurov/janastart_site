// Все контакты и реквизиты — в одном месте.

export const SITE = {
  name: "JanaStart",
  // Отображаемое название бренда (юридическое — legalName)
  brand: "JANA START",
  tagline: "Банкротство · Казахстан",
  city: "Алматы",
  phone: "+7 700 930-50-50",
  phoneHref: "tel:+77009305050",
  // Номер WhatsApp в международном формате без «+» и пробелов
  whatsapp: "77009305050",
  whatsappLabel: "+7 700 930-50-50",
  email: "janastart02@gmail.com",
  telegram: "janastart",
  address: "г. Алматы, ул. Ауэзова, 145 В, офис 103",
  addressNote: "",
  hours: "пн–пт, 9:00–19:00",
  legalName: "ИП JANA START",
  bin: "810518401012",
  foundedYear: 2026,
} as const;

// Предзаполненное сообщение для кнопок «Написать в WhatsApp» (T-06)
export const WHATSAPP_GREETING = "Здравствуйте! Хочу получить бесплатную консультацию.";

export const whatsappLink = (text: string = WHATSAPP_GREETING) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
