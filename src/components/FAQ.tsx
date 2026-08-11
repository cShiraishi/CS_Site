"use client";

import { Accordion } from "radix-ui";

export function FAQ({ itens }: { itens: readonly { p: string; r: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-linha">
      {itens.map((item) => (
        <Accordion.Item key={item.p} value={item.p} className="border-b border-linha">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between gap-8 py-6 text-left text-[1.02rem] leading-snug text-grafite transition-colors hover:text-ouro-profundo">
              {item.p}
              <span aria-hidden className="relative mt-2 h-3 w-3 shrink-0 text-ouro-profundo">
                <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-all duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_280ms_var(--ease-editorial)] data-[state=open]:animate-[accordion-down_360ms_var(--ease-editorial)]">
            <p className="max-w-2xl pb-7 pr-10 text-[0.95rem] leading-relaxed text-grafite">
              {item.r}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
