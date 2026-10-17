// Страница /onlain/: юрист онлайн по всему Казахстану (раздел ТЗ «География»).
import { CITY_OPTIONS, POLICY_HREF, SUBPAGE_NAV } from "../content";
import { ONLAIN, ONLAIN_COURT, ONLAIN_FAQ, ONLAIN_STEPS, ONLAIN_WHY } from "../content-onlain";
import { Contact, Faq, Hero, Process, Why } from "../sections";
import { ONLAIN_CRUMBS } from "../seo";
import { Footer, H2, Header, Page, SECTION, WRAP } from "../ui";

export function Onlain() {
  return (
    <Page>
      <Header nav={SUBPAGE_NAV} homeHref="/" />
      <main id="main">
        <Hero
          title={ONLAIN.h1}
          tagline={null}
          lead={ONLAIN.lead}
          crumbs={ONLAIN_CRUMBS}
          note={ONLAIN.officeNote}
        />
        <Process
          title="Как мы работаем удалённо"
          steps={ONLAIN_STEPS}
          className="sm:grid-cols-2 lg:grid-cols-3"
        />
        <section className={`${SECTION} border-y border-line bg-white`}>
          <div className={WRAP}>
            <h2 className={H2}>{ONLAIN_COURT.title}</h2>
            <div className="mt-4 max-w-[72ch] space-y-3 text-ink2">
              {ONLAIN_COURT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
        <Why title="Почему это удобно" lead={null} items={ONLAIN_WHY} />
        <Faq items={ONLAIN_FAQ} />
        <Contact intro={ONLAIN.cta} defaultCity={CITY_OPTIONS[4]} />
      </main>
      <Footer homeHref="/" policyHref={POLICY_HREF} />
    </Page>
  );
}
