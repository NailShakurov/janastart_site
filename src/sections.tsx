// Блоки страниц: hero, бегущая строка, банкротство, услуги, этапы, FAQ, контакты с формой.
import { useState, type FormEvent, type ReactNode } from "react";
import {
  CITY_OPTIONS,
  FACTS,
  FAQ,
  GEO_LINE,
  MARQUEE,
  ONLAIN_HREF,
  OTHER_SERVICES,
  POLICY_HREF,
  PROCEDURES,
  PROCESS_LEAD,
  SERVICES,
  STEPS,
  TOPIC_OPTIONS,
  WHO_OPTIONS,
  WHY,
} from "./content";
import type { Crumb } from "./seo";
import { SITE, whatsappLink } from "./site";
import { getUtm, track } from "./tracking";
import {
  BTN_DARK,
  BTN_GHOST,
  BTN_MAIN,
  Breadcrumbs,
  CARD,
  ContactRow,
  Field,
  H2,
  H3,
  INPUT,
  LEAD,
  SECTION,
  WRAP,
  onPhoneClick,
  onWhatsappClick,
} from "./ui";

const HERO_DISPLAY = "max-w-[14ch] font-serif text-[clamp(38px,7vw,72px)] font-bold leading-[1.15]";

/**
 * Первый экран. Если передан tagline, крупной строкой показывается он (слоган),
 * а title становится небольшим H1 над ним — так на главной: H1 с ключевой фразой,
 * слоган «Новый старт без долгов» в прежнем стиле.
 */
