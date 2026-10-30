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
  /** Под кнопками первого экрана: noticeBefore [noticeLink → политика] noticeAfter (согласие по ответу юриста 30.10.2026). */
  hero: {
    consult: string;
    whatsapp: string;
    noticeBefore: string;
    noticeLink: string;
    noticeAfter: string;
  };
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
  /** Галочка согласия: consentBefore [consentLink] consentMiddle [policyLink] consentAfter. */
  form: {
    phone: string;
    consentBefore: string;
    consentLink: string;
    consentMiddle: string;
    policyLink: string;
    consentAfter: string;
    error: string;
    submit: string;
    orCall: string;
  };
  /** Полный текст согласия, раскрывается по ссылке из галочки. */
  consentDoc: { title: string; items: readonly string[] };
  /** sendError — копия заявки в Telegram не ушла; после него показывается номер WhatsApp. */
  done: { title: string; text: string; link: string; orCall: string; sendError: string };
  footer: { rights: string; info: string; policy: string; cookieSettings: string };
  bar: { call: string; whatsapp: string };
  /** greeting — для ссылок «Написать в WhatsApp», leadPrefix — для заявки из формы. */
  whatsapp: { greeting: string; leadPrefix: string };
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
  hero: {
    consult: "Бесплатная консультация",
    whatsapp: "Написать в WhatsApp",
    noticeBefore:
      "Переходя по ссылкам на сайте, вы соглашаетесь на обработку персональных данных в соответствии с ",
    noticeLink: "Политикой конфиденциальности",
    noticeAfter: ".",
  },
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
  // Тексты согласия (form.consent*, consentDoc) утверждены юристом 27.10.2026 (ТЗ ретаргетинга,
  // приложение А и Б, плюс Cloudflare в п. 3–4). Править только по согласованию.
  form: {
    phone: "Телефон",
    consentBefore:
      "Я даю согласие ИП JANA START на обработку моего номера телефона для связи по моей заявке и на его трансграничную передачу через WhatsApp и Telegram на условиях ",
    consentLink: "Согласия",
    consentMiddle: " и ",
    policyLink: "Политики конфиденциальности",
    consentAfter: ".",
    error: "Укажите телефон и подтвердите согласие.",
    submit: "Получить консультацию в WhatsApp",
    orCall: "Или позвоните:",
  },
  consentDoc: {
    title: "Согласие на обработку персональных данных",
    items: [
      "Отправляя форму на сайте janastart.kz и отмечая галочку, я даю согласие ИП JANA START, ИИН 810518401012, адрес: г. Алматы, ул. Ауэзова, 145 В, офис 103 (далее — Оператор), на сбор и обработку моих персональных данных на следующих условиях:",
      "1. Перечень данных: номер телефона; дата и время заявки; язык страницы.",
      "2. Цель: связаться со мной по моей заявке и проконсультировать по моему обращению.",
      "3. Передача третьим лицам: номер передаётся сотрудникам Оператора через мессенджеры WhatsApp (Meta Platforms, Inc.) и Telegram, а также через сервер Cloudflare, Inc. (США), который пересылает заявку и её не хранит; иным третьим лицам не передаётся, кроме случаев, предусмотренных законом.",
      "4. Трансграничная передача: осуществляется — серверы WhatsApp, Telegram и Cloudflare находятся за пределами Республики Казахстан.",
      "5. Распространение в общедоступных источниках: не осуществляется.",
      "6. Срок действия: до достижения цели, но не более 90 дней с момента получения заявки, если между мной и Оператором не заключён договор. При заключении договора данные обрабатываются на условиях договора.",
      "7. Отзыв: я могу отозвать согласие, написав на janastart02@gmail.com или в WhatsApp +7 700 930-50-50. Оператор прекращает обработку в течение пятнадцати рабочих дней.",
    ],
  },
  done: {
    title: "Почти готово",
    text: "Мы открыли WhatsApp с готовым сообщением — просто нажмите «Отправить». Если окно не открылось, ",
    link: "нажмите здесь",
    orCall: "или позвоните:",
    sendError: "Заявку не удалось отправить. Напишите нам в WhatsApp:",
  },
  footer: {
    rights: "Все права защищены.",
    info: "Сайт носит информационный характер и не является публичной офертой.",
    policy: "Политика конфиденциальности",
    cookieSettings: "Настройки cookie",
  },
  bar: { call: "Позвонить", whatsapp: "WhatsApp" },
  whatsapp: { greeting: WHATSAPP_GREETING, leadPrefix: "Новая заявка с сайта:" },
  seo: {
    orgDescription:
      "Банкротство граждан, ИП и компаний по закону РК и юридические услуги в Алматы.",
  },
};
