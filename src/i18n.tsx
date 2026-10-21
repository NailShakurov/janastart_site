// Язык страницы. Задаётся один раз при монтировании (<App lang="kk" />) и раздаётся блокам
// через контекст. Значение по умолчанию — русский, поэтому /onlain/, /politika/ и 404
// работают без провайдера. Выбор языка нигде не запоминается, автоперенаправления нет.
import { createContext, useContext, type ReactNode } from "react";
import { CONTENT_RU, type Content } from "./content";
import { CONTENT_KK } from "./content.kk";
import { UI_RU, type UiText } from "./ui-text";
import { UI_KK } from "./ui-text.kk";

export type Lang = "ru" | "kk";

type LangState = {
  lang: Lang;
  /** Адрес той же страницы на другом языке; у страниц без пары — главная другого языка. */
  altHref: string;
};

const LangContext = createContext<LangState>({ lang: "ru", altHref: "/kz/" });

const UI: Record<Lang, UiText> = { ru: UI_RU, kk: UI_KK };
const CONTENT: Record<Lang, Content> = { ru: CONTENT_RU, kk: CONTENT_KK };

export function LangProvider({
  lang,
  altHref,
  children,
}: LangState & {
  children: ReactNode;
}) {
  return <LangContext.Provider value={{ lang, altHref }}>{children}</LangContext.Provider>;
}

export const useLang = (): Lang => useContext(LangContext).lang;
export const useAltHref = (): string => useContext(LangContext).altHref;
export const useText = (): UiText => UI[useLang()];
export const useContent = (): Content => CONTENT[useLang()];
