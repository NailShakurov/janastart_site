// Приём заявок с формы janastart.kz → Telegram (и письмо через Resend, если задан ключ).
// Cloudflare Worker без зависимостей: код целиком вставляется в редактор Cloudflare.
//
// Секреты и переменные (Settings → Variables and Secrets):
//   TELEGRAM_TOKEN    — секрет, токен бота от @BotFather;
//   TELEGRAM_CHAT_ID  — ID чата, куда бот пишет заявки (бот должен быть в чате);
//   RESEND_API_KEY    — секрет, необязательно: без него письмо не отправляется;
//   MAIL_TO           — адрес для писем (по умолчанию janastart02@gmail.com);
//   MAIL_FROM         — отправитель на подтверждённом в Resend домене, например «JANA START <zayavki@janastart.kz>».
// Привязка KV (Settings → Bindings) с именем RATE — ограничение 5 заявок с одного IP в час;
// без привязки ограничение не работает, остальное работает.

const ALLOWED_ORIGINS = ["https://janastart.kz", "https://www.janastart.kz"];
const LIMIT_PER_HOUR = 5;
const MAX_LEN = 200;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    const reply = (status, body) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
      });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { ok: false });
    if (!ALLOWED_ORIGINS.includes(origin)) return reply(403, { ok: false });

    let data;
    try {
      // Сайт шлёт text/plain, чтобы запрос был «простым» и не требовал preflight при keepalive.
      data = JSON.parse(await request.text());
    } catch {
      return reply(400, { ok: false });
    }
    const field = (key) =>
      String(data?.[key] ?? "")
        .trim()
        .slice(0, MAX_LEN);

    // Ловушка для ботов: поле скрыто от людей. Отвечаем «ок», чтобы бот не подбирал обход.
    if (field("website")) return reply(200, { ok: true });

    const lead = {
      name: field("name"),
      phone: field("phone"),
      who: field("who"),
      city: field("city"),
      topic: field("topic"),
      page: field("page"),
      source: field("source"),
      lang: field("lang"),
    };
    const digits = lead.phone.replace(/\D/g, "");
    if (!lead.name || digits.length < 10 || digits.length > 11) return reply(400, { ok: false });

    if (env.RATE) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const key = `${ip}:${Math.floor(Date.now() / 3_600_000)}`;
      const count = Number((await env.RATE.get(key)) || 0);
      if (count >= LIMIT_PER_HOUR) return reply(429, { ok: false });
      await env.RATE.put(key, String(count + 1), { expirationTtl: 3600 });
    }

    const text = [
      "Новая заявка с сайта",
      // Заявка с казахской страницы (/kz/…): её берёт казахоязычный юрист.
      lead.lang === "kk" && "Тіл: қазақша",
      `Имя: ${lead.name}`,
      `Телефон: ${lead.phone}`,
      lead.who && `Кто: ${lead.who}`,
      lead.city && `Город: ${lead.city}`,
      lead.topic && `Тема: ${lead.topic}`,
      lead.page && `Страница: ${lead.page}`,
      lead.source && `Источник: ${lead.source}`,
    ]
      .filter(Boolean)
      .join("\n");

    const jobs = [sendTelegram(env, text)];
    if (env.RESEND_API_KEY && env.MAIL_FROM) jobs.push(sendMail(env, lead, text));
    const results = await Promise.allSettled(jobs);
    for (const r of results) if (r.status === "rejected") console.error(r.reason);

    return results.some((r) => r.status === "fulfilled")
      ? reply(200, { ok: true })
      : reply(502, { ok: false });
  },
};

async function sendTelegram(env, text) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}

async function sendMail(env, lead, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [env.MAIL_TO || "janastart02@gmail.com"],
      subject: `Заявка: ${lead.name}, ${lead.city || "город не указан"}`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
