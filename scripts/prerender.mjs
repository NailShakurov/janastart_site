// Пост-обработка сборки (после vite build):
//  1) вставляет HTML каждой страницы в dist/<page>, чтобы поисковики и мессенджеры
//     видели контент без выполнения JS;
//  2) добавляет в <head> JSON-LD, согласие Consent Mode (scripts/consent.mjs), Google Tag Manager
//     и код подтверждения Search Console;
//  3) встраивает CSS в <style>, чтобы первая отрисовка не ждала отдельного запроса
//     (на медленном мобильном интернете это лишний круг до сервера);
//  4) ставит hreflang для пар страниц ru ↔ kk (scripts/hreflang.mjs);
//  5) генерирует dist/sitemap.xml из реестра страниц (только индексируемые, с lastmod).
import { readFile, rm, writeFile } from "node:fs/promises";
import { consentHead } from "./consent.mjs";
import { hreflangTags } from "./hreflang.mjs";

const { PAGES, SITE, render } = await import("../dist-ssr/entry-server.js");

const dist = (p) => new URL(`../dist/${p}`, import.meta.url);

// Внутри <script> последовательность "</" недопустима — экранируем.
const jsonLdTag = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/<\//g, "<\\/")}</script>`;

const gtmHead = (id) =>
  `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');</script>
<!-- End Google Tag Manager -->`;

const gtmBody = (id) =>
  `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

function insertAfter(html, marker, snippet, page) {
  const i = html.indexOf(marker);
  if (i < 0) throw new Error(`Маркер «${marker}» не найден в ${page}`);
  const end = i + marker.length;
  return `${html.slice(0, end)}\n${snippet}${html.slice(end)}`;
}

// <link rel="stylesheet" href="/assets/….css"> → <style>…</style>. Файл стилей один на весь
// сайт и небольшой; JS на него не ссылается, так что повторно он не загрузится.
async function inlineCss(html, page) {
  const re = /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/g;
  const links = [...html.matchAll(re)];
  if (!links.length) throw new Error(`Не найден <link rel="stylesheet"> в ${page}`);
  for (const [tag, file] of links) {
    const css = (await readFile(dist(file), "utf8")).replace(/<\/style/gi, "<\\/style");
    html = html.replace(tag, () => `<style>${css}</style>`);
  }
  return html;
}

function insertBefore(html, marker, snippet, page) {
  const i = html.indexOf(marker);
  if (i < 0) throw new Error(`Маркер «${marker}» не найден в ${page}`);
  return `${html.slice(0, i)}${snippet}\n${html.slice(i)}`;
}

for (const page of PAGES) {
  let html = await readFile(dist(page.file), "utf8");
  if (!html.includes("<!--app-->")) throw new Error(`Маркер <!--app--> не найден в ${page.file}`);
  html = html.replace("<!--app-->", render(page));
  html = await inlineCss(html, page.file);

  // GTM — как можно выше в <head>, сразу после кодировки; перед ним — согласие по умолчанию.
  if (SITE.gtmId) {
    html = insertAfter(
      html,
      '<meta charset="UTF-8" />',
      `${consentHead()}\n${gtmHead(SITE.gtmId)}`,
      page.file,
    );
    html = insertAfter(html, "<body>", gtmBody(SITE.gtmId), page.file);
  }

  const head = [...hreflangTags(page, PAGES, SITE.origin)];
  if (SITE.googleSiteVerification) {
    head.push(`<meta name="google-site-verification" content="${SITE.googleSiteVerification}" />`);
  }
  for (const block of page.jsonLd ?? []) head.push(jsonLdTag(block));
  if (head.length)
    html = insertBefore(html, "</head>", head.map((l) => `    ${l}`).join("\n"), page.file);

  await writeFile(dist(page.file), html);
  console.log(`prerender: dist/${page.file} готов`);
}

// sitemap.xml: только индексируемые страницы, lastmod — дата изменения контента из реестра.
const urls = PAGES.filter((p) => !p.noindex).map((p) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.lastmod ?? "")) {
    throw new Error(`Укажите lastmod (ГГГГ-ММ-ДД) для страницы ${p.path} в src/entry-server.tsx`);
  }
  return `  <url><loc>${SITE.origin}${p.path}</loc><lastmod>${p.lastmod}</lastmod></url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
await writeFile(dist("sitemap.xml"), sitemap);
console.log(`sitemap: ${urls.length} URL`);

await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
