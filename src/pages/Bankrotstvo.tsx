// Посадочная страница под рекламу банкротства: /bankrotstvo/ (F-07).
// Хаб раздела: те же процедуры, что на главной, без блока «Другие услуги».
import { ONLAIN_HREF, POLICY_HREF, type NavItem } from "../content";
import { Bankruptcy, Contact, Faq, Hero, Process } from "../sections";
import { BANKRUPTCY_CRUMBS } from "../seo";
import { Footer, Header, Page } from "../ui";

const NAV: NavItem[] = [
  { label: "Банкротство", href: "#bankruptcy" },
  { label: "Как работаем", href: "#process" },
  { label: "Онлайн", href: ONLAIN_HREF },
  { label: "Вопросы", href: "#faq" },
  { label: "Контакты", href: "#contact" },
];

export function Bankrotstvo() {
  return (
    <Page>
      <Header nav={NAV} homeHref="/" />
      <main id="main">
        <Hero
          title="Банкротство в Казахстане: новый старт без долгов"
          tagline={null}
          lead="Помогаем гражданам, ИП и компаниям законно выйти из долгов: внесудебное и судебное банкротство, восстановление платёжеспособности. Юристы с 20-летним стажем, первая консультация бесплатно."
          crumbs={BANKRUPTCY_CRUMBS}
        />
        <Bankruptcy />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer homeHref="/" policyHref={POLICY_HREF} />
    </Page>
  );
}
