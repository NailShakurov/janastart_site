// Общий запуск страницы в браузере: гидрация пре-рендеренного HTML или рендер с нуля.
import { StrictMode, type ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles.css";
import { captureUtm } from "./tracking";

export function mount(page: ReactNode) {
  captureUtm();
  const root = document.getElementById("root")!;
  const app = <StrictMode>{page}</StrictMode>;
  // В проде HTML уже пре-рендерен при сборке — гидрируем; в dev рендерим с нуля.
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
