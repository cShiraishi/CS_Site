"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { criarSupabaseBrowser } from "@/lib/supabase/client";

type Etapa = "email" | "codigo" | "concluido";

export function LoginOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [etapa, setEtapa] = useState<Etapa>("email");
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const codigoRef = useRef<HTMLInputElement>(null);
  const supabase = criarSupabaseBrowser();

  useEffect(() => {
    if (etapa === "codigo") codigoRef.current?.focus();
  }, [etapa]);

  const retornoRaw = searchParams.get("retorno") || "/minha-conta";
  const retorno = retornoRaw.startsWith("/") && !retornoRaw.startsWith("//") ? retornoRaw : "/minha-conta";

  async function enviarCodigo(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setOcupado(true);
    setMensagem("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    setOcupado(false);
    if (error) return setMensagem("Não foi possível enviar o código. Confira o e-mail e tente novamente.");
    setEtapa("codigo");
    setMensagem("Enviamos um código de seis dígitos. Ele expira em poucos minutos.");
  }

  async function confirmarCodigo(event: FormEvent) {
    event.preventDefault();
    if (!supabase || codigo.length !== 6) return;
    setOcupado(true);
    setMensagem("");
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: codigo,
      type: "email",
    });
    setOcupado(false);
    if (error) return setMensagem("Código inválido ou expirado. Solicite um novo código.");
    setEtapa("concluido");
    router.replace(retorno);
    router.refresh();
  }

  if (!supabase) {
    return (
      <div className="border border-ouro/30 bg-white p-6 text-sm leading-relaxed text-grafite">
        A área de clientes está pronta, mas o projeto Supabase ainda precisa ser conectado pelas variáveis de ambiente.
      </div>
    );
  }

  return (
    <div className="surface-elevated overflow-hidden bg-white">
      <div className="h-1 bg-linear-to-r from-ouro-profundo via-ouro to-transparent" />
      <div className="p-7 sm:p-10">
        <div className="mb-8 flex items-center gap-3" aria-label={`Etapa ${etapa === "email" ? 1 : 2} de 2`}>
          <span className="h-1 flex-1 rounded-full bg-ouro-profundo" />
          <span className={`h-1 flex-1 rounded-full ${etapa === "email" ? "bg-linha" : "bg-ouro-profundo"}`} />
        </div>

        {etapa === "email" ? (
          <form onSubmit={enviarCodigo} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="t-eyebrow text-grafite">Seu e-mail</label>
              <input id="login-email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com"
                className="mt-3 w-full border-b border-linha bg-transparent py-3 text-lg outline-none transition-colors focus:border-ouro-profundo" />
            </div>
            <button disabled={ocupado} className="w-full rounded-full bg-grafite px-7 py-3.5 text-sm font-medium text-porcelana transition-colors hover:bg-ouro-profundo disabled:opacity-50">
              {ocupado ? "Enviando…" : "Receber código por e-mail"}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmarCodigo} className="space-y-6">
            <div>
              <p className="text-sm text-grafite">Código enviado para <strong className="font-medium text-grafite">{email}</strong></p>
              <label htmlFor="login-codigo" className="t-eyebrow mt-6 block text-grafite">Código de acesso</label>
              <input ref={codigoRef} id="login-codigo" inputMode="numeric" autoComplete="one-time-code" required
                maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000" className="mt-3 w-full border-b border-linha bg-transparent py-3 text-center font-display text-4xl tracking-[0.45em] outline-none transition-colors focus:border-ouro-profundo" />
            </div>
            <button disabled={ocupado || codigo.length !== 6} className="w-full rounded-full bg-grafite px-7 py-3.5 text-sm font-medium text-porcelana transition-colors hover:bg-ouro-profundo disabled:opacity-50">
              {ocupado ? "Validando…" : "Entrar com segurança"}
            </button>
            <button type="button" onClick={() => { setEtapa("email"); setCodigo(""); setMensagem(""); }} className="w-full text-sm text-grafite underline decoration-ouro/60 underline-offset-4">
              Usar outro e-mail
            </button>
          </form>
        )}
        {mensagem && <p role="status" className="mt-5 text-sm leading-relaxed text-grafite">{mensagem}</p>}
      </div>
    </div>
  );
}
