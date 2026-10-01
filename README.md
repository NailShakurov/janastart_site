# JanaStart

Лендинг стартапа JanaStart — банкротство физических и юридических лиц в Казахстане.
Домен: https://janastart.kz

Стек: Vite + React + Tailwind CSS. При сборке страница пре-рендерится в статический HTML
и автоматически публикуется на GitHub Pages (`.github/workflows/deploy.yml`) при каждом push в `main`.

## Где что править

- **Контакты, телефон, WhatsApp, адрес, реквизиты** — `src/site.ts` (сейчас там заглушки).
- **Тексты, услуги, этапы, FAQ** — массивы в начале `src/App.tsx`.
- **Цвета и шрифты** — `src/styles.css`; SEO-заголовок и описание — `index.html`.

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
