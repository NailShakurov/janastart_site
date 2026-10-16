// Общие классы и элементы оформления: шапка, подвал, поля формы.
import { useState, type ReactNode } from "react";
import type { NavItem } from "./content";
import { SITE } from "./site";
import { track } from "./tracking";

export const WRAP = "mx-auto max-w-[1080px] px-5";
export const SECTION = "py-[72px]";
export const H2 = "text-[clamp(28px,4vw,40px)] font-bold";
export const H3 = "text-[21px] font-bold";
export const LEAD = "mt-3 max-w-[62ch] text-ink2";
export const CARD = "rounded-[10px] border border-line bg-white p-[26px]";
const BTN = "inline-block rounded-md px-6 py-3.5 text-center font-bold transition-colors";
export const BTN_MAIN = `${BTN} bg-dawn text-ink hover:bg-dawn-hover`;
export const BTN_GHOST = `${BTN} border-2 border-white/50 text-white hover:bg-white/10`;
export const BTN_DARK = `${BTN} bg-ink text-white hover:bg-ink2`;
export const INPUT =
  "mt-1.5 block w-full rounded-md border border-[#b9c1d3] bg-white p-[13px] text-base focus:border-ink focus:outline-none";

export const onWhatsappClick = () => track("whatsapp_click");
export const onPhoneClick = () => track("phone_click");

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-paper font-sans text-ink">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-dawn px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержанию
      </a>
      {children}
    </div>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

function LogoMark({ className }: { className: string }) {
  return <img src="/logo-mark.png" alt="" width="34" height="45" className={className} />;
}

export function Header({ nav, homeHref = "#top" }: { nav: NavItem[]; homeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-ink text-white">
      <div className={`${WRAP} flex min-h-16 items-center justify-between gap-4`}>
        <a
          href={homeHref}
          className="flex items-center gap-2.5 whitespace-nowrap font-serif text-[22px] font-bold tracking-[0.02em]"
          aria-label="JANA START — на главную"
        >
          <LogoMark className="h-11 w-auto" />
          <span>
            JANA <b className="text-dawn">START</b>
          </span>
        </a>
        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-[22px] text-[15px] lg:flex"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="opacity-85 hover:underline hover:opacity-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={SITE.phoneHref}
            onClick={onPhoneClick}
            className="hidden whitespace-nowrap font-bold md:block"
          >
            {SITE.phone}
          </a>
          <a
            href="#contact"
            className="hidden rounded-md bg-dawn px-5 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-dawn-hover sm:inline-block"
          >
            Консультация
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md border border-white/40 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M3 3l12 12M15 3L3 15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5h14M2 9h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Мобильная навигация"
          className="border-t border-white/15 lg:hidden"
        >
          <div className={`${WRAP} flex flex-col py-2`}>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 font-serif text-lg font-bold last:border-0"
              >
                {item.label}
              </a>
            ))}
            <a href={SITE.phoneHref} onClick={onPhoneClick} className="py-4 font-bold text-dawn">
              {SITE.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer({
  homeHref = "#top",
  policyHref,
}: {
  homeHref?: string;
  policyHref: string;
}) {
  return (
    <footer className="bg-ink py-9 text-sm text-footer">
      <div className={WRAP}>
        <a
          href={homeHref}
          className="mb-2.5 inline-flex items-center gap-2.5 font-serif text-lg font-bold text-white"
        >
          <LogoMark className="h-9 w-auto" />
          <span>
            JANA <span className="text-dawn">START</span>
          </span>
        </a>
        <p>
          {SITE.legalName}, БИН {SITE.bin}
        </p>
        <p className="mt-1.5">© {SITE.foundedYear} JANA START. Все права защищены.</p>
        <p className="mt-1.5">
          Сайт носит информационный характер и не является публичной офертой.
        </p>
        <p className="mt-1.5">
          <a href={policyHref} className="underline underline-offset-2 hover:text-white">
            Политика конфиденциальности
          </a>
        </p>
      </div>
    </footer>
  );
}

export function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li>
      <b>{label}</b>
      <small className="block text-[15px] text-ink2">{children}</small>
    </li>
  );
}
