// Блоки страниц: hero, бегущая строка, банкротство, услуги, этапы, FAQ, контакты с формой.
import { useState, type FormEvent, type ReactNode } from "react";
import { useContent, useLang, useText } from "./i18n";
import { buildLeadPayload, buildLeadText, isValidPhone } from "./lead";
import type { Crumb } from "./seo";
import { SITE, whatsappLink } from "./site";
import { track } from "./tracking";
import { UI_RU } from "./ui-text";
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
  title = UI_RU.pages.home.title,
  tagline = UI_RU.pages.home.tagline,
  lead = UI_RU.pages.home.lead,
  crumbs,
  subline,
  kzNote,
  note,
}: {
  title?: string;
  tagline?: string | null;
  lead?: string;
  crumbs?: Crumb[];
  /** Строка сразу под слоганом или заголовком (география на главной). */
  subline?: ReactNode;
  /** «Консультация на казахском» — преимущество на казахских страницах, над вступлением. */
  kzNote?: string;
  /** Мелкая строка под кнопками (адрес офиса на /onlain/). */
  note?: string;
}) {
  const t = useText();
  const c = useContent();
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
        {kzNote && <p className="mt-4 text-[17px] font-bold text-dawn">{kzNote}</p>}
        <p className="mt-5 max-w-[54ch] text-[19px] text-mist-light">{lead}</p>
        {/* data-hero-cta: пока кнопки видны, нижняя панель ContactBar прячется и их не перекрывает */}
        <div data-hero-cta className="mt-7 flex flex-wrap gap-3">
          <a href="#contact" className={BTN_MAIN}>
            {t.hero.consult}
          </a>
          <a
            href={whatsappLink(t.whatsapp.greeting)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsappClick("hero")}
            className={BTN_GHOST}
          >
            {t.hero.whatsapp}
          </a>
        </div>
        <p className="mt-3 max-w-[62ch] text-[13px] text-mist">
          {t.hero.noticeBefore}
          <a href={c.policyHref} className="underline">
            {t.hero.noticeLink}
          </a>
          {t.hero.noticeAfter}
        </p>
        {note && <p className="mt-5 max-w-[62ch] text-[15px] text-mist">{note}</p>}
        <ul className="mt-11 flex flex-wrap gap-x-9 gap-y-3">
          {c.facts.map((f) => (
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
  const { geoLine, onlainHref } = useContent();
  const online = (
    <a href={onlainHref} className="underline underline-offset-4 hover:text-white">
      {geoLine.online}
    </a>
  );
  return (
    <>
      {geoLine.office}
      <span aria-hidden="true" className="mx-2 text-dawn">
        ·
      </span>
      {online}
    </>
  );
}

export function Marquee() {
  const { marquee } = useContent();
  return (
    <div
      className="overflow-hidden border-b border-line bg-white py-3.5 text-ink2"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.15em] motion-reduce:animate-none">
        {[...marquee, ...marquee].map((item, i) => (
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
  const t = useText().bankruptcy;
  const c = useContent();
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
            <h2 className={H2}>{t.title}</h2>
            <p className={LEAD}>{t.lead}</p>
          </div>
          <span className="hidden shrink-0 text-sm font-bold text-ink2 sm:block">{t.count}</span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {c.procedures.map((p) => (
            <article key={p.title} className={`${CARD} border-t-[5px] border-t-dawn`}>
              <h3 className={H3}>{cardTitle(p)}</h3>
              <p className="mt-2 text-ink2">{p.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink2">{t.law}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {c.services.map((s) => (
            <article key={s.title} className={`${CARD} flex flex-col`}>
              <h3 className={H3}>{cardTitle(s)}</h3>
              <p className="mt-2 flex-1 text-ink2">{s.text}</p>
              <a
                href="#contact"
                className="mt-4 inline-block font-bold text-dawn-dark hover:underline"
              >
                {t.discuss}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OtherServices() {
  const t = useText().otherServices;
  const { otherServices } = useContent();
  return (
    <section id="services" className={`${SECTION} border-y border-line bg-white`}>
      <div className={WRAP}>
        <h2 className={H2}>{t.title}</h2>
        <p className={LEAD}>{t.lead}</p>
        <dl className="mt-7 grid gap-x-10 md:grid-cols-2">
          {otherServices.map((s) => (
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

export function Process(props: {
  title?: string;
  lead?: string | null;
  steps?: readonly { title: string; text: string }[];
  /** Классы сетки: колонки под число шагов. */
  className?: string;
}) {
  const t = useText();
  const c = useContent();
  const {
    title = t.process.title,
    lead = c.processLead,
    steps = c.steps,
    className = "sm:grid-cols-2 lg:grid-cols-4",
  } = props;
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

export function Why(props: {
  title?: string;
  lead?: string | null;
  items?: readonly { title: string; text: string }[];
}) {
  const t = useText();
  const c = useContent();
  const { title = t.why.title, lead = t.why.lead, items = c.why } = props;
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
export function Faq(props: { items?: readonly { q: string; a: string }[] }) {
  const t = useText();
  const c = useContent();
  const { items = c.faq } = props;
  return (
    <section id="faq" className={SECTION}>
      <div className={WRAP}>
        <h2 className={H2}>{t.faq.title}</h2>
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

export function Contact(props: {
  /** Призыв к действию под заголовком формы. */
  intro?: string;
}) {
  const t = useText();
  const c = useContent();
  const lang = useLang();
  const { intro = t.contact.intro } = props;
  const [phone, setPhone] = useState("");
  const [showConsent, setShowConsent] = useState(false);
  // Ловушка для ботов: поле скрыто от людей, заполненное значение отбрасывает приёмник.
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setError(t.form.error);
      return;
    }
    setError(null);
    const text = buildLeadText(t.whatsapp, phone.trim());
    // Копия заявки в Telegram — на случай, если клиент не нажмёт «Отправить» в WhatsApp.
    // keepalive — запрос доживает до открытия новой вкладки; text/plain — без preflight.
    // Worker отвечает с CORS: при ошибке показываем посетителю номер WhatsApp.
    if (SITE.leadEndpoint) {
      fetch(SITE.leadEndpoint, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(buildLeadPayload(phone.trim(), { website, lang })),
      })
        .then((res) => {
          if (!res.ok) setSendFailed(true);
        })
        .catch(() => setSendFailed(true));
    }
    // Событие уходит в dataLayer до открытия WhatsApp. Задержка не нужна: wa.me
    // открывается в новой вкладке, страница с формой остаётся и тег успевает отправиться.
    track("form_submit");
    window.open(whatsappLink(text), "_blank", "noopener");
    setSubmitted(true);
  };

  return (
    <section id="contact" className={`${SECTION} border-t border-line bg-white`}>
      <div className={`${WRAP} grid items-start gap-12 md:grid-cols-2`}>
        <div>
          <h2 className={H2}>
            {t.contact.title1}
            <br />
            <span className="text-dawn-dark">{t.contact.title2}</span>
          </h2>
          {intro && <p className={LEAD}>{intro}</p>}
          <ul className="mt-6 space-y-4">
            <ContactRow label={t.contact.address}>
              {t.site.address}
              {SITE.addressNote && (
                <>
                  <br />
                  {SITE.addressNote}
                </>
              )}
            </ContactRow>
            <ContactRow label={t.contact.phone}>
              <a
                href={SITE.phoneHref}
                onClick={onPhoneClick("contacts")}
                className="hover:underline"
              >
                {SITE.phone}
              </a>
            </ContactRow>
            <ContactRow label={t.contact.whatsapp}>
              <a
                href={whatsappLink(t.whatsapp.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsappClick("contacts")}
                className="hover:underline"
              >
                {SITE.whatsappLabel}
              </a>
              {t.contact.whatsappNote}
            </ContactRow>
            <ContactRow label={t.contact.email}>
              <a href={`mailto:${SITE.email}`} className="hover:underline">
                {SITE.email}
              </a>
              , {t.site.hours}
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
              <h3 className={`${H3} mt-5`}>{t.done.title}</h3>
              <p className="mt-3 text-ink2">
                {t.done.text}
                <a
                  className="font-bold text-dawn-dark underline"
                  href={whatsappLink(buildLeadText(t.whatsapp, phone.trim()))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsappClick("form")}
                >
                  {t.done.link}
                </a>{" "}
                {t.done.orCall}{" "}
                <a
                  href={SITE.phoneHref}
                  onClick={onPhoneClick("form")}
                  className="font-bold text-ink"
                >
                  {SITE.phone}
                </a>
                .
              </p>
              {sendFailed && (
                <p className="mt-3 text-sm font-semibold text-[#b42318]" role="alert">
                  {t.done.sendError}{" "}
                  <a
                    href={whatsappLink(buildLeadText(t.whatsapp, phone.trim()))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onWhatsappClick("form")}
                    className="underline"
                  >
                    {SITE.whatsappLabel}
                  </a>
                </p>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-3.5 rounded-[10px] border border-line bg-paper p-[26px]"
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] size-px opacity-0"
              />
              <Field id="phone" label={t.form.phone}>
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
              {/* Согласие — отправкой формы, без галочки (ответ юриста 30.10.2026). */}
              <p className="text-sm">
                {t.form.consentBefore}
                <button
                  type="button"
                  aria-expanded={showConsent}
                  aria-controls="consent-doc"
                  onClick={() => setShowConsent((v) => !v)}
                  className="cursor-pointer underline underline-offset-2"
                >
                  {t.form.consentLink}
                </button>
                {t.form.consentMiddle}
                <a
                  href={c.policyHref}
                  target="_blank"
                  rel="noopener"
                  className="underline underline-offset-2"
                >
                  {t.form.policyLink}
                </a>
                {t.form.consentAfter}
              </p>
              {showConsent && (
                <div
                  id="consent-doc"
                  className="max-h-64 overflow-y-auto rounded-md border border-line bg-white p-3 text-sm text-ink2"
                >
                  <p className="font-bold text-ink">{t.consentDoc.title}</p>
                  {t.consentDoc.items.map((item) => (
                    <p key={item} className="mt-2">
                      {item}
                    </p>
                  ))}
                </div>
              )}
              {error && (
                <p className="text-sm font-semibold text-[#b42318]" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className={`${BTN_DARK} w-full text-[17px]`}>
                {t.form.submit}
              </button>
              <p className="text-center text-[15px] text-ink2">
                {t.form.orCall}{" "}
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
