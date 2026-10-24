// Реестр страниц для сборки: пре-рендер (scripts/prerender.mjs), JSON-LD в <head>, sitemap.xml.
// Новая страница: добавить HTML-файл в vite.config.ts (input) и запись сюда.
import { StrictMode, type ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { NotFound } from "./pages/NotFound";
import { Bankrotstvo } from "./pages/Bankrotstvo";
import { Onlain } from "./pages/Onlain";
import { Politika } from "./pages/Politika";
import { POLICY_KK } from "./pages/politika.kk";
import { CONTENT_KK, KZ_ONLAIN_HREF } from "./content.kk";
import { ONLAIN, ONLAIN_FAQ } from "./content-onlain";
import { ONLAIN_KK } from "./content-onlain.kk";
import type { Lang } from "./i18n";
import {
  BANKRUPTCY_CRUMBS,
  ONLAIN_CRUMBS,
  POLICY_CRUMBS,
  breadcrumbJsonLd,
  faqJsonLd,
  legalServiceJsonLd,
  serviceJsonLd,
} from "./seo";
import { SITE } from "./site";
import { UI_KK } from "./ui-text.kk";

export type PageDef = {
  /** Путь HTML-файла в dist (и в корне проекта). */
  file: string;
  /** URL страницы на сайте. */
  path: string;
  Component: ComponentType;
  /**
   * Дата последнего изменения текста страницы (sitemap lastmod, ГГГГ-ММ-ДД).
   * Обновлять вручную при правке контента; это не дата сборки.
   */
  lastmod?: string;
  /** Язык страницы; по умолчанию русский. */
  lang?: Lang;
  /** Путь той же страницы на другом языке: пре-рендер ставит hreflang в обе стороны. */
  alternate?: string;
  /** Страница закрыта от индексации: в sitemap не попадает. */
  noindex?: boolean;
  /** Блоки JSON-LD, вставляются в <head>. */
  jsonLd?: object[];
};

export const PAGES: PageDef[] = [
  {
    file: "index.html",
    path: "/",
    Component: App,
    alternate: "/kz/",
    lastmod: "2026-10-17",
    jsonLd: [legalServiceJsonLd(), faqJsonLd()],
  },
  {
    file: "bankrotstvo/index.html",
    path: "/bankrotstvo/",
    Component: Bankrotstvo,
    alternate: "/kz/bankrotstvo/",
    lastmod: "2026-10-17",
    jsonLd: [legalServiceJsonLd(), breadcrumbJsonLd(BANKRUPTCY_CRUMBS), faqJsonLd()],
  },
  {
    file: "kz/index.html",
    path: "/kz/",
    lang: "kk",
    alternate: "/",
    Component: () => <App lang="kk" />,
    lastmod: "2026-10-21",
    jsonLd: [legalServiceJsonLd(UI_KK.seo.orgDescription), faqJsonLd(CONTENT_KK.faq)],
  },
  {
    file: "kz/bankrotstvo/index.html",
    path: "/kz/bankrotstvo/",
    lang: "kk",
    alternate: "/bankrotstvo/",
    Component: () => <Bankrotstvo lang="kk" />,
    lastmod: "2026-10-21",
    jsonLd: [
      legalServiceJsonLd(UI_KK.seo.orgDescription),
      breadcrumbJsonLd(CONTENT_KK.bankruptcyCrumbs),
      faqJsonLd(CONTENT_KK.faq),
    ],
  },
  {
    file: "onlain/index.html",
    path: "/onlain/",
    Component: Onlain,
    alternate: KZ_ONLAIN_HREF,
    lastmod: "2026-10-17",
    jsonLd: [
      legalServiceJsonLd(),
      breadcrumbJsonLd(ONLAIN_CRUMBS),
      serviceJsonLd({
        name: "Юрист онлайн по всему Казахстану",
        description: ONLAIN.lead,
        url: "/onlain/",
        area: { "@type": "Country", name: "Казахстан" },
      }),
      faqJsonLd(ONLAIN_FAQ),
    ],
  },
  {
    file: "politika/index.html",
    path: "/politika/",
    Component: Politika,
    alternate: CONTENT_KK.policyHref,
    noindex: true,
    jsonLd: [legalServiceJsonLd(), breadcrumbJsonLd(POLICY_CRUMBS)],
  },
  {
    file: "kz/onlain/index.html",
    path: KZ_ONLAIN_HREF,
    lang: "kk",
    alternate: "/onlain/",
    Component: () => <Onlain lang="kk" />,
    lastmod: "2026-10-24",
    jsonLd: [
      legalServiceJsonLd(UI_KK.seo.orgDescription),
      breadcrumbJsonLd(ONLAIN_KK.crumbs),
      serviceJsonLd({
        name: ONLAIN_KK.serviceName,
        description: ONLAIN_KK.page.lead,
        url: KZ_ONLAIN_HREF,
        area: { "@type": "Country", name: ONLAIN_KK.country },
      }),
      faqJsonLd(ONLAIN_KK.faq),
    ],
  },
  {
    file: "kz/politika/index.html",
    path: CONTENT_KK.policyHref,
    lang: "kk",
    alternate: "/politika/",
    Component: () => <Politika lang="kk" />,
    noindex: true,
    jsonLd: [legalServiceJsonLd(UI_KK.seo.orgDescription), breadcrumbJsonLd(POLICY_KK.crumbs)],
  },
  {
    file: "404.html",
    path: "/404.html",
    Component: NotFound,
    noindex: true,
    jsonLd: [legalServiceJsonLd()],
  },
];

export { SITE };

export function render(page: PageDef) {
  return renderToString(
    <StrictMode>
      <page.Component />
    </StrictMode>,
  );
}
