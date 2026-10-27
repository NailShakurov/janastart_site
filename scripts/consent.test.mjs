import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import { CONSENT_KEY, CONSENT_POLICY, consentHead } from "./consent.mjs";

// Выполняет встроенный скрипт с заданным содержимым localStorage, возвращает команды consent.
function run(stored) {
  const ctx = {
    window: {},
    localStorage: { getItem: (k) => (k === CONSENT_KEY ? stored : null) },
    Date,
    JSON,
  };
  ctx.window = ctx;
  runInNewContext(consentHead().replace(/<\/?script>/g, ""), ctx);
  return ctx.dataLayer.map((a) => [a[1], a[2].ad_storage, a[2].analytics_storage]);
}
const saved = (choice, extra = {}) =>
  JSON.stringify({ choice, date: Date.now(), policy: CONSENT_POLICY, ...extra });

describe("consentHead", () => {
  it("без выбора — только denied", () => {
    expect(run(null)).toEqual([["default", "denied", "denied"]]);
  });
  it("сохранённое «Принять» восстанавливается", () => {
    expect(run(saved("granted"))).toEqual([
      ["default", "denied", "denied"],
      ["update", "granted", "granted"],
    ]);
  });
  it("«Отклонить», другая версия политики или истёкший срок — denied", () => {
    expect(run(saved("denied"))).toHaveLength(1);
    expect(run(saved("granted", { policy: "old" }))).toHaveLength(1);
    expect(run(saved("granted", { date: 0 }))).toHaveLength(1);
    expect(run("{битый")).toHaveLength(1);
  });
});
