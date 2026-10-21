// Посадочная страница под рекламу банкротства: /bankrotstvo/ и /kz/bankrotstvo/ (F-07).
// Хаб раздела: те же процедуры, что на главной, без блока «Другие услуги».
import { POLICY_HREF } from "../content";
import { LangProvider, useContent, useText, type Lang } from "../i18n";
import { Bankruptcy, Contact, Faq, Hero, Process } from "../sections";
import { ContactBar, Footer, Header, Page } from "../ui";

function BankrotstvoBody({ homeHref }: { homeHref: string }) {
  const t = useText();
  const c = useContent();
  return (
    <Page>
      <Header nav={c.bankruptcyNav} homeHref={homeHref} />
      <main id="main">
        <Hero {...t.pages.bankrotstvo} tagline={null} crumbs={c.bankruptcyCrumbs} />
        <Bankruptcy />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer homeHref={homeHref} policyHref={POLICY_HREF} />
      <ContactBar />
    </Page>
  );
}

export function Bankrotstvo({ lang = "ru" }: { lang?: Lang }) {
  const kk = lang === "kk";
  return (
    <LangProvider lang={lang} altHref={kk ? "/bankrotstvo/" : "/kz/bankrotstvo/"}>
      <BankrotstvoBody homeHref={kk ? "/kz/" : "/"} />
    </LangProvider>
  );
}
