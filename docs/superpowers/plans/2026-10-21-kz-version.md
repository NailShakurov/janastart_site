# Казахская версия (частичная) — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Страницы `/kz/` и `/kz/bankrotstvo/` на казахском с переключателем языка, hreflang, казахским SEO и пометкой языка в заявке; русская версия рендерится байт в байт как раньше (плюс переключатель и hreflang).

**Architecture:** Язык страницы задаётся при монтировании и раздаётся через React Context (`src/i18n.tsx`). Тексты — два словаря одной TypeScript-формы: содержимое (`Content`: ru в `src/content.ts`, kk в `src/content.kk.ts`) и интерфейс (`UiText`: `src/ui-text.ts`, `src/ui-text.kk.ts`); пропущенный ключ — ошибка `tsc`. Чистая логика заявки (текст WhatsApp, тело запроса, русские значения для dataLayer) вынесена в `src/lead.ts` и покрыта vitest. Пре-рендер получает поля `lang`/`alternate` в реестре страниц и ставит hreflang.

**Tech Stack:** Vite 8, React 19, TypeScript 5.8 strict, Tailwind 4, vitest (новая dev-зависимость, единственная), Cloudflare Worker без зависимостей.

**Spec:** `docs/superpowers/specs/2026-10-21-kz-version-design.md`

## Global Constraints

- Ветка `feature/kz` от `main`. Merge в `main` и push только по команде пользователя «деплоим».
- Правила `CLAUDE.md`: минимум кода, хирургические правки, бизнес-логика вне UI, без глобалов. Не менять форматирование соседнего кода.
- `index.html`, `src/pages/Onlain.tsx`, `src/pages/Politika.tsx`, `src/pages/NotFound.tsx`, `src/content-onlain.ts` не трогать.
- Поля `SITE` (`src/site.ts`) не удалять и не переименовывать: их читают нетронутые страницы и `seo.ts`. Русский словарь интерфейса ссылается на них.
- Значения `client_type`, `lead_topic`, `lead_city` в dataLayer всегда русские. Новый параметр во всех трёх событиях: `page_lang` (`"ru"` | `"kk"`).
- Имена событий и `link_location` не меняются.
- JSON-LD `PostalAddress` всегда русский; `@id` организации общий.
- Адреса: `/kz/`, `/kz/bankrotstvo/`; `html lang="kk"`, `og:locale` `kk_KZ`.
- WhatsApp-приветствие kk: `Сәлеметсіз бе! Қазақ тілінде тегін кеңес алғым келеді.`
- Строка в Telegram для kk: `Тіл: қазақша` второй строкой.
- Никакого автоперенаправления по языку браузера, ничего не запоминать.
- Терминология kk (закон РК): банкроттық; соттан тыс банкроттық; сот арқылы банкроттық; төлем қабілеттілігін қалпына келтіру; жеке тұлға; ЖК (жеке кәсіпкер); компания; несие берушілер; коллекторлар; тегін кеңес. «JANA START», «WhatsApp» не переводятся. Факты (20 жыл, 0 ₸, адрес, часы) те же.
- Коммиты на русском, одной строкой по смыслу, как в истории репозитория; в конце `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. Русская страница после рефакторинга словарей должна рендериться байт в байт (кроме переключателя и hreflang). Тест: Task 2 шаг diff с эталоном, Task 3 diff только в `<header>`.
2. Посетитель `/onlain/` или `/politika/` нажимает «Қаз» — должен попасть на `/kz/`, не на 404. Тест: Task 3, проверка `dist/onlain/index.html` содержит `href="/kz/"` в переключателе.
3. Заявка с `/kz/`: WhatsApp и Telegram на казахском, dataLayer на русском. Тест: Task 4 `lead.test.ts`.
4. Пара hreflang не взаимна или ссылается на несуществующую страницу — сборка должна упасть, а не выдать битый `<head>`. Тест: Task 7 `hreflang.test.mjs`.
5. Длина списков вариантов формы в kk и ru разошлась — значение для dataLayer не найдётся. Пин: кортежи фиксированной длины в типе `Content` (`tsc`), плюс `toRuValue` возвращает исходное значение, если индекс не найден (Task 4 тест).

---

### Task 0: Ветка, vitest, эталон русской сборки

**Files:**
- Modify: `package.json` (devDependencies, scripts)
- Create: эталон `/tmp/claude-1000/-home-nail-----------JanaStart-Site/25218e6f-9498-4fdc-9966-bbf08dfef366/scratchpad/dist-baseline/` (вне репозитория)

- [ ] **Step 1: Ветка**

```bash
git checkout -b feature/kz
```

- [ ] **Step 2: Эталон**

```bash
npm ci && npm run build && rm -rf "$SCRATCH/dist-baseline" && cp -r dist "$SCRATCH/dist-baseline"
```
где `SCRATCH=/tmp/claude-1000/-home-nail-----------JanaStart-Site/25218e6f-9498-4fdc-9966-bbf08dfef366/scratchpad`. Ожидание: в `dist-baseline` есть `index.html`, `bankrotstvo/`, `onlain/`, `politika/`, `404.html`, `sitemap.xml`.

- [ ] **Step 3: vitest**

`npm i -D vitest@^3`. В `package.json` scripts добавить `"test": "vitest run"`. Запустить `npm test` — ожидание: «No test files found», код 0 или 1 — главное, что vitest стартует.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "Тесты: vitest для логики заявки и hreflang"
```

