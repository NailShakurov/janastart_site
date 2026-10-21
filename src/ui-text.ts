// Тексты интерфейса (подписи, кнопки, aria, подвал, форма): русский — UI_RU, казахский — ui-text.kk.ts.
// Контакты и реквизиты по-русски живут в SITE (их читают и нетронутые страницы); здесь на них ссылки.
import { SITE, WHATSAPP_GREETING } from "./site";

export type UiText = {
  lang: "ru" | "kk";
  skipLink: string;
  logoAlt: string;
  header: {
    homeAria: string;
    navAria: string;
    mobileNavAria: string;
    openMenu: string;
    closeMenu: string;
    callAria: string;
    consult: string;
    langAria: string;
    crumbsAria: string;
  };
  /** Подписи переключателя языка — одинаковы в обоих словарях. */
  langNames: { ru: string; kk: string };
  site: {
    tagline: string;
    address: string;
    hours: string;
    legalName: string;
    onlineNote: string;
    binLabel: string;
  };
  pages: {
    home: { title: string; tagline: string; lead: string; kzNote?: string };
    bankrotstvo: { title: string; lead: string; kzNote?: string };
  };
  hero: { consult: string; whatsapp: string };
  bankruptcy: { title: string; lead: string; count: string; law: string; discuss: string };
  otherServices: { title: string; lead: string };
  process: { title: string };
  why: { title: string; lead: string };
  faq: { title: string };
  contact: {
    title1: string;
    title2: string;
    intro?: string;
    address: string;
    phone: string;
    whatsapp: string;
    whatsappNote: string;
    email: string;
  };
  form: {
    name: string;
    namePlaceholder: string;
    phone: string;
    who: string;
    city: string;
    cityPlaceholder: string;
    topic: string;
    consent: string;
    consentLink: string;
    error: string;
    submit: string;
    orCall: string;
  };
  /** text содержит «{name}» — подставляется имя из формы. */
  done: { title: string; text: string; link: string; orCall: string };
  footer: { rights: string; info: string; policy: string };
  bar: { call: string; whatsapp: string };
  /** Приветствие и подписи полей в тексте для wa.me. */
  whatsapp: {
    greeting: string;
    name: string;
    phone: string;
    who: string;
    city: string;
    topic: string;
    source: string;
  };
  seo: { orgDescription: string };
};

export const UI_RU: UiText = {
  lang: "ru",
  skipLink: "Перейти к содержанию",
  logoAlt: "JANA START — юридическая компания, Алматы",
  header: {
    homeAria: "JANA START — на главную",
    navAria: "Основная навигация",
    mobileNavAria: "Мобильная навигация",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    callAria: "Позвонить",
    consult: "Консультация",
    langAria: "Язык сайта",
    crumbsAria: "Хлебные крошки",
  },
  langNames: { ru: "Рус", kk: "Қаз" },
  site: {
    tagline: SITE.tagline,
    address: SITE.address,
    hours: SITE.hours,
    legalName: SITE.legalName,
    onlineNote: SITE.onlineNote,
    binLabel: "БИН",
  },
  pages: {
    home: {
      title: "Банкротство и юридическая помощь в Алматы",
      tagline: "Новый старт без долгов",
      lead: "Jana по-казахски значит «новый». Мы помогаем гражданам, ИП и компаниям выйти из долгов по закону и решаем другие юридические вопросы. Юристы с 20-летним стажем.",
    },
    bankrotstvo: {
      title: "Банкротство в Казахстане: новый старт без долгов",
      lead: "Помогаем гражданам, ИП и компаниям законно выйти из долгов: внесудебное и судебное банкротство, восстановление платёжеспособности. Юристы с 20-летним стажем, первая консультация бесплатно.",
    },
  },
  hero: { consult: "Бесплатная консультация", whatsapp: "Написать в WhatsApp" },
  bankruptcy: {
    title: "Банкротство по закону Казахстана",
    lead: "Подходящая процедура зависит от суммы долга, просрочки, дохода и имущества. На консультации мы честно скажем, какая из них вам подходит и подходит ли банкротство вообще.",
    count: "03 направления",
    law: "Закон РК «О восстановлении платёжеспособности и банкротстве граждан Республики Казахстан»",
    discuss: "Обсудить мою ситуацию →",
  },
  otherServices: {
    title: "Юридическая помощь по другим вопросам",
    lead: "Если у вас не долги, а другая правовая задача, мы тоже поможем: от консультации до представительства в суде.",
  },
  process: { title: "Как мы работаем" },
  why: { title: "Почему JANA START", lead: "Мы строим работу на четырёх правилах." },
  faq: { title: "Частые вопросы" },
  contact: {
    title1: "Оставьте заявку —",
    title2: "первая консультация бесплатно.",
    address: "Адрес",
    phone: "Телефон",
    whatsapp: "WhatsApp",
    whatsappNote: ", отвечаем быстрее всего",
    email: "E-mail",
  },
  form: {
    name: "Ваше имя",
    namePlaceholder: "Например, Айгерим",
    phone: "Телефон",
    who: "Кто вы",
    city: "Город",
    cityPlaceholder: "Выберите город",
    topic: "Тема обращения",
    consent: "Согласен(на) на сбор и обработку персональных данных (",
    consentLink: "политика конфиденциальности",
    error: "Заполните имя, телефон и город и подтвердите согласие.",
    submit: "Получить консультацию в WhatsApp",
    orCall: "Или позвоните:",
  },
  done: {
    title: "Почти готово",
    text: "{name}, мы открыли WhatsApp с готовым сообщением — просто нажмите «Отправить». Если окно не открылось, ",
    link: "нажмите здесь",
    orCall: "или позвоните:",
  },
  footer: {
    rights: "Все права защищены.",
    info: "Сайт носит информационный характер и не является публичной офертой.",
    policy: "Политика конфиденциальности",
  },
  bar: { call: "Позвонить", whatsapp: "WhatsApp" },
  whatsapp: {
    greeting: WHATSAPP_GREETING,
    name: "Имя",
    phone: "Телефон",
    who: "Кто",
    city: "Город",
    topic: "Тема",
    source: "Источник",
  },
  seo: {
    orgDescription:
      "Банкротство граждан, ИП и компаний по закону РК и юридические услуги в Алматы.",
  },
};
