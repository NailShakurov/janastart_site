// Все контакты, реквизиты и идентификаторы внешних сервисов — в одном месте.

export const SITE = {
  name: "JanaStart",
  // Отображаемое название бренда (юридическое — legalName)
  brand: "JANA START",
  tagline: "Банкротство · Казахстан",
  /** Адрес сайта без закрывающего слэша: canonical, sitemap, JSON-LD. */
  origin: "https://janastart.kz",
  city: "Алматы",
  phone: "+7 700 930-50-50",
  phoneHref: "tel:+77009305050",
  // Номер WhatsApp в международном формате без «+» и пробелов
  whatsapp: "77009305050",
  whatsappLabel: "+7 700 930-50-50",
  email: "janastart02@gmail.com",
  telegram: "janastart",
  address: "г. Алматы, ул. Ауэзова, 145 В, офис 103",
  /** Улица и офис без города — для PostalAddress.streetAddress. */
  street: "ул. Ауэзова, 145 В, офис 103",
  addressNote: "",
  hours: "пн–пт, 9:00–19:00",
  /** Строка о географии рядом с адресом в подвале. */
  onlineNote: "Консультируем онлайн из любого города Казахстана",
  legalName: "ИП JANA START",
  bin: "810518401012",
  foundedYear: 2026,
  /** Ссылки на профили компании (Instagram, 2ГИС, Google-карточка) — попадают в JSON-LD sameAs. */
  sameAs: [] as string[],
  /**
   * Google Tag Manager: ID контейнера вида GTM-XXXXXXX. Пустая строка — GTM не подключается.
   * Код вставляется в каждую страницу при сборке (scripts/prerender.mjs); GA4 и Google Ads
   * настраиваются внутри контейнера, прямой gtag.js на сайт не добавлять.
   */
  gtmId: "GTM-MVHPCXM3",
  /**
   * Приёмник заявок с формы (Cloudflare Worker из worker/lead.js): пересылает их в Telegram
   * и на почту. Пустая строка — заявка уходит только в WhatsApp, как раньше.
   */
  leadEndpoint: "https://janastart-lead.nshakurov.workers.dev",
  /** Код подтверждения Google Search Console (meta google-site-verification), если нет доступа к DNS. */
  googleSiteVerification: "",
} as const;

// Предзаполненное сообщение для кнопок «Написать в WhatsApp» (T-06)
export const WHATSAPP_GREETING = "Здравствуйте! Хочу получить бесплатную консультацию.";

export const whatsappLink = (text: string = WHATSAPP_GREETING) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