---

### Task 1: Типы словарей и русские словари

**Files:**
- Modify: `src/content.ts` (добавить в конец: `type Content`, `CONTENT_RU`)
- Create: `src/ui-text.ts`
- Test: `src/content.test.ts`

**Interfaces:**
- Produces, `src/content.ts`:
  ```ts
  export type Content = {
    nav: NavItem[];                 // меню главной
    bankruptcyNav: NavItem[];       // меню /bankrotstvo/ (сейчас NAV в pages/Bankrotstvo.tsx)
    bankruptcyCrumbs: { name: string; path: string }[]; // [Главная, Банкротство]
    marquee: string[];
    facts: { value: string; label: string }[];
    procedures: ServiceCard[];
    services: ServiceCard[];
    otherServices: { title: string; text: string }[];
    processLead: string;
    steps: { title: string; text: string }[];
    why: { title: string; text: string }[];
    faq: { q: string; a: string }[];
    whoOptions: readonly [string, string, string];
    cityOptions: readonly [string, string, string, string, string];
    topicOptions: readonly [string, string, string, string];
    geoLine: { office: string; online: string };
  };
  export const CONTENT_RU: Content; // собран из существующих констант, без дублирования строк
  ```
- Produces, `src/ui-text.ts`:
  ```ts
  export type UiText = {
    lang: "ru" | "kk";
    skipLink: string; logoAlt: string;
    header: { homeAria: string; navAria: string; mobileNavAria: string; openMenu: string; closeMenu: string; callAria: string; consult: string; langAria: string };
    langNames: { ru: string; kk: string };          // «Рус», «Қаз» — одинаковы в обоих словарях
    site: { tagline: string; address: string; hours: string; legalName: string; onlineNote: string; binLabel: string };
    pages: {
      home: { title: string; tagline: string; lead: string; kzNote?: string };
      bankrotstvo: { title: string; lead: string; kzNote?: string };
    };
    hero: { consult: string; whatsapp: string };
    bankruptcy: { title: string; lead: string; count: string; law: string; discuss: string };
    otherServices: { title: string; lead: string };
    process: { title: string };
    why: { title: string; lead: string };
    faq: { title: string };
    contact: { title1: string; title2: string; intro?: string; address: string; phone: string; whatsapp: string; whatsappNote: string; email: string };
    form: { name: string; namePlaceholder: string; phone: string; who: string; city: string; cityPlaceholder: string; topic: string; consent: string; consentLink: string; error: string; submit: string; orCall: string };
    done: { title: string; text: string; link: string; orCall: string };  // text содержит «{name}»
    footer: { rights: string; info: string; policy: string };
    bar: { call: string; whatsapp: string };
    whatsapp: { greeting: string; name: string; phone: string; who: string; city: string; topic: string; source: string };
    seo: { orgDescription: string };
  };
  export const UI_RU: UiText;
  ```
  Значения `UI_RU` — ровно те строки, что сейчас в `src/sections.tsx`, `src/ui.tsx`, `src/pages/Bankrotstvo.tsx`, `src/site.ts` (`WHATSAPP_GREETING`, `tagline`, `address`, `hours`, `legalName`, `onlineNote`), `src/seo.ts` (description LegalService). `site.*` ссылаются на `SITE.*`, не копируют. `done.text` = `"{name}, мы открыли WhatsApp с готовым сообщением — просто нажмите «Отправить». Если окно не открылось, "` (хвост с ссылкой и телефоном рендерится в JSX). `kzNote`/`intro` в ru отсутствуют.

- [ ] **Step 1: Тест на форму словарей**

