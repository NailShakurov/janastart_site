// Вставляет HTML каждой страницы в dist/<page>, чтобы поисковики и мессенджеры
// видели контент без выполнения JS.
import { readFile, rm, writeFile } from "node:fs/promises";

const { PAGES, render } = await import("../dist-ssr/entry-server.js");

for (const page of Object.keys(PAGES)) {
  const file = new URL(`../dist/${page}`, import.meta.url);
  const template = await readFile(file, "utf8");
  if (!template.includes("<!--app-->")) throw new Error(`Маркер <!--app--> не найден в ${page}`);
  await writeFile(file, template.replace("<!--app-->", render(page)));
  console.log(`prerender: dist/${page} готов`);
}

await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
