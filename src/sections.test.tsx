import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LangProvider } from "./i18n";
import { Contact, Hero } from "./sections";
import { ContactBar } from "./ui";
import { UI_KK } from "./ui-text.kk";

/** Тексты всех ссылок wa.me в разметке, раскодированные. */
const waTexts = (html: string) =>
  [...html.matchAll(/href="https:\/\/wa\.me\/\d+\?text=([^"]+)"/g)].map((m) =>
    decodeURIComponent(m[1]!.replace(/&amp;/g, "&")),
  );

describe("ссылки WhatsApp на казахской странице", () => {
  it("все с казахским приветствием, без русского", () => {
    const html = renderToString(
      <LangProvider lang="kk" altHref="/">
        <Hero {...UI_KK.pages.home} />
        <Contact />
        <ContactBar />
      </LangProvider>,
    );
    const texts = waTexts(html);
    expect(texts.length).toBeGreaterThanOrEqual(3);
    for (const t of texts) {
      expect(t).toContain("Сәлеметсіз бе!");
      expect(t).not.toContain("Здравствуйте");
    }
  });
});