`src/content.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { CONTENT_RU, WHO_OPTIONS, CITY_OPTIONS, TOPIC_OPTIONS, FAQ } from "./content";
import { UI_RU } from "./ui-text";
import { SITE, WHATSAPP_GREETING } from "./site";

describe("русские словари", () => {
  it("собраны из существующих констант", () => {
    expect(CONTENT_RU.whoOptions).toBe(WHO_OPTIONS);
    expect(CONTENT_RU.cityOptions).toBe(CITY_OPTIONS);
    expect(CONTENT_RU.topicOptions).toBe(TOPIC_OPTIONS);
    expect(CONTENT_RU.faq).toBe(FAQ);
  });
  it("интерфейс ссылается на SITE", () => {
    expect(UI_RU.lang).toBe("ru");
    expect(UI_RU.site.address).toBe(SITE.address);
    expect(UI_RU.whatsapp.greeting).toBe(WHATSAPP_GREETING);
    expect(UI_RU.done.text).toContain("{name}");
  });
});
```

- [ ] **Step 2: Запустить, убедиться что падает**

`npm test` — ожидание: FAIL, `CONTENT_RU` / `UI_RU` не экспортируются.

- [ ] **Step 3: Добавить `Content`, `CONTENT_RU` в конец `src/content.ts`; создать `src/ui-text.ts` с `UiText`, `UI_RU`**

`bankruptcyNav` — перенести литерал `NAV` из `src/pages/Bankrotstvo.tsx` (сам файл правится в Task 3). `bankruptcyCrumbs` — литерал `[{ name: "Главная", path: "/" }, { name: "Банкротство", path: "/bankrotstvo/" }]`; в `src/seo.ts` заменить `BANKRUPTCY_CRUMBS` на `CONTENT_RU.bankruptcyCrumbs` (seo уже импортирует content).

- [ ] **Step 4: `npm test`, `npm run typecheck` — PASS**

- [ ] **Step 5: Commit**

```bash
git add src/content.ts src/ui-text.ts src/content.test.ts src/seo.ts
git commit -m "Словари текстов: тип Content и UiText, русские значения"
```

---

### Task 2: Контекст языка и вынос строк из разметки (русский рендер без изменений)

**Files:**
- Create: `src/i18n.tsx`
- Modify: `src/sections.tsx`, `src/ui.tsx`, `src/App.tsx`, `src/pages/Bankrotstvo.tsx`, `src/seo.ts`

**Interfaces:**
- Produces, `src/i18n.tsx`:
  ```ts
  export type Lang = "ru" | "kk";
  export function LangProvider(props: { lang: Lang; altHref: string; children: ReactNode }): JSX.Element;
  export function useLang(): Lang;          // по умолчанию "ru"
  export function useAltHref(): string;     // по умолчанию "/kz/"
  export function useText(): UiText;        // UI_RU или UI_KK по языку
  export function useContent(): Content;    // CONTENT_RU или CONTENT_KK
  ```
  До Task 5 `UI_KK`/`CONTENT_KK` ещё нет: в этой задаче `useText`/`useContent` возвращают ru для обоих языков через объект-реестр `{ ru: ..., kk: ... }`, который Task 5 дополнит. Чтобы `tsc` не ругался на отсутствие kk, реестр в Task 2 типизирован как `Record<Lang, UiText>` с `kk: UI_RU` и комментарием `// Task 5`.
- Consumes: `Content`, `CONTENT_RU` (Task 1), `UiText`, `UI_RU` (Task 1).

- [ ] **Step 1: Создать `src/i18n.tsx`**

Context value `{ lang, altHref }`, значение по умолчанию `{ lang: "ru", altHref: "/kz/" }`.

- [ ] **Step 2: Заменить в `src/sections.tsx` и `src/ui.tsx` каждую русскую строку интерфейса на поле из `useText()`, а списки/карточки — на `useContent()`**

