import { describe, expect, it } from "vitest";
import { CONTENT_RU } from "./content";
import {
  buildFallbackText,
  buildLeadPayload,
  buildWhatsappText,
  formSubmitParams,
  toRuValue,
} from "./lead";
import { UI_RU } from "./ui-text";

const lead = {
  name: "Айгерим",
  phone: "+7 700 000-00-00",
  who: "ИП",
  city: "Астана",
  topic: "Долги и коллекторы",
};

describe("lead", () => {
  it("whatsapp-текст по-русски как раньше", () => {
    expect(buildWhatsappText(UI_RU.whatsapp, lead, "utm_source=google")).toBe(
      "Здравствуйте! Хочу получить бесплатную консультацию.\nИмя: Айгерим\nТелефон: +7 700 000-00-00\nКто: ИП\nГород: Астана\nТема: Долги и коллекторы\nИсточник: utm_source=google",
    );
    expect(buildWhatsappText(UI_RU.whatsapp, lead, "")).not.toContain("Источник");
  });
  it("запасной текст одной строкой", () => {
    expect(buildFallbackText(UI_RU.whatsapp, lead)).toBe(
      "Здравствуйте! Хочу получить бесплатную консультацию. Имя: Айгерим, телефон: +7 700 000-00-00, город: Астана, тема: Долги и коллекторы",
    );
  });
  it("тело запроса содержит lang", () => {
    expect(buildLeadPayload(lead, { page: "/kz/", source: "", website: "", lang: "kk" })).toEqual({
      name: "Айгерим",
      phone: "+7 700 000-00-00",
      who: "ИП",
      city: "Астана",
      topic: "Долги и коллекторы",
      page: "/kz/",
      source: "",
      website: "",
      lang: "kk",
    });
  });
  it("toRuValue: по индексу, иначе исходное", () => {
    expect(toRuValue(["а", "б", "в"], ["x", "y", "z"], "б")).toBe("y");
    expect(toRuValue(["а", "б"], ["x", "y"], "нет")).toBe("нет");
  });
  it("formSubmitParams для ru — те же значения", () => {
    expect(formSubmitParams(CONTENT_RU, CONTENT_RU, lead)).toEqual({
      client_type: "ИП",
      lead_topic: "Долги и коллекторы",
      lead_city: "Астана",
    });
  });
});
