import { describe, expect, it } from "vitest";
import { hreflangTags } from "./hreflang.mjs";

const O = "https://janastart.kz";
const ru = { path: "/", lang: "ru", alternate: "/kz/" };
const kk = { path: "/kz/", lang: "kk", alternate: "/" };

describe("hreflangTags", () => {
  it("три тега, x-default на русскую", () => {
    expect(hreflangTags(ru, [ru, kk], O)).toEqual([
      `<link rel="alternate" hreflang="ru" href="${O}/" />`,
      `<link rel="alternate" hreflang="kk" href="${O}/kz/" />`,
      `<link rel="alternate" hreflang="x-default" href="${O}/" />`,
    ]);
    expect(hreflangTags(kk, [ru, kk], O)).toEqual(hreflangTags(ru, [ru, kk], O));
  });
  it("без пары — пусто", () => {
    expect(hreflangTags({ path: "/onlain/" }, [ru, kk], O)).toEqual([]);
  });
  it("пары нет в реестре — ошибка", () => {
    expect(() => hreflangTags(ru, [ru], O)).toThrow(/\/kz\//);
  });
  it("пара не взаимна — ошибка", () => {
    expect(() => hreflangTags(ru, [ru, { ...kk, alternate: "/bankrotstvo/" }], O)).toThrow(
      /взаимн/,
    );
  });
});
