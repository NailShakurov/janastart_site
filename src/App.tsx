import { useState, type FormEvent } from "react";
import { SITE, whatsappLink } from "./site";
import { getUtm, track } from "./tracking";

const NAV = [
  { label: "Банкротство", href: "#bankruptcy" },
  { label: "Услуги", href: "#services" },
  { label: "Как работаем", href: "#process" },
  { label: "Вопросы", href: "#faq" },
  { label: "Контакты", href: "#contact" },
];

const MARQUEE = [
  "Банкротство граждан, ИП и компаний",
  "Защита от коллекторов",
  "Семейные и трудовые дела",
  "Недвижимость и наследство",
  "Бизнес и договоры",
  "Новый финансовый старт",
];

const FACTS = [
  { value: "20 лет", label: "юридической практики" },
  { value: "0 ₸", label: "первая консультация" },
  { value: "В договоре", label: "фиксированная стоимость услуг" },
];

const PROCEDURES = [
  {
    title: "Внесудебное банкротство",
    text: "Упрощённая процедура для небольших долгов при отсутствии имущества.",
  },
  {
    title: "Восстановление платёжеспособности",
    text: "Через суд: план погашения долгов, если у вас есть доход.",
  },
  {
    title: "Судебное банкротство",
    text: "Через суд: списание долгов, когда погасить их нет возможности.",
  },
];

const SERVICES = [
  {
    title: "Физические лица",
    text: "Кредиты, микрозаймы, задолженность по налогам и штрафам. Разберём, что будет с жильём и доходом, до начала работы.",
  },
  {
    title: "ИП и компании",
    text: "Реабилитация или банкротство бизнеса. Оцениваем риски для учредителей и выстраиваем работу с кредиторами.",
  },
  {
    title: "Защита от коллекторов",
    text: "Проверяем законность начислений, отвечаем на давление коллекторов и ведём переговоры с банками о реструктуризации.",
  },
];

const OTHER_SERVICES = [
  {
    title: "Семейные дела",
    text: "Развод, алименты, раздел имущества, место жительства ребёнка.",
  },
  {
    title: "Недвижимость и наследство",
    text: "Проверка сделок, споры по квартирам, вступление в наследство.",
  },
  {
    title: "Трудовые споры",
    text: "Незаконное увольнение, невыплаченная зарплата, трудовые договоры.",
  },
  {
    title: "Бизнес и договоры",
    text: "Регистрация, договоры, сопровождение ИП и ТОО, споры с контрагентами.",
  },
  {
    title: "Представительство в суде",
    text: "Подготовка исков и защита ваших интересов на всех стадиях процесса.",
  },
  {
    title: "Консультации",
    text: "Разовая оценка вашей ситуации и понятный план действий.",
  },
];

const STEPS = [
  {
    title: "Анализ ситуации",
    text: "Бесплатно разбираем долги, доходы и имущество. Говорим честно, что возможно.",
  },
  {
    title: "План и договор",
    text: "Выбираем процедуру, собираем документы, фиксируем стоимость в договоре.",
  },
  {
    title: "Сопровождение",
    text: "Подаём заявление, общаемся с кредиторами, представляем вас в суде.",
  },
  {
    title: "Новый старт",
    text: "Вы получаете результат по процедуре и понимаете, что делать дальше.",
  },
];

const WHY = [
  {
    title: "20 лет практики",
    text: "Наши юристы работают в праве два десятилетия и знают, как устроены суды и кредиторы.",
  },
  {
    title: "Честная оценка",
    text: "Если банкротство вам не нужно или не поможет, мы скажем об этом сразу.",
  },
  {
    title: "Стоимость в договоре",
    text: "Цена фиксируется до начала работы. Скрытых платежей нет.",
  },
  {
    title: "Простым языком",
    text: "Объясняем этапы и последствия так, чтобы вы понимали каждый шаг.",
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
  {
    q: "Вы работаете только с банкротством?",
    a: "Нет. Мы также ведём семейные, трудовые, имущественные и корпоративные дела и представляем клиентов в суде.",
  },
];

const WHO_OPTIONS = ["Физлицо", "ИП", "Компания"] as const;

const TOPIC_OPTIONS = [
  "Банкротство физлица",
  "Банкротство ИП или компании",
  "Долги и коллекторы",
  "Другой юридический вопрос",
] as const;

// Микроразметка LegalService (F-06). Значения берутся из site.ts.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: SITE.brand,
  url: "https://janastart.kz/",
  telephone: SITE.phoneHref.replace("tel:", ""),
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address,
    addressLocality: SITE.city,
    addressCountry: "KZ",
  },
  areaServed: SITE.city,
  openingHours: "Mo-Fr 09:00-19:00",
};

