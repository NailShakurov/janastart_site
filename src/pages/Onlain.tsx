// Страница /onlain/ и /kz/onlain/: юрист онлайн по всему Казахстану (раздел ТЗ «География»).
import { ONLAIN_RU, type OnlainText } from "../content-onlain";
import { ONLAIN_KK } from "../content-onlain.kk";
import { LangProvider, useContent, useLang, type Lang } from "../i18n";
import { Contact, Faq, Hero, Process, Why } from "../sections";
import { ContactBar, Footer, H2, Header, Page, SECTION, WRAP } from "../ui";

export const ONLAIN_TEXT: Record<Lang, OnlainText> = { ru: ONLAIN_RU, kk: ONLAIN_KK };

function OnlainBody({ homeHref }: { homeHref: string }) {
  const o = ONLAIN_TEXT[useLang()];
  const c = useContent();
  return (
    <Page>
      <Header nav={c.subpageNav} homeHref={homeHref} />
      <main id="main">
        <Hero
          title={o.page.h1}
          tagline={null}
          lead={o.page.lead}
          crumbs={o.crumbs}
          note={o.page.officeNote}
        />
        <Process title={o.processTitle} steps={o.steps} className="sm:grid-cols-2 lg:grid-cols-3" />
        <section className={`${SECTION} border-y border-line bg-white`}>
          <div className={WRAP}>
            <h2 className={H2}>{o.court.title}</h2>
            <div className="mt-4 max-w-[72ch] space-y-3 text-ink2">
              {o.court.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
        <Why title={o.whyTitle} lead={null} items={o.why} />
        <Faq items={o.faq} />
        <Contact intro={o.page.cta} />
      </main>
      <Footer homeHref={homeHref} />
      <ContactBar />
    </Page>
  );
}

export function Onlain({ lang = "ru" }: { lang?: Lang }) {
  const kk = lang === "kk";
  return (
    <LangProvider lang={lang} altHref={kk ? "/onlain/" : "/kz/onlain/"}>
      <OnlainBody homeHref={kk ? "/kz/" : "/"} />
    </LangProvider>
  );
}
