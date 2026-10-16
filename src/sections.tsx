// Блоки страниц: hero, бегущая строка, банкротство, услуги, этапы, FAQ, контакты с формой.
import { useState, type FormEvent } from "react";
import {
  FACTS,
  FAQ,
  MARQUEE,
  OTHER_SERVICES,
  POLICY_HREF,
  PROCEDURES,
  SERVICES,
  STEPS,
  TOPIC_OPTIONS,
  WHO_OPTIONS,
  WHY,
} from "./content";
import { SITE, whatsappLink } from "./site";
import { getUtm, track } from "./tracking";
import {
  BTN_DARK,
  BTN_GHOST,
  BTN_MAIN,
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

export function Hero({
  title = "Новый старт без долгов",
  lead = "Jana по-казахски значит «новый». Мы помогаем гражданам, ИП и компаниям выйти из долгов по закону и решаем другие юридические вопросы. Юристы с 20-летним стажем.",
}: {
  title?: string;
  lead?: string;
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
        <h1 className="max-w-[14ch] text-[clamp(38px,7vw,72px)] font-bold">{title}</h1>
        <p className="mt-5 max-w-[54ch] text-[19px] text-mist-light">{lead}</p>
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

export function Bankruptcy() {
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
              <h3 className={H3}>{p.title}</h3>
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

export function Process() {
  return (
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
  );
}

export function Why() {
  return (
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
  );
}

export function Faq() {
  return (
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
  );
}

export function Contact() {
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

  return (
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
              {name.trim()}, мы открыли WhatsApp с готовым сообщением — просто нажмите «Отправить».
              Если окно не открылось,{" "}
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
              <a href={SITE.phoneHref} onClick={onPhoneClick} className="font-bold text-ink">
                {SITE.phone}
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
