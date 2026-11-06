// Страница /bankrotstvo/vosstanovlenie-platezhesposobnosti/ и казахская пара: посадочная под рекламу ВП.
import { VP_HREF, VP_RU, type VpText } from "../content-vp";
import { KZ_VP_HREF, VP_KK } from "../content-vp.kk";
import { LangProvider, useContent, useLang, type Lang } from "../i18n";
import { Contact, Faq, Hero, Process, Why } from "../sections";
import { ContactBar, Footer, H2, Header, LEAD, Page, SECTION, WRAP } from "../ui";

export const VP_TEXT: Record<Lang, VpText> = { ru: VP_RU, kk: VP_KK };

function ForWhom({ v }: { v: VpText }) {
  return (
    <section className={`${SECTION} border-b border-line bg-white`}>
      <div className={WRAP}>
        <h2 className={H2}>{v.forWhom.title}</h2>
        <ul className="mt-6 max-w-[72ch] space-y-3 text-ink2">
          {v.forWhom.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="font-bold text-green">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className={LEAD}>{v.forWhom.note}</p>
      </div>
    </section>
  );
}

function Compare({ v }: { v: VpText }) {
  const [corner, ...cols] = v.compare.head;
  return (
    <section className={`${SECTION} border-b border-line bg-white`}>
      <div className={WRAP}>
        <h2 className={H2}>{v.compare.title}</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
            <thead>
              <tr>
                <th scope="col" className="border-b border-line p-3">
                  {corner}
                </th>
                {cols.map((col, i) => (
                  <th
                    key={col}
                    scope="col"
                    className={`border-b border-line p-3 font-bold ${i === cols.length - 1 ? "bg-dawn/20" : ""}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {v.compare.rows.map(([label, ...cells]) => (
                <tr key={label}>
                  <th scope="row" className="border-b border-line p-3 font-bold">
                    {label}
                  </th>
                  {cells.map((cell, i) => (
                    <td
                      key={`${label}-${i}`}
                      className={`border-b border-line p-3 text-ink2 ${i === cells.length - 1 ? "bg-dawn/20 font-bold text-ink" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={LEAD}>{v.compare.note}</p>
      </div>
    </section>
  );
}

function VosstanovlenieBody({ homeHref }: { homeHref: string }) {
  const v = VP_TEXT[useLang()];
  const c = useContent();
  return (
    <Page>
      <Header nav={c.subpageNav} homeHref={homeHref} />
      <main id="main">
        <Hero
          title={v.page.h1}
          tagline={null}
          lead={v.page.lead}
          crumbs={v.crumbs}
          note={v.page.note}
        />
        <ForWhom v={v} />
        <Why title={v.whyTitle} lead={null} items={v.why} />
        <Compare v={v} />
        <Process title={v.processTitle} steps={v.steps} className="sm:grid-cols-2 lg:grid-cols-5" />
        <Faq items={v.faq} />
        <Contact intro={v.page.cta} />
      </main>
      <Footer homeHref={homeHref} />
      <ContactBar />
    </Page>
  );
}

export function Vosstanovlenie({ lang = "ru" }: { lang?: Lang }) {
  const kk = lang === "kk";
  return (
    <LangProvider lang={lang} altHref={kk ? VP_HREF : KZ_VP_HREF}>
      <VosstanovlenieBody homeHref={kk ? "/kz/" : "/"} />
    </LangProvider>
  );
}
