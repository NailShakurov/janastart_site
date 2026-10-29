// Мониторинг доступности janastart.kz → Telegram (этап 3 ТЗ, задачи 4 и 5).
// Отдельный Cloudflare Worker без зависимостей: код целиком вставляется в редактор Cloudflare.
// Триггеры Cron (Settings → Triggers): */5 * * * * — проверка раз в 5 минут;
// 0 14 * * 1-5 — 19:00 по Алматы (UTC+5) пн–пт: если с 9:00 не было ни одного нажатия WhatsApp
// (сайт шлёт пустой POST /click без данных о человеке), — сообщение в Telegram.
// Сбой подтверждается двумя проверками подряд: уведомление приходит не позже чем через 10 минут,
// одиночный сбой сети не будит. Когда сайт снова отвечает — второе сообщение.
//
// Секреты и переменные (Settings → Variables and Secrets):
//   TELEGRAM_TOKEN    — секрет, токен того же бота, что у worker/lead.js;
//   TELEGRAM_CHAT_ID  — ID чата, где владелец и Наиль (бот должен быть в чате);
//   FORCE_FAIL        — необязательно: «1» на время тестового отключения, все проверки «падают».
// Привязка KV (Settings → Bindings) с именем STATE — помнит число сбоев подряд; можно та же
// база, что RATE у worker/lead.js. Без привязки уведомление уходит на каждый сбой, клики не считаются.

const CHECKS = [
  { name: "Главная https://janastart.kz/", url: "https://janastart.kz/", text: "JANA START" },
  {
    name: "Банкротство https://janastart.kz/bankrotstvo/",
    url: "https://janastart.kz/bankrotstvo/",
    text: "JANA START",
  },
  // OPTIONS — предзапрос формы: проверяет, что Worker заявок жив, и не шлёт заявку.
  {
    name: "Worker заявок",
    url: "https://janastart-lead.nshakurov.workers.dev",
    method: "OPTIONS",
    status: 204,
  },
];
const CONFIRM = 2;
const TIMEOUT_MS = 15_000;
const KEY = "monitor";
const CLICK_KEY = "wa_click";
const CLICK_CRON = "0 14 * * 1-5";
const ALLOWED_ORIGINS = ["https://janastart.kz", "https://www.janastart.kz"];

export default {
  async scheduled(event, env) {
    return event.cron === CLICK_CRON ? checkClicks(env) : runChecks(env);
  },

  /** POST /click — нажатие WhatsApp на сайте. Хранится только время, без IP и данных человека. */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/click")
      return new Response(null, { status: 404 });
    if (!ALLOWED_ORIGINS.includes(request.headers.get("Origin") || "")) {
      return new Response(null, { status: 403 });
    }
    if (env.STATE) {
      // Одна запись в день: лимит записей KV на бесплатном тарифе — 1000 в сутки.
      const last = Number((await env.STATE.get(CLICK_KEY)) || 0);
      if (last < workdayStart(Date.now())) await env.STATE.put(CLICK_KEY, String(Date.now()));
    }
    return new Response(null, { status: 204 });
  },
};

/** Начало рабочего дня — 9:00 по Алматы (04:00 UTC) текущих суток UTC. */
function workdayStart(ts) {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 4);
}

/** 19:00 пн–пт: ни одного нажатия WhatsApp с 9:00 — сообщение в Telegram. */
async function checkClicks(env) {
  if (!env.STATE) return;
  const last = Number((await env.STATE.get(CLICK_KEY)) || 0);
  if (last >= workdayStart(Date.now())) return;
  await sendTelegram(
    env,
    `⚠️ Сегодня с 9:00 до 19:00 ни одного нажатия WhatsApp на janastart.kz.\n` +
      `Проверьте сайт с телефона: кнопки WhatsApp, баннер cookie, форма.\n${now()}`,
  );
}

/** Проверяет все адреса, шлёт в Telegram «упал» и «снова работает». Возвращает ошибки по имени. */
async function runChecks(env) {
  const results = await Promise.all(CHECKS.map((c) => check(c, env)));
  const prev = env.STATE ? JSON.parse((await env.STATE.get(KEY)) || "{}") : {};
  const next = {};
  const down = [];
  const up = [];
  CHECKS.forEach((c, i) => {
    const error = results[i];
    const before = prev[c.name] || 0;
    next[c.name] = error ? before + 1 : 0;
    if (error && (next[c.name] === CONFIRM || !env.STATE)) down.push(`${c.name}: ${error}`);
    if (!error && before >= CONFIRM) up.push(c.name);
  });
  // Пишем только при изменении: 288 проверок в сутки не тратят лимит записей KV.
  if (env.STATE && JSON.stringify(next) !== JSON.stringify(prev)) {
    await env.STATE.put(KEY, JSON.stringify(next));
  }
  if (down.length) await sendTelegram(env, `⚠️ Сайт не отвечает\n${down.join("\n")}\n${now()}`);
  if (up.length) await sendTelegram(env, `✅ Снова работает\n${up.join("\n")}\n${now()}`);
  return Object.fromEntries(CHECKS.map((c, i) => [c.name, results[i]]));
}

/** null — адрес в порядке, иначе короткое описание сбоя. */
async function check(c, env) {
  if (env.FORCE_FAIL === "1") return "тестовое отключение (FORCE_FAIL)";
  try {
    // Метка в адресе — мимо кэша Cloudflare, чтобы видеть сам GitHub Pages.
    const url = c.method ? c.url : `${c.url}?monitor=${Date.now()}`;
    const res = await fetch(url, {
      method: c.method || "GET",
      headers: { Origin: "https://janastart.kz" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status !== (c.status || 200)) return `ответ ${res.status}`;
    if (c.text && !(await res.text()).includes(c.text)) return "страница без содержимого";
    return null;
  } catch (err) {
    return err.name === "TimeoutError" ? `нет ответа за ${TIMEOUT_MS / 1000} с` : "ошибка сети";
  }
}

function now() {
  return new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    dateStyle: "short",
    timeStyle: "short",
  });
}

async function sendTelegram(env, text) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}`);
}
