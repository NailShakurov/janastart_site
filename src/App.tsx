// Главная страница janastart.kz
import { HOME_NAV, POLICY_HREF } from "./content";
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

export function App() {
  return (
    <Page>
      <Header nav={HOME_NAV} />
      <main id="main">
        <Hero subline={<GeoLine />} />
        <Marquee />
        <Bankruptcy linkCards />
        <OtherServices />
        <Process />
        <Why />
        <Faq />
        <Contact />
      </main>
      <Footer policyHref={POLICY_HREF} />
      <ContactBar />
    </Page>
  );
}
