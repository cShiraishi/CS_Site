import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ATRIBUICAO, COOKIE_ATRIBUICAO } from "@/lib/campanha";

/** Rotas que exigem sessão — as únicas que justificam falar com o Supabase. */
function protegida(pathname: string) {
  return pathname.startsWith("/minha-conta") || pathname === "/entrar";
}

/**
 * Renova a sessão e barra o que precisa de login.
 *
 * Só corre nas rotas de conta: pedir o utilizador ao Supabase em cada visita
 * à home poria uma ida à rede à frente de cada página do site.
 */
async function sessao(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (itens) => {
        itens.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        itens.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith("/minha-conta") && !data.user) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/entrar";
    destino.searchParams.set("retorno", request.nextUrl.pathname);
    return NextResponse.redirect(destino);
  }
  return response;
}

/* 30 dias: mais longo que a janela em que alguém volta para fechar, curto o
   bastante para não creditar a campanha de dois meses atrás. */
const VALIDADE = 60 * 60 * 24 * 30;

/**
 * Guarda de onde a visita veio, para a atribuição sobreviver à navegação.
 *
 * O anúncio entrega a pessoa na home com `?utm_source=ig&fbclid=…`. Ela
 * clica em "Calcular meu % de gordura", faz a conta, e só então pede a
 * consultoria — três páginas depois. A query original já não existe em
 * lugar nenhum: o link do formulário saía carimbado como tráfego direto e
 * o criativo que pagou o lead ficava sem crédito no CRM.
 *
 * Então a primeira visita que trouxer atribuição deixa-a num cookie, e é
 * dele que `/consultoria` se serve quando a página do clique não tem nada.
 */
function guardarAtribuicao(request: NextRequest, response: NextResponse) {
  const trouxe = new URLSearchParams();
  for (const chave of ATRIBUICAO) {
    const valor = request.nextUrl.searchParams.get(chave);
    if (valor) trouxe.set(chave, valor);
  }

  /* Sem atribuição nova não se toca no cookie: uma visita direta no meio do
     caminho apagaria o anúncio que trouxe a pessoa ontem. */
  if ([...trouxe].length === 0) return response;

  response.cookies.set(COOKIE_ATRIBUICAO, trouxe.toString(), {
    maxAge: VALIDADE,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}

export async function proxy(request: NextRequest) {
  const response = protegida(request.nextUrl.pathname)
    ? await sessao(request)
    : NextResponse.next();

  return guardarAtribuicao(request, response);
}

export const config = {
  /* Todas as páginas, porque o anúncio pode apontar para qualquer uma — mas
     não os assets: correr em cada ícone e chunk de JS seria trabalho puro. */
  matcher: ["/((?!_next|api|brand|.*\.[\w]+$).*)"],
};
