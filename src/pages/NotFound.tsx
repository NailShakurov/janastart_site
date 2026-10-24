// Страница 404: GitHub Pages отдаёт dist/404.html с кодом 404 для несуществующих адресов.
import { HOME_NAV } from "../content";
import { ContactBar, Footer, H2, Header, Page, WRAP, BTN_MAIN } from "../ui";

export function NotFound() {
  return (
    <Page>
      <Header nav={HOME_NAV} homeHref="/" />
      <main id="main">
        <section className={`${WRAP} py-24`}>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-ink2">Ошибка 404</p>
          <h1 className={`${H2} mt-2`}>Страница не найдена</h1>
          <p className="mt-4 max-w-[54ch] text-ink2">
            Такого адреса на сайте нет. Возможно, ссылка устарела или в ней опечатка.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/" className={BTN_MAIN}>
              На главную
            </a>
            <a
              href="/bankrotstvo/"
              className="inline-block rounded-md border-2 border-ink px-6 py-3.5 font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Банкротство
            </a>
          </div>
        </section>
      </main>
      <Footer homeHref="/" />
      <ContactBar />
    </Page>
  );
}
