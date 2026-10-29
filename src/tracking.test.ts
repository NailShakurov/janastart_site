import { afterEach, describe, expect, it, vi } from "vitest";
import { countClick } from "./tracking";

afterEach(() => vi.unstubAllGlobals());

describe("countClick", () => {
  const beacon = (impl?: () => boolean) => {
    const sendBeacon = vi.fn(impl ?? (() => true));
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", { sendBeacon });
    return sendBeacon;
  };

  it("шлёт пустой beacon на адрес счётчика", () => {
    const sendBeacon = beacon();
    countClick("https://monitor.example/click");
    expect(sendBeacon).toHaveBeenCalledWith("https://monitor.example/click");
  });

  it("пустой адрес — ничего не шлёт", () => {
    const sendBeacon = beacon();
    countClick("");
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("ошибка sendBeacon не выходит наружу", () => {
    beacon(() => {
      throw new Error("blocked");
    });
    expect(() => countClick("https://monitor.example/click")).not.toThrow();
  });
});
