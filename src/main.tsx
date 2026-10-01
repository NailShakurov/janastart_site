import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// В проде HTML уже пре-рендерен при сборке — гидрируем; в dev рендерим с нуля.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
