// Общие части страницы политики: разметка разделов и форма словаря для ru/kk.
import { type ComponentType, type ReactNode } from "react";
import type { Crumb } from "../seo";

/** Подзаголовок пункта внутри раздела (5.1, 5.2). */
export const SUB = "pt-3 text-[19px] font-bold text-ink";

export type PolicyText = { crumbs: Crumb[]; h1: string; intro: string; Body: ComponentType };

export function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-[24px] font-bold">
        {n}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-ink2">{children}</div>
    </section>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-6">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
