// Пре-рендер страниц при сборке (scripts/prerender.mjs).
import { StrictMode, type ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { Bankrotstvo } from "./pages/Bankrotstvo";
import { Politika } from "./pages/Politika";

/** Путь HTML-файла в dist → компонент страницы. */
export const PAGES: Record<string, ComponentType> = {
  "index.html": App,
  "bankrotstvo/index.html": Bankrotstvo,
  "politika/index.html": Politika,
};

export function render(page: string) {
  const Component = PAGES[page];
  if (!Component) throw new Error(`Неизвестная страница: ${page}`);
  return renderToString(
    <StrictMode>
      <Component />
    </StrictMode>,
  );
}
