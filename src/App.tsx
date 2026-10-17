// Главная страница janastart.kz
import { HOME_NAV, POLICY_HREF } from "./content";
import { Bankruptcy, Contact, Faq, Hero, Marquee, OtherServices, Process, Why } from "./sections";
import { Footer, Header, Page } from "./ui";

export function App() {
  return (
    <Page>
      <Header nav={HOME_NAV} />
      <main id="main">
        <Hero />
        <Marquee />
        <Bankruptcy linkCards />
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
