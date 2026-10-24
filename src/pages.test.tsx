import { describe, expect, it } from "vitest";
import { PAGES, render } from "./entry-server";

/** Внутренние ссылки страницы: href="/..." без файлов (иконки, картинки). */
const internalLinks = (html: string) =>
  [...html.matchAll(/<a [^>]*href="(\/[^"]*)"/g)].map((m) => m[1]!);

describe("ссылки казахских страниц", () => {
  const paths = new Set(PAGES.map((p) => p.path));
  for (const page of PAGES.filter((p) => p.lang === "kk")) {
    it(`${page.path}: только на /kz/, кроме переключателя языка`, () => {
      const links = internalLinks(render(page)).filter((href) => href !== page.alternate);
      expect(links.length).toBeGreaterThan(0);
      for (const href of links) {
        expect(href.startsWith("/kz/"), href).toBe(true);
        expect(paths.has(href.split("#")[0]!), href).toBe(true);
      }
    });
  }
});