Правила:
- Компоненты, которые используют `useText`/`useContent`, читают их одной строкой в начале: `const t = useText();`, `const c = useContent();`.
- `Hero`: значения по умолчанию `title/tagline/lead` остаются, но берутся из `UI_RU.pages.home` (импорт константы, чтобы `/onlain/` не изменился); кнопки — `t.hero.*`; факты — `c.facts`; новый необязательный prop `kzNote?: string`, рендерится над `lead` как `<p className="mt-4 font-bold text-dawn">` только если задан.
- `GeoLine`: `c.geoLine`; если `useLang() === "kk"`, вместо `<a>` — `<span>` с тем же текстом.
- `Contact`: все подписи — `t.form.*`, `t.contact.*`, `t.done.*`; логика `handleSubmit` пока остаётся как есть (переезжает в `src/lead.ts` в Task 4). Prop `intro` по умолчанию `t.contact.intro`.
- `Faq({ items = c.faq })`, `Process` (`title = t.process.title`, `lead = c.processLead`, `steps = c.steps`), `Why` аналогично — значения по умолчанию из словаря через деструктуризацию после вызова хуков.
- `Header`: все aria и «Консультация» — `t.header.*`; переключатель языка **не добавлять** в этой задаче.
- `Footer`: `t.site.legalName`, `t.site.binLabel`, `SITE.bin`, `t.site.address`, `t.site.onlineNote`, `t.footer.*`.
- `ContactBar`: `t.bar.*`, `whatsappLink(t.whatsapp.greeting)`.
- `Page`: `t.skipLink`. `LogoMark`: `t.logoAlt`.
- `App`: оборачивает в `<LangProvider lang={lang} altHref={lang === "kk" ? "/" : "/kz/"}>`, prop `lang: Lang = "ru"`; `Header nav={c.nav}` — но `c` доступен только внутри провайдера, поэтому разметка выносится во внутренний компонент `HomeBody`. Hero получает `title/tagline/lead/kzNote` из `t.pages.home`.
- `Bankrotstvo`: то же с `altHref` `"/bankrotstvo/"` | `"/kz/bankrotstvo/"`, `nav={c.bankruptcyNav}`, `crumbs={c.bankruptcyCrumbs}`, Hero из `t.pages.bankrotstvo`.
- `src/seo.ts`: `legalServiceJsonLd(description: string = UI_RU.seo.orgDescription)`.

- [ ] **Step 3: `npm run typecheck && npm run lint && npm test` — PASS**

- [ ] **Step 4: Сборка и байтовое сравнение с эталоном**

```bash
npm run build && diff -r "$SCRATCH/dist-baseline" dist
```
Ожидание: различий нет вообще (хэши ассетов могут отличаться только если изменился JS-бандл — он изменился; поэтому сравнивать HTML после нормализации: `diff <(sed -E 's#/assets/[a-zA-Z0-9_-]+\.js#/assets/X.js#g' "$SCRATCH/dist-baseline/index.html") <(sed -E 's#/assets/[a-zA-Z0-9_-]+\.js#/assets/X.js#g' dist/index.html)` для `index.html`, `bankrotstvo/index.html`, `onlain/index.html`, `politika/index.html`, `404.html`). Ожидание: пусто для всех пяти. Любое отличие — дефект выноса строк, чинить до коммита.

- [ ] **Step 5: Commit**

```bash
git add src/i18n.tsx src/sections.tsx src/ui.tsx src/App.tsx src/pages/Bankrotstvo.tsx src/seo.ts
git commit -m "Тексты интерфейса и содержимого читаются из словарей через контекст языка"
```

---

### Task 3: Переключатель языка в шапке

**Files:**
- Modify: `src/ui.tsx` (`Header`)

**Interfaces:**
- Consumes: `useLang`, `useAltHref`, `useText` (Task 2).

- [ ] **Step 1: Добавить в `Header` блок переключателя**

Десктоп: внутри `<div className="flex items-center gap-4">` первым элементом `<nav aria-label={t.header.langAria}>` с двумя ссылками: текущий язык — `<span aria-current="page" className="font-bold">`, другой — `<a href={altHref} className="opacity-85 hover:underline hover:opacity-100">`; разделитель `<span aria-hidden="true" className="mx-1.5 opacity-50">|</span>`; подписи из `t.langNames`. Мобильное меню: та же пара последней строкой перед телефоном.

- [ ] **Step 2: Сборка и сравнение**

`npm run build`, затем нормализованный diff из Task 2 шага 4 для всех пяти HTML. Ожидание: отличия только внутри `<header …>…</header>` и только добавленные строки переключателя. В `dist/onlain/index.html` и `dist/politika/index.html` ссылка переключателя — `href="/kz/"`.

- [ ] **Step 3: `npm run typecheck && npm run lint` — PASS. Commit**

```bash
git add src/ui.tsx
git commit -m "Шапка: переключатель языка Рус | Қаз"
```

---

### Task 4: Логика заявки в `src/lead.ts`, `page_lang` в событиях

**Files:**
- Create: `src/lead.ts`
- Test: `src/lead.test.ts`
- Modify: `src/sections.tsx` (`handleSubmit`, ссылка «нажмите здесь»), `src/tracking.ts` (`track`)

