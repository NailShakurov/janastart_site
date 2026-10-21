import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const page = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Несколько страниц: каждая — свой HTML в корне проекта (см. src/entry-server.tsx).
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: page("index.html"),
        bankrotstvo: page("bankrotstvo/index.html"),
        onlain: page("onlain/index.html"),
        politika: page("politika/index.html"),
        notfound: page("404.html"),
        kz: page("kz/index.html"),
        kzBankrotstvo: page("kz/bankrotstvo/index.html"),
      },
    },
  },
});
