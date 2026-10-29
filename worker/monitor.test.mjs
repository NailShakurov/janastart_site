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

afterEach(() => vi.unstubAllGlobals());

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
});