**Interfaces:**
- Produces, `src/lead.ts`:
  ```ts
  export type LeadFields = { name: string; phone: string; who: string; city: string; topic: string };
  /** Текст для wa.me: приветствие, затем «Подпись: значение» построчно; source только если не пуст. */
  export function buildWhatsappText(t: UiText["whatsapp"], lead: LeadFields, source: string): string;
  /** Короткий текст для запасной ссылки «нажмите здесь» (одна строка). */
  export function buildFallbackText(t: UiText["whatsapp"], lead: LeadFields): string;
  /** Тело запроса к worker. */
  export function buildLeadPayload(lead: LeadFields, extra: { page: string; source: string; website: string; lang: Lang }): Record<string, string>;
  /** Русское значение по индексу в списке текущего языка; если не найдено — исходное. */
  export function toRuValue(current: readonly string[], ru: readonly string[], value: string): string;
  /** Параметры form_submit: client_type, lead_topic, lead_city — всегда русские. */
  export function formSubmitParams(c: Content, ru: Content, lead: LeadFields): { client_type: string; lead_topic: string; lead_city: string };
  ```
- `src/tracking.ts`: `track` добавляет `page_lang: document.documentElement.lang || "ru"` в payload (до `...data`). Тип `LinkLocation` без изменений.

- [ ] **Step 1: Тесты `src/lead.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildWhatsappText, buildFallbackText, buildLeadPayload, toRuValue, formSubmitParams } from "./lead";
import { CONTENT_RU } from "./content";
import { UI_RU } from "./ui-text";

const lead = { name: "Айгерим", phone: "+7 700 000-00-00", who: "ИП", city: "Астана", topic: "Долги и коллекторы" };

describe("lead", () => {
  it("whatsapp-текст по-русски как раньше", () => {
    expect(buildWhatsappText(UI_RU.whatsapp, lead, "utm_source=google")).toBe(
      "Здравствуйте! Хочу получить бесплатную консультацию.\nИмя: Айгерим\nТелефон: +7 700 000-00-00\nКто: ИП\nГород: Астана\nТема: Долги и коллекторы\nИсточник: utm_source=google",
    );
    expect(buildWhatsappText(UI_RU.whatsapp, lead, "")).not.toContain("Источник");
  });
  it("запасной текст одной строкой", () => {
    expect(buildFallbackText(UI_RU.whatsapp, lead)).toBe(
      "Здравствуйте! Хочу получить бесплатную консультацию. Имя: Айгерим, телефон: +7 700 000-00-00, город: Астана, тема: Долги и коллекторы",
    );
  });
  it("тело запроса содержит lang", () => {
    expect(buildLeadPayload(lead, { page: "/kz/", source: "", website: "", lang: "kk" })).toEqual({
      name: "Айгерим", phone: "+7 700 000-00-00", who: "ИП", city: "Астана", topic: "Долги и коллекторы",
      page: "/kz/", source: "", website: "", lang: "kk",
    });
  });
  it("toRuValue: по индексу, иначе исходное", () => {
    expect(toRuValue(["а", "б", "в"], ["x", "y", "z"], "б")).toBe("y");
    expect(toRuValue(["а", "б"], ["x", "y"], "нет")).toBe("нет");
  });
  it("formSubmitParams для ru — те же значения", () => {
    expect(formSubmitParams(CONTENT_RU, CONTENT_RU, lead)).toEqual({ client_type: "ИП", lead_topic: "Долги и коллекторы", lead_city: "Астана" });
  });
});
```

- [ ] **Step 2: `npm test` — FAIL (модуля нет)**

- [ ] **Step 3: Реализовать `src/lead.ts`; в `src/sections.tsx` `handleSubmit` использовать `buildWhatsappText`, `buildLeadPayload` (с `lang: useLang()`), `formSubmitParams(c, CONTENT_RU, lead)`; ссылку «нажмите здесь» — `buildFallbackText`; в `src/tracking.ts` добавить `page_lang`**

Для `buildFallbackText` русский формат: `"{greeting} {name}: {n}, {phone-нижний регистр}: {p}, {city-нижний}: {c}, {topic-нижний}: {t}"` — подписи в нижнем регистре через `toLowerCase()`, как в текущем тексте.

- [ ] **Step 4: `npm test && npm run typecheck && npm run lint` — PASS. Сборка и нормализованный diff ru-HTML с эталоном: по-прежнему только `<header>`**

- [ ] **Step 5: Commit**

