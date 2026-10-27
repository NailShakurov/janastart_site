import { describe, expect, it } from "vitest";
import { CONTENT_RU, FAQ } from "./content";
import { SITE, WHATSAPP_GREETING } from "./site";
import { UI_RU } from "./ui-text";

describe("русские словари", () => {
  it("собраны из существующих констант", () => {
    expect(CONTENT_RU.faq).toBe(FAQ);
  });
  it("интерфейс ссылается на SITE", () => {
    expect(UI_RU.lang).toBe("ru");
    expect(UI_RU.site.address).toBe(SITE.address);
    expect(UI_RU.whatsapp.greeting).toBe(WHATSAPP_GREETING);
  });
});
