// Главная страница janastart.kz
import { HOME_NAV, JSON_LD, POLICY_HREF } from "./content";
import { Bankruptcy, Contact, Faq, Hero, Marquee, OtherServices, Process, Why } from "./sections";
import { Footer, Header, JsonLd, Page } from "./ui";

export function App() {
  return (
    <Page>
      <JsonLd data={JSON_LD} />
      <Header nav={HOME_NAV} />
      <main id="main">
        <Hero />
        <Marquee />
        <Bankruptcy />
        <OtherServices />
        <Process />
        <Why />
        <Faq />
        <Contact />
      </main>
      <Footer policyHref={POLICY_HREF} />
    </Page>
  );
}
