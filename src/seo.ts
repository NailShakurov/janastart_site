// Микроразметка schema.org (JSON-LD). Блоки вставляются в <head> при сборке
// (scripts/prerender.mjs) по описанию страниц в entry-server.tsx.
// Проверка: Rich Results Test и Schema Markup Validator.
import { CONTENT_RU, FAQ } from "./content";
import { SITE } from "./site";
import { UI_RU } from "./ui-text";

export const ORG_ID = `${SITE.origin}/#org`;

export type Crumb = { name: string; path: string };

/** LegalService — на всех страницах. description — на языке страницы, адрес всегда русский. */
export const legalServiceJsonLd = (description: string = UI_RU.seo.orgDescription) => ({
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": ORG_ID,
  name: SITE.brand,
  url: `${SITE.origin}/`,
  logo: `${SITE.origin}/logo-mark.png`,
  image: `${SITE.origin}/og-image.jpg`,
  description,
  telephone: SITE.phoneHref.replace("tel:", ""),
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    addressCountry: "KZ",
  },
  areaServed: { "@type": "Country", name: "Казахстан" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  priceRange: "₸₸",
  ...(SITE.sameAs.length > 0 ? { sameAs: SITE.sameAs } : {}),
});

/** FAQPage — только на страницах, где блок «Частые вопросы» виден; текст берётся из тех же данных, что и HTML. */
export const faqJsonLd = (items: readonly { q: string; a: string }[] = FAQ) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

/** BreadcrumbList — на внутренних страницах; те же крошки показываются на странице. */
export const breadcrumbJsonLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${SITE.origin}${c.path}`,
  })),
});

/**
 * Service — для страниц географии: услуга с зоной обслуживания и ссылкой на организацию.
 * area: { "@type": "Country" | "City" | "State", name } — для /onlain/ вся страна, для городских страниц город.
 */
export const serviceJsonLd = (opts: {
  name: string;
  description: string;
  url: string;
  area: { "@type": string; name: string };
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: opts.name,
  description: opts.description,
  url: `${SITE.origin}${opts.url}`,
  serviceType: "Юридические услуги",
  provider: { "@id": ORG_ID },
  areaServed: opts.area,
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE.origin}${opts.url}`,
    servicePhone: SITE.phoneHref.replace("tel:", ""),
  },
});

export const HOME_CRUMB: Crumb = { name: "Главная", path: "/" };
export const BANKRUPTCY_CRUMBS: Crumb[] = CONTENT_RU.bankruptcyCrumbs;
export const ONLAIN_CRUMBS: Crumb[] = [HOME_CRUMB, { name: "Юрист онлайн", path: "/onlain/" }];
export const POLICY_CRUMBS: Crumb[] = [
  HOME_CRUMB,
  { name: "Политика конфиденциальности", path: "/politika/" },
];
