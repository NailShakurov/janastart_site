// Реестр страниц для сборки: пре-рендер (scripts/prerender.mjs), JSON-LD в <head>, sitemap.xml.
// Новая страница: добавить HTML-файл в vite.config.ts (input) и запись сюда.
import { StrictMode, type ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { NotFound } from "./pages/NotFound";
import { Bankrotstvo } from "./pages/Bankrotstvo";
import { Politika } from "./pages/Politika";
import {
  BANKRUPTCY_CRUMBS,
  POLICY_CRUMBS,
  breadcrumbJsonLd,
  faqJsonLd,
  legalServiceJsonLd,
} from "./seo";
import { SITE } from "./site";

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
    lastmod: "2026-10-17",
    jsonLd: [legalServiceJsonLd(), faqJsonLd()],
  },
  {
    file: "bankrotstvo/index.html",
    path: "/bankrotstvo/",
    Component: Bankrotstvo,
    lastmod: "2026-10-17",
    jsonLd: [legalServiceJsonLd(), breadcrumbJsonLd(BANKRUPTCY_CRUMBS), faqJsonLd()],
  },
  {
    file: "politika/index.html",
    path: "/politika/",
    Component: Politika,
    noindex: true,
    jsonLd: [legalServiceJsonLd(), breadcrumbJsonLd(POLICY_CRUMBS)],
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
