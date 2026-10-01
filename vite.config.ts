import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// base "./" — относительные пути: сайт работает и на janastart.kz,
// и на <user>.github.io/janastart_site/ до подключения домена.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
