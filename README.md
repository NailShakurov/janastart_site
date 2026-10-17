# JanaStart

Лендинг стартапа JanaStart — банкротство физических и юридических лиц в Казахстане.
Домен: https://janastart.kz

Стек: Vite + React + Tailwind CSS. При сборке страница пре-рендерится в статический HTML
и автоматически публикуется на GitHub Pages (`.github/workflows/deploy.yml`) при каждом push в `main`.

## Где что править

- **Контакты, телефон, WhatsApp, адрес, реквизиты** — `src/site.ts`.
- **Тексты, услуги, этапы, FAQ** — `src/content.ts`; блоки страниц — `src/sections.tsx`; шапка и подвал — `src/ui.tsx`.
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
  `phone_click` и `whatsapp_click` (link_location: header / hero / contacts / form), ко всем добавляется `page_path`
  и сохранённые UTM. В GTM для них нужны триггеры «Пользовательское событие» с этими именами; триггеры по клику на
  tel:/wa.me не добавлять, иначе клики посчитаются дважды. Имя и телефон в события не передаются.

Заявки с формы открывают WhatsApp с заполненным сообщением на номер из `src/site.ts`
(GitHub Pages не умеет принимать формы на сервере).

## Локально

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # результат в dist/
```

## Деплой и домен

1. GitHub → Settings → Pages → Source: **GitHub Actions**.
2. После первого успешного деплоя: Settings → Pages → Custom domain: `janastart.kz`, затем включить **Enforce HTTPS**.
3. DNS у регистратора: A-записи `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `nailshakurov.github.io`.
