/**
 * Tipos e estado inicial do formulário.
 *
 * Vivem fora de `actions.ts` porque um arquivo "use server" só pode
 * exportar funções async — exportar um objeto de lá quebra em runtime.
 */

export type EstadoContato = {
  status: "idle" | "ok" | "erro";
  mensagem?: string;
  erros?: Record<string, string>;
};

export const estadoInicial: EstadoContato = { status: "idle" };
