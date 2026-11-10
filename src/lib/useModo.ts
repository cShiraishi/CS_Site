"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CHAVE_MODO, caminhoForcaEla, type Modo } from "./modo";
import { gravarArmazenado, useArmazenado } from "./useArmazenado";

export type { Modo } from "./modo";

/**
 * Modo Ele / Modo Ela — funciona como um tema claro/escuro.
 *
 * O modo vive em `data-modo` no <html>: o CSS troca o token de destaque
 * (ouro → ouro rosé) e os componentes leem o modo para trocar conteúdo
 * (itens do dock, por exemplo). O script inline do layout aplica o
 * atributo antes da primeira pintura; este hook mantém o atributo em dia
 * nas navegações do lado do cliente.
 */
export function gravarModo(modo: Modo) {
  document.documentElement.setAttribute("data-modo", modo);
  gravarArmazenado(CHAVE_MODO, modo);
}

export function useModo(): Modo {
  const caminho = usePathname();
  const salvo = useArmazenado(CHAVE_MODO);
  const modo: Modo = caminhoForcaEla(caminho) || salvo === "ela" ? "ela" : "ele";

  // Sincroniza só o DOM (sem setState): cobre a navegação via <Link>,
  // em que o script inline não roda de novo.
  useEffect(() => {
    document.documentElement.setAttribute("data-modo", modo);
  }, [modo]);

  return modo;
}
