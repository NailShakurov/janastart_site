// Вставляет HTML страницы в dist/index.html, чтобы поисковики и мессенджеры
// видели контент без выполнения JS.
import { readFile, rm, writeFile } from "node:fs/promises";

const { render } = await import("../dist-ssr/entry-server.js");
const file = new URL("../dist/index.html", import.meta.url);
const template = await readFile(file, "utf8");
if (!template.includes("<!--app-->")) throw new Error("Маркер <!--app--> не найден в index.html");
await writeFile(file, template.replace("<!--app-->", render()));
await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log("prerender: dist/index.html готов");
