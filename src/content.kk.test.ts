import { describe, expect, it } from "vitest";
import { CONTENT_KK } from "./content.kk";
import { UI_KK } from "./ui-text.kk";

describe("казахские словари", () => {
  it("ссылки ведут на казахские страницы, Онлайн в меню как у русских", () => {
    expect(CONTENT_KK.nav.map((i) => i.href)).toEqual([
      "/kz/bankrotstvo/",
      "#services",
      "/kz/onlain/",
      "#process",
      "#faq",
      "#contact",
    ]);
    expect(CONTENT_KK.bankruptcyNav.map((i) => i.href)).toEqual([
      "#bankruptcy",
      "#process",
      "/kz/onlain/",
      "#faq",
      "#contact",
    ]);
    for (const card of [...CONTENT_KK.procedures, ...CONTENT_KK.services]) {
      expect(card.href).toBe("/kz/bankrotstvo/");
    }
    expect(CONTENT_KK.bankruptcyCrumbs.map((c) => c.path)).toEqual(["/kz/", "/kz/bankrotstvo/"]);
  });
  it("интерфейс на казахском", () => {
    expect(UI_KK.lang).toBe("kk");
    expect(UI_KK.whatsapp.greeting).toBe("Сәлеметсіз бе! Қазақ тілінде тегін кеңес алғым келеді.");
    expect(UI_KK.site.legalName).toBe("ЖК JANA START");
    expect(CONTENT_KK.onlainHref).toBe("/kz/onlain/");
    expect(CONTENT_KK.policyHref).toBe("/kz/politika/");
    expect(UI_KK.pages.home.kzNote).toBeTruthy();
    expect(UI_KK.pages.bankrotstvo.kzNote).toBeTruthy();
    expect(UI_KK.contact.intro).toBeTruthy();
    expect(UI_KK.langNames).toEqual({ ru: "Рус", kk: "Қаз" });
  });
});