```bash
git add src/lead.ts src/lead.test.ts src/sections.tsx src/tracking.ts
git commit -m "Заявка: логика текста и тела запроса в lead.ts, page_lang в событиях"
```

---

### Task 5: Казахские словари

**Files:**
- Create: `src/content.kk.ts`, `src/ui-text.kk.ts`
- Modify: `src/i18n.tsx` (реестр `kk`)
- Test: `src/content.kk.test.ts`

**Interfaces:**
- Produces: `export const CONTENT_KK: Content` (`src/content.kk.ts`), `export const UI_KK: UiText` (`src/ui-text.kk.ts`).

- [ ] **Step 1: Тест `src/content.kk.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { CONTENT_KK } from "./content.kk";
import { CONTENT_RU } from "./content";
import { UI_KK } from "./ui-text.kk";
import { formSubmitParams } from "./lead";

describe("казахские словари", () => {
  it("ссылки ведут на казахские страницы, без Онлайн в меню", () => {
    expect(CONTENT_KK.nav.map((i) => i.href)).toEqual(["/kz/bankrotstvo/", "#services", "#process", "#faq", "#contact"]);
    expect(CONTENT_KK.bankruptcyNav.map((i) => i.href)).toEqual(["#bankruptcy", "#process", "#faq", "#contact"]);
    for (const card of [...CONTENT_KK.procedures, ...CONTENT_KK.services]) expect(card.href).toBe("/kz/bankrotstvo/");
    expect(CONTENT_KK.bankruptcyCrumbs.map((c) => c.path)).toEqual(["/kz/", "/kz/bankrotstvo/"]);
  });
  it("значения для dataLayer русские", () => {
    const lead = { name: "n", phone: "p", who: CONTENT_KK.whoOptions[1], city: CONTENT_KK.cityOptions[2], topic: CONTENT_KK.topicOptions[2] };
    expect(formSubmitParams(CONTENT_KK, CONTENT_RU, lead)).toEqual({ client_type: "ИП", lead_topic: "Долги и коллекторы", lead_city: "Астана" });
  });
  it("интерфейс на казахском", () => {
    expect(UI_KK.lang).toBe("kk");
    expect(UI_KK.whatsapp.greeting).toBe("Сәлеметсіз бе! Қазақ тілінде тегін кеңес алғым келеді.");
    expect(UI_KK.site.legalName).toBe("ЖК JANA START");
    expect(UI_KK.site.onlineNote).toContain("(орыс тілінде)");
    expect(UI_KK.footer.policy).toContain("(орыс тілінде)");
    expect(UI_KK.form.consentLink).toContain("(орыс тілінде)");
    expect(UI_KK.pages.home.kzNote).toBeTruthy();
    expect(UI_KK.pages.bankrotstvo.kzNote).toBeTruthy();
    expect(UI_KK.contact.intro).toBeTruthy();
    expect(UI_KK.langNames).toEqual({ ru: "Рус", kk: "Қаз" });
  });
});
```

- [ ] **Step 2: `npm test` — FAIL**

- [ ] **Step 3: Написать `src/content.kk.ts` и `src/ui-text.kk.ts` на казахском; в `src/i18n.tsx` реестр `kk: UI_KK` / `kk: CONTENT_KK`**

Фиксированные значения: `langNames` `{ ru: "Рус", kk: "Қаз" }`; `site.legalName` `"ЖК JANA START"`; `site.address` `"Алматы қ., Әуезов к-сі, 145 В, 103 кеңсе"`; `site.hours` `"дс–жм, 9:00–19:00"`; `site.binLabel` `"БСН"`; пометка для русских страниц `"(орыс тілінде)"` в `site.onlineNote`, `footer.policy`, `form.consentLink`; `pages.*.kzNote` `"Кеңес қазақ тілінде"`; `contact.intro` `"Кеңесті қазақ тілінде аласыз."`; `done.text` содержит `{name}`. Остальное — живой казахский по терминологии из Global Constraints, смысл 1:1 с русским. Списки `whoOptions`/`cityOptions`/`topicOptions` — тот же порядок, что в ru.

- [ ] **Step 4: `npm test && npm run typecheck && npm run lint` — PASS**

- [ ] **Step 5: Commit**

```bash
git add src/content.kk.ts src/ui-text.kk.ts src/content.kk.test.ts src/i18n.tsx
git commit -m "Казахские словари содержимого и интерфейса"
```

---

### Task 6: Страницы `/kz/` и `/kz/bankrotstvo/`