export function Hero({
  title = "Банкротство и юридическая помощь в Алматы",
  tagline = "Новый старт без долгов",
  lead = "Jana по-казахски значит «новый». Мы помогаем гражданам, ИП и компаниям выйти из долгов по закону и решаем другие юридические вопросы. Юристы с 20-летним стажем.",
  crumbs,
  subline,
  note,
}: {
  title?: string;
  tagline?: string | null;
  lead?: string;
  crumbs?: Crumb[];
  /** Строка сразу под слоганом или заголовком (география на главной). */
  subline?: ReactNode;
  /** Мелкая строка под кнопками (адрес офиса на /onlain/). */
  note?: string;
}) {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pb-[150px] pt-[84px] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-420px] left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 8%, rgba(242,184,75,.95), rgba(242,184,75,.35) 14%, rgba(242,184,75,0) 38%)",
        }}
      />
      <div className={`${WRAP} relative z-10`}>
        {crumbs && <Breadcrumbs crumbs={crumbs} className="mb-6" />}
        {tagline ? (
          <>
            <h1 className="font-sans text-[clamp(15px,1.8vw,18px)] font-bold uppercase leading-normal tracking-[0.14em] text-dawn">
              {title}
            </h1>
            <p className={`hero-tagline mt-3 ${HERO_DISPLAY}`}>{tagline}</p>
          </>
        ) : (
          <h1 className={HERO_DISPLAY}>{title}</h1>
        )}
        {subline && <p className="mt-4 text-[17px] text-mist">{subline}</p>}
        <p className="mt-5 max-w-[54ch] text-[19px] text-mist-light">{lead}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#contact" className={BTN_MAIN}>
            Бесплатная консультация
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsappClick("hero")}
            className={BTN_GHOST}
          >
            Написать в WhatsApp
          </a>
        </div>
        {note && <p className="mt-5 max-w-[62ch] text-[15px] text-mist">{note}</p>}
        <ul className="mt-11 flex flex-wrap gap-x-9 gap-y-3">
          {FACTS.map((f) => (
            <li key={f.value} className="max-w-[200px] text-[15px] text-mist">
              <strong className="block font-serif text-[26px] font-bold text-dawn">
                {f.value}
              </strong>
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** «Офис в Алматы · работаем онлайн по всему Казахстану» — строка под слоганом на главной. */
export function GeoLine() {
  return (
    <>
      {GEO_LINE.office}
      <span aria-hidden="true" className="mx-2 text-dawn">
        ·
      </span>
      <a href={ONLAIN_HREF} className="underline underline-offset-4 hover:text-white">
        {GEO_LINE.online}
      </a>
    </>
  );
}

export function Marquee() {
  return (
    <div
      className="overflow-hidden border-b border-line bg-white py-3.5 text-ink2"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.15em] motion-reduce:animate-none">
        {[...MARQUEE, ...MARQUEE].map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            {item}
            <span className="text-dawn">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Блок процедур и направлений. linkCards — заголовки карточек становятся ссылками
 * на страницы услуг (на главной); на самой странице /bankrotstvo/ ссылки не нужны.
 */
export function Bankruptcy({ linkCards = false }: { linkCards?: boolean }) {
  const cardTitle = (card: { title: string; href: string }) =>
    linkCards ? (
      <a href={card.href} className="hover:underline">
        {card.title}
      </a>
    ) : (
      card.title
    );
  return (
    <section id="bankruptcy" className={SECTION}>
      {/* Старый якорь #procedures — псевдоним на этот блок (F-05) */}
      <span id="procedures" className="block" aria-hidden="true" />
      <div className={WRAP}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className={H2}>Банкротство по закону Казахстана</h2>
            <p className={LEAD}>
              Подходящая процедура зависит от суммы долга, просрочки, дохода и имущества. На
              консультации мы честно скажем, какая из них вам подходит и подходит ли банкротство
              вообще.
            </p>
          </div>
          <span className="hidden shrink-0 text-sm font-bold text-ink2 sm:block">
            03 направления
          </span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PROCEDURES.map((p) => (
            <article key={p.title} className={`${CARD} border-t-[5px] border-t-dawn`}>
              <h3 className={H3}>{cardTitle(p)}</h3>
              <p className="mt-2 text-ink2">{p.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink2">
          Закон РК «О восстановлении платёжеспособности и банкротстве граждан Республики Казахстан»
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.title} className={`${CARD} flex flex-col`}>
              <h3 className={H3}>{cardTitle(s)}</h3>
              <p className="mt-2 flex-1 text-ink2">{s.text}</p>
              <a
                href="#contact"
                className="mt-4 inline-block font-bold text-dawn-dark hover:underline"
              >
                Обсудить мою ситуацию →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OtherServices() {
  return (
    <section id="services" className={`${SECTION} border-y border-line bg-white`}>
      <div className={WRAP}>
        <h2 className={H2}>Юридическая помощь по другим вопросам</h2>
        <p className={LEAD}>
          Если у вас не долги, а другая правовая задача, мы тоже поможем: от консультации до
          представительства в суде.
        </p>
        <dl className="mt-7 grid gap-x-10 md:grid-cols-2">
          {OTHER_SERVICES.map((s) => (
            <div key={s.title} className="border-t border-line pb-[18px] pt-[18px]">
              <dt className="font-serif text-[20px] font-bold">{s.title}</dt>
              <dd className="mt-1 text-ink2">{s.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Process({
  title = "Как мы работаем",
  lead = PROCESS_LEAD,
  steps = STEPS,
  className = "sm:grid-cols-2 lg:grid-cols-4",
}: {
  title?: string;
  lead?: string | null;
  steps?: readonly { title: string; text: string }[];
  /** Классы сетки: колонки под число шагов. */
  className?: string;
}) {
  return (
    <section id="process" className={SECTION}>
      <div className={WRAP}>
        <h2 className={H2}>{title}</h2>
        {lead && <p className={LEAD}>{lead}</p>}
        <ol className={`mt-8 grid gap-5 ${className}`}>
          {steps.map((step, i) => (
            <li key={step.title} className="border-t-[3px] border-green pt-3.5">
              <span
                className="block font-serif text-[34px] leading-tight text-green"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="mt-1 font-serif text-[20px] font-bold">{step.title}</h3>
              <p className="mt-1.5 text-base text-ink2">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Why({
  title = "Почему JANA START",
  lead = "Мы строим работу на четырёх правилах.",
  items = WHY,
}: {
  title?: string;
  lead?: string | null;
  items?: readonly { title: string; text: string }[];
}) {
  return (
    <section id="why" className={`${SECTION} bg-ink text-white`}>
      <div className={WRAP}>
        <h2 className={H2}>{title}</h2>
        {lead && <p className={`${LEAD} text-mist`}>{lead}</p>}
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((w) => (
            <li
              key={w.title}
              className="rounded-[10px] border border-white/15 bg-white/[0.06] p-[26px]"
            >
              <h3 className={H3}>{w.title}</h3>
              <p className="mt-2 text-mist">{w.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Блок «Частые вопросы». Те же items передаются в faqJsonLd(), чтобы разметка совпадала с текстом. */
export function Faq({ items = FAQ }: { items?: readonly { q: string; a: string }[] }) {
  return (
    <section id="faq" className={SECTION}>
      <div className={WRAP}>
        <h2 className={H2}>Частые вопросы</h2>
        <div className="mt-7 max-w-[820px] space-y-2.5">
          {items.map((item) => (
            <details key={item.q} className="group rounded-lg border border-line bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[22px] py-[18px] font-bold [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-[17px] leading-[1.6]">{item.q}</h3>
                <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-green">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="px-[22px] pb-[18px] text-ink2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({
  intro,
}: {
  /** Призыв к действию под заголовком формы. */
  intro?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [who, setWho] = useState<string>(WHO_OPTIONS[0]);
  // Город без значения по умолчанию и обязателен: в lead_city должны попадать реальные города.
  const [city, setCity] = useState("");
  const [topic, setTopic] = useState<string>(TOPIC_OPTIONS[0]);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length < 10 || digits.length > 11 || !city || !agree) {
      setError("Заполните имя, телефон и город и подтвердите согласие.");
      return;
    }
    setError(null);
    const utm = getUtm();
    const source = Object.entries(utm)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const text = [
      "Здравствуйте! Хочу получить бесплатную консультацию.",
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      `Кто: ${who}`,
      `Город: ${city}`,
      `Тема: ${topic}`,
      source ? `Источник: ${source}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    // Событие уходит в dataLayer до открытия WhatsApp. Задержка не нужна: wa.me
    // открывается в новой вкладке, страница с формой остаётся и тег успевает отправиться.
    track("form_submit", { client_type: who, lead_topic: topic, lead_city: city });
    window.open(whatsappLink(text), "_blank", "noopener");
    setSubmitted(true);
  };

  return (
    <section id="contact" className={`${SECTION} border-t border-line bg-white`}>
      <div className={`${WRAP} grid items-start gap-12 md:grid-cols-2`}>
        <div>
          <h2 className={H2}>
            Оставьте заявку —
            <br />
            <span className="text-dawn-dark">первая консультация бесплатно.</span>
          </h2>
          {intro && <p className={LEAD}>{intro}</p>}
          <ul className="mt-6 space-y-4">
            <ContactRow label="Адрес">
              {SITE.address}
              {SITE.addressNote && (
                <>
                  <br />
                  {SITE.addressNote}
                </>
              )}
            </ContactRow>
            <ContactRow label="Телефон">
              <a
                href={SITE.phoneHref}
                onClick={onPhoneClick("contacts")}
                className="hover:underline"
              >
                {SITE.phone}
              </a>
            </ContactRow>
            <ContactRow label="WhatsApp">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsappClick("contacts")}
                className="hover:underline"
              >
                {SITE.whatsappLabel}
              </a>
              , отвечаем быстрее всего
            </ContactRow>
            <ContactRow label="E-mail">
              <a href={`mailto:${SITE.email}`} className="hover:underline">
                {SITE.email}
              </a>
              , {SITE.hours}
            </ContactRow>
          </ul>
        </div>

        {/* data-lead-form: по нему ContactBar прячет мобильную панель, пока форма на экране */}
        <div data-lead-form>
          {submitted ? (
            <div
              className="rounded-[10px] border border-line bg-paper p-[26px] text-center"
              role="status"
            >
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-green font-serif text-2xl font-bold text-white">
                ✓
              </span>
              <h3 className={`${H3} mt-5`}>Почти готово</h3>
              <p className="mt-3 text-ink2">
                {name.trim()}, мы открыли WhatsApp с готовым сообщением — просто нажмите
                «Отправить». Если окно не открылось,{" "}
                <a
                  className="font-bold text-dawn-dark underline"
                  href={whatsappLink(
                    `Здравствуйте! Хочу получить бесплатную консультацию. Имя: ${name.trim()}, телефон: ${phone.trim()}, город: ${city}, тема: ${topic}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsappClick("form")}
                >
                  нажмите здесь
                </a>{" "}
                или позвоните:{" "}
                <a
                  href={SITE.phoneHref}
                  onClick={onPhoneClick("form")}
                  className="font-bold text-ink"
                >
                  {SITE.phone}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-3.5 rounded-[10px] border border-line bg-paper p-[26px]"
            >
              <Field id="name" label="Ваше имя">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Айгерим"
                  className={INPUT}
                />
              </Field>
              <Field id="phone" label="Телефон">
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 7__ ___-__-__"
                  className={INPUT}
                />
              </Field>
              <fieldset>
                <legend className="text-[15px] font-bold">Кто вы</legend>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {WHO_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="cursor-pointer rounded-md border border-[#b9c1d3] bg-white px-2 py-3 text-center text-sm font-semibold has-checked:border-ink has-checked:bg-ink has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-dawn"
                    >
                      <input
                        type="radio"
                        name="who"
                        value={opt}
                        checked={who === opt}
                        onChange={() => setWho(opt)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field id="city" label="Город">
                <select
                  id="city"
                  name="city"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`${INPUT} ${city ? "" : "text-[#6b7280]"}`}
                >
                  <option value="" disabled>
                    Выберите город
                  </option>
                  {CITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="topic" label="Тема обращения">
                <select
                  id="topic"
                  name="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={INPUT}
                >
                  {TOPIC_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <label htmlFor="agree" className="flex cursor-pointer items-start gap-2.5 text-sm">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-green"
                />
                <span>
                  Согласен(на) на сбор и обработку персональных данных (
                  <a
                    href={POLICY_HREF}
                    target="_blank"
                    rel="noopener"
                    className="underline underline-offset-2"
                  >
                    политика конфиденциальности
                  </a>
                  )
                </span>
              </label>
              {error && (
                <p className="text-sm font-semibold text-[#b42318]" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className={`${BTN_DARK} w-full text-[17px]`}>
                Получить консультацию в WhatsApp
              </button>
              <p className="text-center text-[15px] text-ink2">
                Или позвоните:{" "}
                <a
                  href={SITE.phoneHref}
                  onClick={onPhoneClick("form")}
                  className="font-bold text-ink"
                >
                  {SITE.phone}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
