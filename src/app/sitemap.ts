import type { MetadataRoute } from "next";
import { marca, rotas } from "@/lib/content";
import { listarLeituras } from "@/lib/leituras";
import { APPS_ELA, rotaEla } from "@/lib/canal-ela";
import { IDIOMAS, alternativasIdioma, rotaIdioma } from "@/lib/rotas-idioma";

type Frequencia = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/**
 * Regenerado a cada build — `lastModified` acompanha o deploy.
 * As seções da home são âncoras, não URLs, e âncoras não entram
 * em sitemap (o Google as descobre pelo conteúdo).
 *
 * Toda página pública existe em PT (raiz), ES (/es) e EN (/en): cada
 * caminho vira três URLs, cada uma com o hreflang das outras duas.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();
  const leituras = await listarLeituras();

  const absoluto = (caminho: string) => `${marca.site}${caminho === "/" ? "" : caminho}`;

  /** Prioridade do português; as traduções ficam um degrau abaixo. */
  const paginas: { caminho: string; frequencia: Frequencia; prioridade: number }[] = [
    { caminho: "/", frequencia: "monthly", prioridade: 1 },
    /* O funil é a porta do produto: prioridade acima das ferramentas. */
    { caminho: rotas.programa, frequencia: "monthly", prioridade: 0.95 },
    { caminho: rotas.calculadora, frequencia: "yearly", prioridade: 0.8 },
    { caminho: rotas.gordura, frequencia: "yearly", prioridade: 0.9 },
    { caminho: rotas.prato, frequencia: "yearly", prioridade: 0.8 },
    { caminho: rotas.raioX, frequencia: "yearly", prioridade: 0.8 },
    { caminho: rotas.postura, frequencia: "yearly", prioridade: 0.8 },
    { caminho: rotas.csflix, frequencia: "weekly", prioridade: 0.7 },
    { caminho: rotas.receitas, frequencia: "weekly", prioridade: 0.75 },
    { caminho: rotas.biblioteca, frequencia: "monthly", prioridade: 0.7 },
    { caminho: rotas.links, frequencia: "monthly", prioridade: 0.6 },
    /* Canal Ela: hub e apps. */
    { caminho: rotaEla("pt"), frequencia: "monthly", prioridade: 0.75 },
    ...APPS_ELA.map((a) => ({
      caminho: rotaEla("pt", a.slug),
      frequencia: "monthly" as const,
      prioridade: 0.7,
    })),
    ...leituras.map((slug) => ({
      caminho: `/leitura/${slug}`,
      frequencia: "yearly" as const,
      prioridade: 0.6,
    })),
  ];

  return paginas.flatMap(({ caminho, frequencia, prioridade }) => {
    const languages = Object.fromEntries(
      Object.entries(alternativasIdioma(caminho))
        .filter(([codigo]) => codigo !== "x-default")
        .map(([codigo, url]) => [codigo, absoluto(url)]),
    );
    return IDIOMAS.map((idioma) => ({
      url: absoluto(rotaIdioma(idioma, caminho)),
      lastModified: agora,
      changeFrequency: frequencia,
      priority: idioma === "pt" ? prioridade : Math.round((prioridade - 0.05) * 100) / 100,
      alternates: { languages },
    }));
  });
}
