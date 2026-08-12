import { Suspense } from "react";
import { LoginOtp } from "@/components/LoginOtp";

export const metadata = { title: "Acessar minha conta | Carlos Seiti" };

export default function EntrarPage() {
  return (
    <main className="min-h-screen bg-porcelana px-5 py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="t-eyebrow text-ouro-profundo">Área do cliente</p>
          <h1 className="t-display mt-5 max-w-xl text-balance">Seus dados, sempre com você.</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-grafite">Entre sem senha. Enviamos um código único de seis dígitos para seu e-mail e recuperamos seu histórico automaticamente.</p>
          <div className="mt-9 grid gap-3 text-sm text-grafite sm:grid-cols-3">
            <span>Sem senha</span><span>Dados protegidos</span><span>Histórico pessoal</span>
          </div>
        </div>
        <Suspense fallback={<div className="h-80 animate-pulse bg-white" />}><LoginOtp /></Suspense>
      </div>
    </main>
  );
}