**Files:**
- Create: `kz/index.html`, `kz/bankrotstvo/index.html`, `src/kz.tsx`, `src/kz-bankrotstvo.tsx`
- Modify: `vite.config.ts`, `src/entry-server.tsx`

**Interfaces:**
- `PageDef` получает `lang?: Lang` (по умолчанию `"ru"`) и `alternate?: string` (Task 7 читает оба).
- Produces: записи `PAGES` для `kz/index.html` (`path: "/kz/"`, `alternate: "/"`, `lang: "kk"`, `Component: () => <App lang="kk" />`, `lastmod` — дата дня деплоя, пока `"2026-10-21"`, `jsonLd: [legalServiceJsonLd(UI_KK.seo.orgDescription), faqJsonLd(CONTENT_KK.faq)]`) и `kz/bankrotstvo/index.html` (`path: "/kz/bankrotstvo/"`, `alternate: "/bankrotstvo/"`, плюс `breadcrumbJsonLd(CONTENT_KK.bankruptcyCrumbs)`). Русские `/` и `/bankrotstvo/` получают `alternate: "/kz/"` и `"/kz/bankrotstvo/"`.

- [ ] **Step 1: Шаблоны**

Скопировать `index.html` → `kz/index.html`, `bankrotstvo/index.html` → `kz/bankrotstvo/index.html`; в копиях: `lang="kk"`, `og:locale` `kk_KZ`, `canonical`/`og:url` на свой адрес, `<title>`, `description`, `og:title`, `og:description` на казахском (главная: заголовок с «банкроттық» и «Алматы», до 60 знаков; банкротство: «Жеке тұлғалар, ЖК және компаниялардың банкроттығы, Алматы | JANA START»), `<script src="/src/kz.tsx">` и `/src/kz-bankrotstvo.tsx`. Точки монтирования: `mount(<App lang="kk" />)`, `mount(<Bankrotstvo lang="kk" />)`.

- [ ] **Step 2: `vite.config.ts` input: `kz: page("kz/index.html")`, kzBankrotstvo: `page("kz/bankrotstvo/index.html")`; `src/entry-server.tsx` — поля и записи из Interfaces**

- [ ] **Step 3: `npm run build`; проверки**

```bash
grep -c 'lang="kk"' dist/kz/index.html dist/kz/bankrotstvo/index.html      # по 1
grep -lE 'Позвонить|Консультация|Ваше имя|Политика конфиденциальности|Все права защищены|ул. Ауэзова|пн–пт|ИП JANA START|юридическая компания' dist/kz/index.html dist/kz/bankrotstvo/index.html   # пусто
grep -o '"@type":"FAQPage"' dist/kz/index.html | wc -l                        # 1
grep -c 'streetAddress":"ул. Ауэзова' dist/kz/index.html                      # 1 (адрес в JSON-LD русский)
```
Примечание: `grep -lE` по русским строкам не должен ловить `Сәлеметсіз`-тексты; если ловит слово «Консультация» внутри JSON-LD русского адреса — сузить до видимого HTML (`sed '/application\/ld+json/d'`).

- [ ] **Step 4: `npm run typecheck && npm run lint && npm test` — PASS. Commit**

```bash
git add kz vite.config.ts src/entry-server.tsx src/kz.tsx src/kz-bankrotstvo.tsx
git commit -m "Страницы /kz/ и /kz/bankrotstvo/ на казахском"
```

---

### Task 7: hreflang и sitemap в пре-рендере

**Files:**
- Create: `scripts/hreflang.mjs`
- Test: `scripts/hreflang.test.mjs`
- Modify: `scripts/prerender.mjs`

**Interfaces:**
- Produces, `scripts/hreflang.mjs`:
  ```js
  /** Теги <link rel="alternate"> для страницы с парой; [] без пары. Бросает Error, если пары нет в pages или она не взаимна. */
  export function hreflangTags(page, pages, origin) // → string[]
  ```
  Порядок: `hreflang="ru"`, `hreflang="kk"`, `hreflang="x-default"` (href русской страницы пары). Формат: `<link rel="alternate" hreflang="ru" href="https://janastart.kz/" />`.

- [ ] **Step 1: Тест `scripts/hreflang.test.mjs`**

