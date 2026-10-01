import { useState, type FormEvent } from "react";
import { SITE, whatsappLink } from "./site";

const NAV = [
  { label: "Услуги", href: "#services" },
  { label: "Процедуры", href: "#procedures" },
  { label: "Как работаем", href: "#process" },
  { label: "Вопросы", href: "#faq" },
  { label: "Контакты", href: "#contact" },
];

const MARQUEE = [
  "Защита от коллекторов",
  "Физлица и ИП",
  "Юридические лица",
  "Списание долгов по закону РК",
  "Единственное жильё остаётся у вас",
  "Новый финансовый старт",
];

const SERVICES = [
  {
    num: "01",
    title: "Физические лица",
    tone: "card",
    text: "Банкротство граждан по закону РК: кредиты, микрозаймы, задолженность по налогам и штрафам. Сохраняем единственное жильё и средства на жизнь.",
  },
  {
    num: "02",
    title: "Юрлица и ИП",
    tone: "lime",
    text: "Реабилитация или банкротство компании. Минимизируем риски субсидиарной ответственности учредителей и выстраиваем прозрачную работу с кредиторами.",
  },
  {
    num: "03",
    title: "Досудебная защита",
    tone: "card",
    text: "Останавливаем давление коллекторов, проверяем законность начислений, ведём переговоры с банками о реструктуризации.",
  },
] as const;

const PROCEDURES = [
  {
    title: "Внесудебное банкротство",
    text: "Через портал eGov — для небольших долгов при отсутствии имущества.",
  },
  {
    title: "Восстановление платёжеспособности",
    text: "Через суд — план погашения долгов на срок до 5 лет при наличии дохода.",
  },
  {
    title: "Судебное банкротство",
    text: "Через суд — списание долгов, когда погасить их нет возможности.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Анализ ситуации",
    text: "Бесплатно разбираем долги, доходы и имущество. Говорим честно, подходит ли вам банкротство.",
  },
  {
    n: "2",
    title: "Выбор процедуры",
    text: "Подбираем процедуру, собираем документы и фиксируем стоимость в договоре.",
  },
  {
    n: "3",
    title: "Сопровождение",
    text: "Подаём заявление, общаемся с кредиторами и представляем вас в суде.",
  },
  {
    n: "4",
    title: "Новый старт",
    text: "Долги списаны или реструктурированы. Вы начинаете с чистого листа.",
    accent: true,
  },
];

const FAQ = [
  {
    q: "Кому подходит банкротство?",
    a: "Гражданам, ИП и компаниям, которые не могут исполнять обязательства перед кредиторами. Подходящая процедура зависит от суммы долга, просрочки, доходов и имущества — это мы определяем на бесплатной консультации.",
  },
  {
    q: "Заберут ли у меня квартиру?",
    a: "Единственное жильё, на которое не оформлен залог, по закону, как правило, сохраняется за должником. Ипотечное жильё и прочее имущество оцениваются индивидуально — расскажем о рисках заранее.",
  },
  {
    q: "Сколько длится процедура?",
    a: "Внесудебное банкротство — несколько месяцев. Судебные процедуры занимают больше времени и зависят от суда и кредиторов. Точные сроки называем после анализа дела.",
  },
  {
    q: "Какие последствия после банкротства?",
    a: "Ограничения на новые кредиты и выезд на время процедуры, а также ограничение на повторное банкротство в течение нескольких лет. Подробно объясняем все последствия до начала работы.",
  },
  {
    q: "Сколько стоят ваши услуги?",
    a: "Первая консультация бесплатна. Стоимость сопровождения зависит от процедуры и сложности дела и фиксируется в договоре — без скрытых платежей.",
  },
];

