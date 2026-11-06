import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com a chave de serviço — passa ao largo do RLS.
 *
 * Existe por uma razão só: o webhook do provedor de pagamento chega sem
 * sessão de ninguém, e precisa confirmar um pedido que nenhum utilizador
 * autenticado pode confirmar. É o oposto da chave publicável, que vai ao
 * navegador de propósito.
 *
 * O `import "server-only"` no topo não é zelo: é o que faz o build
 * FALHAR se algum dia este módulo for importado por um componente de
 * cliente. Sem ele, a chave que ignora todas as políticas de segurança
 * da base de dados sairia no pacote JavaScript servido a cada visitante,
 * e nada no ecrã denunciaria isso.
 *
 * Use-o apenas em route handlers e server actions, e nunca para ler
 * dados em nome de um utilizador: para isso existe `criarSupabaseServer`,
 * que respeita as políticas.
 */
export function criarSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) return null;

  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
