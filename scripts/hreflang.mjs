// Теги hreflang для пар страниц ru ↔ kk (поля lang/alternate в реестре src/entry-server.tsx).
// x-default указывает на русскую страницу пары. Сборка падает, если пара не найдена или не взаимна.

/** @returns {string[]} три <link rel="alternate">, или [] у страницы без пары */
export function hreflangTags(page, pages, origin) {
  if (!page.alternate) return [];
  const other = pages.find((p) => p.path === page.alternate);
  if (!other)
    throw new Error(`hreflang: пара ${page.alternate} для ${page.path} не найдена в PAGES`);
  if (other.alternate !== page.path) {
    throw new Error(`hreflang: пара ${page.path} ↔ ${other.path} не взаимна`);
  }
  const ru = (page.lang ?? "ru") === "ru" ? page : other;
  const kk = ru === page ? other : page;
  const tag = (hreflang, p) =>
    `<link rel="alternate" hreflang="${hreflang}" href="${origin}${p.path}" />`;
  return [tag("ru", ru), tag("kk", kk), tag("x-default", ru)];
}