```js
import { describe, expect, it } from "vitest";
import { hreflangTags } from "./hreflang.mjs";
const O = "https://janastart.kz";
const ru = { path: "/", lang: "ru", alternate: "/kz/" };
const kk = { path: "/kz/", lang: "kk", alternate: "/" };
describe("hreflangTags", () => {
  it("три тега, x-default на русскую", () => {
    expect(hreflangTags(ru, [ru, kk], O)).toEqual([
      `<link rel="alternate" hreflang="ru" href="${O}/" />`,
      `<link rel="alternate" hreflang="kk" href="${O}/kz/" />`,
      `<link rel="alternate" hreflang="x-default" href="${O}/" />`,
    ]);
    expect(hreflangTags(kk, [ru, kk], O)).toEqual(hreflangTags(ru, [ru, kk], O));
  });
  it("без пары — пусто", () => expect(hreflangTags({ path: "/onlain/" }, [ru, kk], O)).toEqual([]));
  it("пары нет в реестре — ошибка", () => expect(() => hreflangTags(ru, [ru], O)).toThrow(/\/kz\//));
  it("пара не взаимна — ошибка", () => expect(() => hreflangTags(ru, [ru, { ...kk, alternate: "/bankrotstvo/" }], O)).toThrow(/взаимн/));
});
```

- [ ] **Step 2: `npm test` — FAIL**

- [ ] **Step 3: Реализовать `scripts/hreflang.mjs`; в `scripts/prerender.mjs` добавить `head.push(...hreflangTags(page, PAGES, SITE.origin))` перед JSON-LD**

- [ ] **Step 4: `npm test` PASS; `npm run build`; проверки**

```bash
grep -c 'hreflang=' dist/index.html dist/kz/index.html dist/bankrotstvo/index.html dist/kz/bankrotstvo/index.html   # по 3
grep -c 'hreflang=' dist/onlain/index.html   # 0
grep -c '<loc>' dist/sitemap.xml             # 5
```
Нормализованный diff `dist/index.html` с эталоном: только `<header>` и три строки hreflang.

- [ ] **Step 5: Commit**

```bash
git add scripts/hreflang.mjs scripts/hreflang.test.mjs scripts/prerender.mjs
git commit -m "Пре-рендер: hreflang для пар страниц, казахские адреса в sitemap"
```

---

### Task 8: Worker и README

**Files:**
- Modify: `worker/lead.js`, `README.md`

- [ ] **Step 1: `worker/lead.js`**

В `lead` добавить `lang: field("lang")`; в `text` второй элемент массива: `lead.lang === "kk" && "Тіл: қазақша"` (сразу после «Новая заявка с сайта»). Больше ничего.

- [ ] **Step 2: README, раздел «Где что править»**

Добавить подраздел «Казахская версия»: какие страницы есть (`/kz/`, `/kz/bankrotstvo/`), где тексты (`src/content.kk.ts`, `src/ui-text.kk.ts`), что при правке русского текста в `content.ts`/`ui-text.ts` надо править и kk (tsc подскажет только пропущенный ключ, не устаревший перевод), как добавить страницу на kk (шаблон в `kz/…`, запись в `vite.config.ts` и `PAGES` с `lang`/`alternate`), и что после правки `worker/lead.js` код вставляется в Cloudflare вручную.

- [ ] **Step 3: Commit**

```bash
git add worker/lead.js README.md
git commit -m "Worker: пометка языка заявки; README: казахская версия"
```

---

### Task 9: Проверка в браузере и готовность к деплою

**Files:** нет изменений кода, если всё проходит.

- [ ] **Step 1: `npm run build && npm run preview`** — открыть `http://localhost:4173/kz/` и `/kz/bankrotstvo/` (Playwright или Chrome): переключатель ведёт `/kz/` ↔ `/`, `/kz/bankrotstvo/` ↔ `/bankrotstvo/`; на `/onlain/` «Қаз» → `/kz/`; на `/kz/` нет русских строк на экране (шапка, форма, подвал, панель внизу); фраза «Кеңес қазақ тілінде» видна в первом экране на ширине 390px без прокрутки.

- [ ] **Step 2: Отправка формы с `/kz/`** (перехватить `window.open` и `fetch` через `page.evaluate` до сабмита): текст wa.me начинается с `Сәлеметсіз бе!`; тело fetch содержит `"lang":"kk"`; в `window.dataLayer` событие `form_submit` с `page_lang: "kk"` и русскими `client_type`/`lead_topic`/`lead_city`.

- [ ] **Step 3: Итог для пользователя**

Сообщить: ветка `feature/kz` готова, список коммитов, что после «деплоим» нужно: (а) поставить `lastmod` kk-страниц датой дня, (б) merge + push, (в) вставить `worker/lead.js` в Cloudflare, (г) curl `/kz/` и `/kz/bankrotstvo/`, (д) тестовая заявка с `/kz/` в Telegram. Деплой — только по команде.
