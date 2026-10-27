import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "./lead.js";

const env = { TELEGRAM_TOKEN: "t", TELEGRAM_CHAT_ID: "1" };
const post = (body) =>
  new Request("https://lead.example/", {
    method: "POST",
    headers: { Origin: "https://janastart.kz" },
    body: JSON.stringify(body),
  });

afterEach(() => vi.unstubAllGlobals());

describe("worker/lead", () => {
  it("в Telegram уходят только номер, язык и время", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const res = await worker.fetch(
      post({ phone: "+7 700 000-00-00", lang: "kk", name: "лишнее", topic: "лишнее" }),
      env,
    );
    expect(res.status).toBe(200);
    const { text } = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(text).toMatch(/^Новая заявка с сайта: \+7 700 000-00-00\nЯзык: kk\nВремя: .+$/);
    expect(text).not.toContain("лишнее");
  });

  it("без телефона — 400, Telegram не вызывается", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await worker.fetch(post({ phone: "123", lang: "ru" }), env);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ошибка Telegram — 502, номер не попадает в лог", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad", { status: 500 })));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await worker.fetch(post({ phone: "+7 700 000-00-00", lang: "ru" }), env);
    expect(res.status).toBe(502);
    expect(JSON.stringify(log.mock.calls)).not.toContain("700");
    log.mockRestore();
  });
});