const MAX = "mx-auto max-w-7xl px-4 sm:px-5";

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [who, setWho] = useState("Физлицо");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Укажите имя и номер телефона — иначе мы не сможем связаться с вами.");
      return;
    }
    if (!agree) {
      setError("Нужно согласие на обработку персональных данных.");
      return;
    }
    setError(null);
    const text = `Здравствуйте! Хочу консультацию по банкротству.\nИмя: ${name.trim()}\nТелефон: ${phone.trim()}\nКто: ${who}`;
    window.open(whatsappLink(text), "_blank", "noopener");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-paper font-sans text-brand">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-brand px-4 py-2 text-lime focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержанию
      </a>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b-2 border-brand/10 bg-paper/90 backdrop-blur">
        <div className={`${MAX} flex items-center justify-between gap-4 py-3`}>
          <a href="#top" className="flex items-center gap-3" aria-label="JanaStart — на главную">
            <Logo />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight">
                Jana<span className="text-accent">Start</span>
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-brand/70">
                {SITE.tagline}
              </span>
            </span>
          </a>
          <nav
            aria-label="Основная навигация"
            className="hidden items-center gap-7 text-sm font-semibold lg:flex"
          >
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="py-2 hover:text-accent">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={SITE.phoneHref} className="hidden text-sm font-bold tracking-tight xl:block">
              {SITE.phone}
            </a>
            <a
              href="#contact"
              className="hidden rounded-full bg-accent-strong px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_0_var(--color-brand)] transition-colors hover:bg-brand hover:text-lime sm:inline-block"
            >
              Консультация
            </a>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border-2 border-brand lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M3 3l12 12M15 3L3 15"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M2 5h14M2 9h14M2 13h14"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Мобильная навигация"
            className="border-t-2 border-brand/10 lg:hidden"
          >
            <div className={`${MAX} flex flex-col py-2`}>
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-brand/10 py-4 font-display text-lg font-bold last:border-0"
                >
                  {item.label}
                </a>
              ))}
              <a href={SITE.phoneHref} className="py-4 font-bold text-accent-strong">
                {SITE.phone}
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section id="top" className="relative">
          <div className={`${MAX} grid items-end gap-10 pb-12 pt-12 sm:pt-16 lg:grid-cols-12`}>
            <div className="lg:col-span-7">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]">
                <span className="size-2 rounded-full bg-accent" />
                Jana — значит «новый»
              </div>
              <h1
                className="font-display font-bold leading-[0.95] tracking-tight"
                style={{ fontSize: "clamp(2.5rem, 6.4vw, 5rem)" }}
              >
                Долги <span className="text-accent">—</span>
                <br />
                <span className="whitespace-nowrap">не приговор.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg font-medium leading-snug text-brand/75 md:text-xl">
                JanaStart помогает гражданам, ИП и компаниям законно выйти из долгов по процедурам
                банкротства Республики Казахстан. Бесплатный анализ ситуации и сопровождение — от
                первой консультации до решения.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <a
                  href="#contact"
                  className="rounded-full bg-brand px-8 py-5 text-center font-bold text-lime shadow-[6px_6px_0_0_var(--color-accent)] transition-transform hover:-translate-y-0.5"
                >
                  Бесплатная консультация →
                </a>
                <a
                  href="#process"
                  className="rounded-full border-2 border-brand px-8 py-5 text-center font-bold transition-colors hover:bg-brand hover:text-paper"
                >
                  Как это работает
                </a>
              </div>
            </div>

            <div id="procedures" className="scroll-mt-24 lg:col-span-5">
              <div className="rounded-[28px] bg-brand p-7 text-paper shadow-[8px_8px_0_0_var(--color-lime)]">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-lime">
                  3 процедуры по закону РК
                </p>
                <ol className="space-y-5">
                  {PROCEDURES.map((p, i) => (
                    <li key={p.title} className="flex gap-4">
                      <span className="w-7 shrink-0 font-display text-3xl font-bold leading-none text-accent">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold leading-tight">{p.title}</p>
                        <p className="mt-1 text-sm leading-snug text-paper/75">{p.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 border-t border-white/15 pt-4 text-xs leading-snug text-paper/65">
                  Закон РК «О восстановлении платёжеспособности и банкротстве граждан Республики
                  Казахстан»
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee strip */}
        <div className="overflow-hidden bg-brand py-4 text-lime" aria-hidden="true">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm font-bold uppercase tracking-[0.15em] motion-reduce:animate-none">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                {item}
                <span>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <section id="services" className={`${MAX} scroll-mt-20 py-16 sm:py-20`}>
          <div className="mb-9 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Что мы берём на себя
            </h2>
            <span className="hidden text-sm font-bold text-brand/60 sm:block">03 направления</span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {SERVICES.map((s) => (
              <article
                key={s.num}
                className={
                  s.tone === "lime"
                    ? "flex flex-col rounded-[26px] bg-lime p-7 transition-transform hover:-translate-y-1"
                    : "flex flex-col rounded-[26px] border-2 border-brand/10 bg-white p-7 transition-all hover:-translate-y-1 hover:border-accent"
                }
              >
                <div
                  className={`mb-4 text-sm font-bold ${s.tone === "lime" ? "text-brand" : "text-accent-strong"}`}
                >
                  {s.num}
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="flex-1 text-[15px] leading-snug text-brand/80">{s.text}</p>
                <a
                  href="#contact"
                  className={`mt-5 inline-block py-1 text-sm font-bold ${s.tone === "lime" ? "text-brand" : "text-accent-strong"}`}
                >
                  Обсудить мою ситуацию →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Process */}
        <section id="process" className="scroll-mt-20 bg-brand py-16 text-paper sm:py-20">
          <div className={MAX}>
            <h2 className="mb-10 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Как вы выходите из долгов
            </h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <li
                  key={step.n}
                  className={
                    step.accent
                      ? "rounded-2xl bg-accent-strong p-6 text-white"
                      : "rounded-2xl border border-white/10 bg-white/5 p-6"
                  }
                >
                  <span
                    className={`grid size-9 place-items-center rounded-full text-sm font-bold ${
                      step.accent ? "bg-white text-accent-strong" : "bg-lime text-brand"
                    }`}
                  >
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-snug ${step.accent ? "text-white" : "text-paper/75"}`}
                  >
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={`${MAX} scroll-mt-20 py-16 sm:py-20`}>
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:col-span-4">
              Частые вопросы
            </h2>
            <div className="space-y-3 lg:col-span-8">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border-2 border-brand/10 bg-white open:border-brand/25"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-lime text-xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-brand/80">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA + Contact */}
        <section id="contact" className="scroll-mt-20 border-t-2 border-brand/10 py-16 sm:py-20">
          <div className={`${MAX} grid items-center gap-10 lg:grid-cols-2`}>
            <div>
              <h2 className="font-display text-3xl font-bold leading-[1] tracking-tight sm:text-4xl md:text-5xl">
                Оставьте заявку —
                <br />
                <span className="text-accent">первая консультация бесплатно.</span>
              </h2>
              <ul className="mt-8 space-y-4">
                <ContactRow badge="А" title={SITE.address} note={SITE.addressNote} />
                <ContactRow
                  badge="Т"
                  title={<a href={SITE.phoneHref}>{SITE.phone}</a>}
                  note={
                    <>
                      <a
                        href={`mailto:${SITE.email}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {SITE.email}
                      </a>{" "}
                      · {SITE.hours}
                    </>
                  }
                />
                <ContactRow
                  badge="W"
                  title={
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                      {SITE.whatsappLabel}
                    </a>
                  }
                  note="WhatsApp · отвечаем быстрее всего"
                />
              </ul>
            </div>

            {submitted ? (
              <div
                className="rounded-[28px] border-2 border-brand/10 bg-white p-10 text-center"
                role="status"
              >
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-lime font-display text-2xl font-bold">
                  ✓
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">
                  Почти готово
                </h3>
                <p className="mt-3 text-sm leading-snug text-brand/80">
                  {name.trim()}, мы открыли WhatsApp с готовым сообщением — просто нажмите
                  «Отправить». Если окно не открылось,{" "}
                  <a
                    className="font-bold text-accent-strong underline"
                    href={whatsappLink(
                      `Здравствуйте! Хочу консультацию по банкротству. Имя: ${name.trim()}, телефон: ${phone.trim()}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    нажмите здесь
                  </a>{" "}
                  или позвоните:{" "}
                  <a href={SITE.phoneHref} className="font-bold">
                    {SITE.phone}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4 rounded-[28px] border-2 border-brand/10 bg-white p-6 sm:p-7"
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
                  <legend className="text-xs font-bold uppercase tracking-wider text-brand/70">
                    Кто вы
                  </legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["Физлицо", "ИП", "Компания"].map((opt) => (
                      <label
                        key={opt}
                        className="cursor-pointer rounded-xl border-2 border-brand/15 px-2 py-3 text-center text-sm font-semibold has-checked:border-brand has-checked:bg-brand has-checked:text-lime has-focus-visible:outline-2 has-focus-visible:outline-accent"
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
                <label htmlFor="agree" className="flex cursor-pointer items-start gap-3 py-1">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 size-5 shrink-0 accent-accent"
                  />
                  <span className="text-xs leading-snug text-brand/70">
                    Согласен(на) на сбор и обработку персональных данных
                  </span>
                </label>
                {error && (
                  <p className="text-sm font-semibold text-accent-strong" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full rounded-full bg-accent-strong py-4 font-bold text-white shadow-[4px_4px_0_0_var(--color-brand)] transition-colors hover:bg-brand hover:text-lime"
                >
                  Получить консультацию в WhatsApp
                </button>
                <p className="text-center text-xs text-brand/60">
                  Или позвоните:{" "}
                  <a href={SITE.phoneHref} className="font-bold text-brand">
                    {SITE.phone}
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand text-paper">
        <div
          className={`${MAX} flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between`}
        >
          <div className="flex items-center gap-3">
            <Logo inverted />
            <div className="text-sm leading-snug">
              <p className="font-display font-bold">
                Jana<span className="text-lime">Start</span>
              </p>
              <p className="text-paper/65">
                {SITE.legalName} · БИН {SITE.bin}
              </p>
            </div>
          </div>
          <div className="text-xs leading-relaxed text-paper/65 md:text-right">
            <p>© {SITE.foundedYear} JanaStart. Все права защищены.</p>
            <p>Сайт носит информационный характер и не является публичной офертой.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const INPUT =
  "mt-1 w-full rounded-xl border-2 border-brand/15 bg-white px-4 py-3 text-base focus:border-accent focus:outline-none";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-brand/70">
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactRow({
  badge,
  title,
  note,
}: {
  badge: string;
  title: React.ReactNode;
  note: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-brand font-bold text-lime"
      >
        {badge}
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-sm text-brand/70">{note}</p>
      </div>
    </li>
  );
}

function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 items-center justify-center rounded-full font-display text-base font-bold ${
        inverted ? "bg-lime text-brand" : "bg-brand text-lime"
      }`}
    >
      J<span className="text-accent">S</span>
    </span>
  );
}
