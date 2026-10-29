// Мониторинг доступности janastart.kz → Telegram (этап 3 ТЗ, задача 4).
// Отдельный Cloudflare Worker без зависимостей: код целиком вставляется в редактор Cloudflare.
// Триггер Cron (Settings → Triggers): */5 * * * * — проверка раз в 5 минут.
// Сбой подтверждается двумя проверками подряд: уведомление приходит не позже чем через 10 минут,
// одиночный сбой сети не будит. Когда сайт снова отвечает — второе сообщение.
//
// Секреты и переменные (Settings → Variables and Secrets):
//   TELEGRAM_TOKEN    — секрет, токен того же бота, что у worker/lead.js;
//   TELEGRAM_CHAT_ID  — ID чата, где владелец и Наиль (бот должен быть в чате);
//   FORCE_FAIL        — необязательно: «1» на время тестового отключения, все проверки «падают».
// Привязка KV (Settings → Bindings) с именем STATE — помнит число сбоев подряд; можно та же
// база, что RATE у worker/lead.js. Без привязки уведомление уходит на каждый сбой.

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

export default {
  async scheduled(_event, env) {
    return runChecks(env);
  },
};

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
  if (env.STATE) await env.STATE.put(KEY, JSON.stringify(next));
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
