import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "./monitor.js";

const kv = () => {
  const m = new Map();
  return { get: async (k) => m.get(k) ?? null, put: async (k, v) => void m.set(k, v) };
};
const ok = () => new Response("<title>JANA START</title>", { status: 200 });
// Сайт и Worker заявок: down — сайт отвечает 503; Telegram — всегда 200.
const site = (down) =>
  vi.fn(async (url, init) => {
    if (String(url).startsWith("https://api.telegram.org")) return new Response("{}");
    if (init?.method === "OPTIONS") return new Response(null, { status: 204 });
    return down ? new Response("", { status: 503 }) : ok();
  });
const sent = (f) =>
  f.mock.calls
    .filter(([u]) => String(u).startsWith("https://api.telegram.org"))
    .map(([, i]) => JSON.parse(i.body).text);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("worker/monitor", () => {
  it("всё в порядке — Telegram молчит", async () => {
    const f = site(false);
    vi.stubGlobal("fetch", f);
    await worker.scheduled({}, { STATE: kv() });
    expect(sent(f)).toEqual([]);
  });

  it("одиночный сбой не будит, второй подряд — одно сообщение, восстановление — второе", async () => {
    const env = { STATE: kv(), TELEGRAM_CHAT_ID: "1" };
    let f = site(true);
    vi.stubGlobal("fetch", f);
    await worker.scheduled({}, env);
    expect(sent(f)).toEqual([]);
    await worker.scheduled({}, env);
    expect(sent(f)).toHaveLength(1);
    expect(sent(f)[0]).toMatch(/^⚠️ Сайт не отвечает\n.*Главная.*ответ 503/s);
    expect(sent(f)[0]).not.toContain("Worker заявок");
    await worker.scheduled({}, env);
    expect(sent(f)).toHaveLength(1);
    f = site(false);
    vi.stubGlobal("fetch", f);
    await worker.scheduled({}, env);
    expect(sent(f)).toHaveLength(1);
    expect(sent(f)[0]).toMatch(/^✅ Снова работает\n.*Главная/s);
  });

  it("FORCE_FAIL=1 — тестовое отключение даёт уведомление со второй проверки", async () => {
    const env = { STATE: kv(), FORCE_FAIL: "1" };
    const f = site(false);
    vi.stubGlobal("fetch", f);
    await worker.scheduled({}, env);
    await worker.scheduled({}, env);
    expect(sent(f)).toHaveLength(1);
    expect(sent(f)[0]).toContain("FORCE_FAIL");
  });

  it("страница без «JANA START» считается сбоем", async () => {
    const env = { STATE: kv() };
    const f = vi.fn(async (url, init) =>
      String(url).startsWith("https://api.telegram.org")
        ? new Response("{}")
        : init?.method === "OPTIONS"
          ? new Response(null, { status: 204 })
          : new Response("Site not found", { status: 200 }),
    );
    vi.stubGlobal("fetch", f);
    await worker.scheduled({}, env);
    await worker.scheduled({}, env);
    expect(sent(f)[0]).toContain("страница без содержимого");
  });

  describe("нажатия WhatsApp и проверка в 19:00", () => {
    const click = (origin = "https://janastart.kz") =>
      worker.fetch(
        new Request("https://janastart-monitor.example/click", {
          method: "POST",
          headers: { Origin: origin },
        }),
        env,
      );
    const evening = () => worker.scheduled({ cron: "0 14 * * 1-5" }, env);
    let env;
    let f;
    const setup = () => {
      env = { STATE: kv() };
      f = site(false);
      vi.stubGlobal("fetch", f);
      vi.useFakeTimers();
    };

    it("чужой Origin — 403, клик не засчитан", async () => {
      setup();
      vi.setSystemTime(new Date("2026-10-29T06:00:00Z"));
      expect((await click("https://evil.example")).status).toBe(403);
      vi.setSystemTime(new Date("2026-10-29T14:00:00Z"));
      await evening();
      expect(sent(f)).toHaveLength(1);
      expect(sent(f)[0]).toContain("ни одного нажатия WhatsApp");
    });

    it("клик после 9:00 по Алматы — вечером тишина", async () => {
      setup();
      vi.setSystemTime(new Date("2026-10-29T04:30:00Z")); // 9:30 Алматы
      expect((await click()).status).toBe(204);
      vi.setSystemTime(new Date("2026-10-29T14:00:00Z"));
      await evening();
      expect(sent(f)).toEqual([]);
    });

    it("вчерашний клик не спасает сегодня; повторные клики за день не пишут в KV", async () => {
      setup();
      const put = vi.spyOn(env.STATE, "put");
      vi.setSystemTime(new Date("2026-10-28T10:00:00Z"));
      await click();
      await click();
      expect(put).toHaveBeenCalledTimes(1);
      vi.setSystemTime(new Date("2026-10-29T14:00:00Z"));
      await evening();
      expect(sent(f)).toHaveLength(1);
    });

    it("прочие адреса — 404", async () => {
      setup();
      const res = await worker.fetch(new Request("https://janastart-monitor.example/"), env);
      expect(res.status).toBe(404);
    });
  });
});
