// Главная страница janastart.kz: по-русски (/) и по-казахски (/kz/, lang="kk").
import { LangProvider, useContent, useText, type Lang } from "./i18n";
import {
  Bankruptcy,
  Contact,
  Faq,
  GeoLine,
  Hero,
  Marquee,
  OtherServices,
  Process,
  Why,
} from "./sections";
import { ContactBar, Footer, Header, Page } from "./ui";

function HomeBody() {
  const t = useText();
  const c = useContent();
  return (
    <Page>
      <Header nav={c.nav} />
      <main id="main">
        <Hero {...t.pages.home} subline={<GeoLine />} />
        <Marquee />
        <Bankruptcy linkCards />
        <OtherServices />
        <Process />
        <Why />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <ContactBar />
    </Page>
  );
}

export function App({ lang = "ru" }: { lang?: Lang }) {
  return (
    <LangProvider lang={lang} altHref={lang === "kk" ? "/" : "/kz/"}>
      <HomeBody />
    </LangProvider>
  );
}