/* Общие классы по макету */
const WRAP = "mx-auto max-w-[1080px] px-5";
const SECTION = "py-[72px]";
const H2 = "text-[clamp(28px,4vw,40px)] font-bold";
const H3 = "text-[21px] font-bold";
const LEAD = "mt-3 max-w-[62ch] text-ink2";
const CARD = "rounded-[10px] border border-line bg-white p-[26px]";
const BTN = "inline-block rounded-md px-6 py-3.5 text-center font-bold transition-colors";
const BTN_MAIN = `${BTN} bg-dawn text-ink hover:bg-dawn-hover`;
const BTN_GHOST = `${BTN} border-2 border-white/50 text-white hover:bg-white/10`;
const BTN_DARK = `${BTN} bg-ink text-white hover:bg-ink2`;
const INPUT =
  "mt-1.5 block w-full rounded-md border border-[#b9c1d3] bg-white p-[13px] text-base focus:border-ink focus:outline-none";

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [who, setWho] = useState<string>(WHO_OPTIONS[0]);
  const [topic, setTopic] = useState<string>(TOPIC_OPTIONS[0]);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length < 10 || digits.length > 11 || !agree) {
      setError("Заполните имя и телефон и подтвердите согласие.");
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
      `Тема: ${topic}`,
      source ? `Источник: ${source}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    track("form_submit", { who, topic });
    window.open(whatsappLink(text), "_blank", "noopener");
    setSubmitted(true);
  };

  const onWhatsappClick = () => track("whatsapp_click");
  const onPhoneClick = () => track("phone_click");

  return (
    <div className="min-h-screen overflow-x-clip bg-paper font-sans text-ink">
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-dawn px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержанию
      </a>

      {/* Шапка */}
      <header className="sticky top-0 z-40 bg-ink text-white">
        <div className={`${WRAP} flex min-h-16 items-center justify-between gap-4`}>
          <a
            href="#top"
            className="flex items-center gap-2.5 whitespace-nowrap font-serif text-[22px] font-bold tracking-[0.02em]"
            aria-label="JANA START — на главную"
          >
            <img src="./logo-mark.png" alt="" width="34" height="45" className="h-11 w-auto" />
            <span>
              JANA <b className="text-dawn">START</b>
            </span>
          </a>
          <nav
            aria-label="Основная навигация"
            className="hidden items-center gap-[22px] text-[15px] lg:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="opacity-85 hover:underline hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a
              href={SITE.phoneHref}
              onClick={onPhoneClick}
              className="hidden whitespace-nowrap font-bold md:block"
            >
              {SITE.phone}
            </a>
            <a
              href="#contact"
              className="hidden rounded-md bg-dawn px-5 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-dawn-hover sm:inline-block"
            >
              Консультация
            </a>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md border border-white/40 lg:hidden"
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
            className="border-t border-white/15 lg:hidden"
          >
            <div className={`${WRAP} flex flex-col py-2`}>
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/10 py-4 font-serif text-lg font-bold last:border-0"
                >
                  {item.label}
                </a>
              ))}
              <a href={SITE.phoneHref} onClick={onPhoneClick} className="py-4 font-bold text-dawn">
                {SITE.phone}
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section
          id="top"
          className="relative overflow-hidden bg-ink pb-[150px] pt-[84px] text-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-420px] left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 8%, rgba(242,184,75,.95), rgba(242,184,75,.35) 14%, rgba(242,184,75,0) 38%)",
            }}
          />
          <div className={`${WRAP} relative z-10`}>
            <h1 className="max-w-[14ch] text-[clamp(38px,7vw,72px)] font-bold">
              Новый старт без долгов
            </h1>
            <p className="mt-5 max-w-[54ch] text-[19px] text-mist-light">
              Jana по-казахски значит «новый». Мы помогаем гражданам, ИП и компаниям выйти из долгов
              по закону и решаем другие юридические вопросы. Юристы с 20-летним стажем.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#contact" className={BTN_MAIN}>
                Бесплатная консультация
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsappClick}
                className={BTN_GHOST}
              >
                Написать в WhatsApp
              </a>
            </div>
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

        {/* Бегущая строка */}
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

        {/* Банкротство */}
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
                  <h3 className={H3}>{p.title}</h3>
                  <p className="mt-2 text-ink2">{p.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink2">
              Закон РК «О восстановлении платёжеспособности и банкротстве граждан Республики
              Казахстан»
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {SERVICES.map((s) => (
                <article key={s.title} className={`${CARD} flex flex-col`}>
                  <h3 className={H3}>{s.title}</h3>
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

        {/* Другие услуги */}
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

        {/* Как мы работаем */}
        <section id="process" className={SECTION}>
          <div className={WRAP}>
            <h2 className={H2}>Как мы работаем</h2>
            <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
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

        {/* Почему JANA START */}
        <section id="why" className={`${SECTION} bg-ink text-white`}>
          <div className={WRAP}>
            <h2 className={H2}>Почему JANA START</h2>
            <p className={`${LEAD} text-mist`}>Мы строим работу на четырёх правилах.</p>
            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {WHY.map((w) => (
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

        {/* FAQ */}
        <section id="faq" className={SECTION}>
          <div className={WRAP}>
            <h2 className={H2}>Частые вопросы</h2>
            <div className="mt-7 max-w-[820px] space-y-2.5">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-lg border border-line bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[22px] py-[18px] font-bold [&::-webkit-details-marker]:hidden">
                    {item.q}
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

        {/* Контакты и форма */}
        <section id="contact" className={`${SECTION} border-t border-line bg-white`}>
          <div className={`${WRAP} grid items-start gap-12 md:grid-cols-2`}>
            <div>
              <h2 className={H2}>
                Оставьте заявку —
                <br />
                <span className="text-dawn-dark">первая консультация бесплатно.</span>
              </h2>
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
                  <a href={SITE.phoneHref} onClick={onPhoneClick} className="hover:underline">
                    {SITE.phone}
                  </a>
                </ContactRow>
                <ContactRow label="WhatsApp">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onWhatsappClick}
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
                      `Здравствуйте! Хочу получить бесплатную консультацию. Имя: ${name.trim()}, телефон: ${phone.trim()}, тема: ${topic}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onWhatsappClick}
                  >
                    нажмите здесь
                  </a>{" "}
                  или позвоните:{" "}
                  <a href={SITE.phoneHref} onClick={onPhoneClick} className="font-bold text-ink">
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
                  <span>Согласен(на) на сбор и обработку персональных данных</span>
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
                  <a href={SITE.phoneHref} onClick={onPhoneClick} className="font-bold text-ink">
                    {SITE.phone}
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Подвал */}
      <footer className="bg-ink py-9 text-sm text-footer">
        <div className={WRAP}>
          <a
            href="#top"
            className="mb-2.5 inline-flex items-center gap-2.5 font-serif text-lg font-bold text-white"
          >
            <img src="./logo-mark.png" alt="" width="34" height="45" className="h-9 w-auto" />
            <span>
              JANA <span className="text-dawn">START</span>
            </span>
          </a>
          <p>
            {SITE.legalName}, БИН {SITE.bin}
          </p>
          <p className="mt-1.5">© {SITE.foundedYear} JANA START. Все права защищены.</p>
          <p className="mt-1.5">
            Сайт носит информационный характер и не является публичной офертой.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li>
      <b>{label}</b>
      <small className="block text-[15px] text-ink2">{children}</small>
    </li>
  );
}
