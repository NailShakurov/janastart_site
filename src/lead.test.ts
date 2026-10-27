import { describe, expect, it } from "vitest";
import { buildLeadPayload, buildLeadText, isValidPhone } from "./lead";
import { UI_KK } from "./ui-text.kk";
import { UI_RU } from "./ui-text";

describe("lead", () => {
  it("текст для wa.me — только номер", () => {
    expect(buildLeadText(UI_RU.whatsapp, "+7 700 000-00-00")).toBe(
      "Новая заявка с сайта: +7 700 000-00-00",
    );
    expect(buildLeadText(UI_KK.whatsapp, "+7 700 000-00-00")).toBe(
      "Сайттан жаңа өтініш: +7 700 000-00-00",
    );
  });
  it("тело запроса — телефон, ловушка и язык", () => {
    expect(buildLeadPayload("+7 700 000-00-00", { website: "", lang: "kk" })).toEqual({
      phone: "+7 700 000-00-00",
      website: "",
      lang: "kk",
    });
  });
  it("проверка телефона", () => {
    expect(isValidPhone("+7 700 000-00-00")).toBe(true);
    expect(isValidPhone("8 700 000 00 00")).toBe(true);
    expect(isValidPhone("700 000")).toBe(false);
    expect(isValidPhone("+7 700 000-00-00-00")).toBe(false);
  });
});
