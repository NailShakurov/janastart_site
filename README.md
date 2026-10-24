# JanaStart

Лендинг стартапа JanaStart — банкротство физических и юридических лиц в Казахстане.
Домен: https://janastart.kz

Стек: Vite + React + Tailwind CSS. При сборке страница пре-рендерится в статический HTML
и автоматически публикуется на GitHub Pages (`.github/workflows/deploy.yml`) при каждом push в `main`.

## Где что править

- **Контакты, телефон, WhatsApp, адрес, реквизиты** — `src/site.ts`.
- **Тексты, услуги, этапы, FAQ** — `src/content.ts`; подписи, кнопки, форма, подвал — `src/ui-text.ts`;
  блоки страниц — `src/sections.tsx`; шапка и подвал — `src/ui.tsx`. Разметка сама текста не содержит: всё берётся
  из словарей через контекст языка (`src/i18n.tsx`).
- **Казахская версия** — страницы `/kz/` (`kz/index.html`) и `/kz/bankrotstvo/` (`kz/bankrotstvo/index.html`), те же
  компоненты с `lang="kk"`. Тексты — `src/content.kk.ts` и `src/ui-text.kk.ts`, той же формы, что русские: пропущенный
  ключ не даст собрать сайт, но устаревший перевод компилятор не заметит — при правке русского текста правьте и
  казахский. Переключатель «Рус | Қаз» в шапке ведёт на парную страницу (`alternate` в `src/entry-server.tsx`), у страниц
  без пары (`/onlain/`, `/politika/`, 404) — на `/kz/`; пре-рендер ставит hreflang в обе стороны и падает, если пара
  не взаимна. Реквизиты по-казахски (`site` в `src/ui-text.kk.ts`) проверяет юрист-казах; в JSON-LD адрес всегда
  русский. Новая страница на казахском: HTML-шаблон в `kz/…` с `lang="kk"` и `og:locale` `kk_KZ`, точка входа
  `src/kz-….tsx`, запись в `vite.config.ts` и в `PAGES` с `lang: "kk"` и `alternate` у обеих страниц пары.
- **Страницы:** главная `index.html` + `src/App.tsx`; хаб банкротства `bankrotstvo/index.html` + `src/pages/Bankrotstvo.tsx`;
  юрист онлайн по Казахстану `onlain/index.html` + `src/pages/Onlain.tsx` (тексты в `src/content-onlain.ts`, согласованы с юристом);
  политика конфиденциальности `politika/index.html` + `src/pages/Politika.tsx`; страница ошибки `404.html` + `src/pages/NotFound.tsx`.
  Новая страница добавляется в `vite.config.ts` (input) и в реестр `src/entry-server.tsx` (PAGES): путь, компонент,
  `lastmod`, блоки JSON-LD.
- **Цвета и шрифты** — `src/styles.css`; title, description и og:* каждой страницы — в её HTML-файле.
- **Микроразметка JSON-LD** (LegalService, FAQPage, BreadcrumbList) — `src/seo.ts`; FAQPage собирается из тех же
  данных `FAQ`, что и видимый блок, поэтому текст всегда совпадает.
- **Sitemap** генерируется при сборке из реестра страниц: только индексируемые, `lastmod` — дата изменения текста
  (поле `lastmod` в `src/entry-server.tsx`, обновлять вручную при правке контента). `public/robots.txt` — статичный.
- **Google Tag Manager и Search Console** — `src/site.ts`: `gtmId` (контейнер GTM-XXXXXXX) и `googleSiteVerification`.
  Пока значения пустые, ничего не вставляется. GA4, Google Ads и Яндекс.Метрика настраиваются внутри GTM, прямой
  gtag.js на сайт не добавлять.
- **UTM-метки и события конверсий** — `src/tracking.ts`. В `dataLayer` уходят `form_submit` (client_type, lead_topic, lead_city),
  `phone_click` и `whatsapp_click` (link_location: header / hero / contacts / form / footer / sticky_bar), ко всем
  добавляется `page_path`, `page_lang` (ru | kk) и сохранённые UTM. Значения `client_type`, `lead_topic`, `lead_city`
  всегда русские, даже с казахских страниц (`src/lead.ts`), чтобы отчёты не делились по языкам. В GTM для них нужны триггеры «Пользовательское событие» с этими именами; триггеры по клику на
  tel:/wa.me не добавлять, иначе клики посчитаются дважды. Имя и телефон в события не передаются.

Заявки с формы открывают WhatsApp с заполненным сообщением на номер из `src/site.ts`
(GitHub Pages не умеет принимать формы на сервере). Копия заявки уходит в Telegram через Cloudflare Worker
`worker/lead.js` (адрес — `leadEndpoint` в `src/site.ts`); заявка с казахской страницы помечена строкой
«Тіл: қазақша». После правки `worker/lead.js` код вставляется в редактор Cloudflare вручную.

## Локально

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # результат в dist/
```

## Деплой и домен

1. GitHub → Settings → Pages → Source: **GitHub Actions**.
2. После первого успешного деплоя: Settings → Pages → Custom domain: `janastart.kz`, затем включить **Enforce HTTPS**.
3. DNS — в Cloudflare (NS у регистратора ps.kz: `alexandra.ns.cloudflare.com`, `mitch.ns.cloudflare.com`): A-записи `@` →
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `nailshakurov.github.io`.
4. Cloudflare (аккаунт Наиля, тот же, что у Worker заявок): SSL/TLS **Full** — не Strict: сертификат GitHub за прокси
   не продлевается. Cache Rule: всё на краю 2 ч без учёта query string (gclid/UTM); Cache Response Rule: `/assets/*` —
   `public, max-age=31536000, immutable`. Rocket Loader, Email Obfuscation, Bot Fight Mode выключены — ломают GTM и
   гидрацию. После деплоя job `purge` в `deploy.yml` сбрасывает кэш (секрет `CLOUDFLARE_PURGE_TOKEN`); без секрета
   новые страницы видны с задержкой до 2 ч.
