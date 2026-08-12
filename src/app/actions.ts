"use server";

import { marca } from "@/lib/content";
import type { EstadoContato } from "@/lib/contato";
import {
  type Atividade,
  type Formula,
  type Sexo,
  calcular,
  distribuir,
  macros,
  planejar,
} from "@/lib/calorias";

const LIMITES = {
  nome: 80,
  email: 160,
  whatsapp: 32,
  objetivo: 60,
  experiencia: 100,
  frequencia: 40,
  inicio: 60,
  mensagem: 1500,
} as const;

function texto(formData: FormData, campo: string, limite: number) {
  const v = formData.get(campo);
  return typeof v === "string" ? v.trim().slice(0, limite) : "";
}

/** Validação simples e permissiva: barra o inválido óbvio, não o formato incomum. */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function enviarContato(
  _anterior: EstadoContato,
  formData: FormData,
): Promise<EstadoContato> {
  // Armadilha para robô: campo escondido que humano nunca preenche.
  if (texto(formData, "empresa", 10)) {
    return { status: "ok" };
  }

  const dados = {
    nome: texto(formData, "nome", LIMITES.nome),
    email: texto(formData, "email", LIMITES.email),
    whatsapp: texto(formData, "whatsapp", LIMITES.whatsapp),
    objetivo: texto(formData, "objetivo", LIMITES.objetivo),
    experiencia: texto(formData, "experiencia", LIMITES.experiencia),
    frequencia: texto(formData, "frequencia", LIMITES.frequencia),
    inicio: texto(formData, "inicio", LIMITES.inicio),
    mensagem: texto(formData, "mensagem", LIMITES.mensagem),
  };

  const erros: Record<string, string> = {};
  if (dados.nome.length < 2) erros.nome = "Informe seu nome.";
  if (!RE_EMAIL.test(dados.email)) erros.email = "Informe um e-mail válido.";
  if (dados.whatsapp.replace(/\D/g, "").length < 8)
    erros.whatsapp = "Informe um WhatsApp com DDD.";
  if (!dados.objetivo) erros.objetivo = "Escolha um objetivo.";
  if (!dados.experiencia) erros.experiencia = "Informe em que momento você está.";
  if (!dados.frequencia) erros.frequencia = "Informe sua disponibilidade semanal.";
  if (!dados.inicio) erros.inicio = "Informe quando gostaria de começar.";
  if (dados.mensagem.length < 10)
    erros.mensagem = "Conte um pouco mais sobre o seu contexto.";

  if (Object.keys(erros).length > 0) {
    return {
      status: "erro",
      mensagem: "Revise os campos destacados.",
      erros,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.CONTATO_EMAIL ?? marca.email;
  const remetente = process.env.CONTATO_REMETENTE ?? "Site CS <onboarding@resend.dev>";

  if (!apiKey) {
    // Sem provedor configurado: o lead não se perde no ar, fica no log do servidor.
    console.warn(
      "[contato] RESEND_API_KEY ausente — lead registrado apenas no log.\n" +
        JSON.stringify(dados, null, 2),
    );
    return {
      status: "ok",
      mensagem: "Respondo em até 24 horas.",
    };
  }

  const linhas = [
    ["Nome", dados.nome],
    ["E-mail", dados.email],
    ["WhatsApp", dados.whatsapp],
    ["Objetivo", dados.objetivo],
    ["Momento atual", dados.experiencia],
    ["Disponibilidade", dados.frequencia],
    ["Início", dados.inicio],
  ]
    .map(([r, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#8C673F">${r}</td><td>${escapar(v)}</td></tr>`)
    .join("");

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remetente,
        to: [destino],
        reply_to: dados.email,
        subject: `Nova avaliação — ${dados.nome} (${dados.objetivo})`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;color:#1D1B19;line-height:1.6">
            <p style="letter-spacing:.18em;font-size:11px;color:#8C673F;text-transform:uppercase">
              Solicitação de avaliação
            </p>
            <table style="font-size:14px;margin:12px 0 20px">${linhas}</table>
            <p style="font-size:14px;white-space:pre-wrap">${escapar(dados.mensagem)}</p>
          </div>
        `,
      }),
    });

    if (!resposta.ok) {
      console.error("[contato] Resend respondeu", resposta.status, await resposta.text());
      return {
        status: "erro",
        mensagem: "Não consegui enviar agora. Tente pelo WhatsApp.",
      };
    }
  } catch (e) {
    console.error("[contato] falha no envio", e);
    return {
      status: "erro",
      mensagem: "Não consegui enviar agora. Tente pelo WhatsApp.",
    };
  }

  return { status: "ok", mensagem: "Respondo em até 24 horas." };
}

function escapar(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ============================================================
   PLANO DA CALCULADORA
   O lead com maior intenção do site: já preencheu os dados e
   viu o resultado. A troca é o plano por escrito.
   ============================================================ */

/**
 * O plano é RECALCULADO aqui a partir dos parâmetros crus, e não
 * recebido pronto do cliente. Assim o e-mail nunca diverge do que
 * a pessoa viu, mesmo que alguém adultere o formulário.
 */
export async function enviarPlano(
  _anterior: EstadoContato,
  formData: FormData,
): Promise<EstadoContato> {
  if (texto(formData, "empresa", 10)) return { status: "ok" };

  const nome = texto(formData, "nome", LIMITES.nome);
  const email = texto(formData, "email", LIMITES.email);
  const whatsapp = texto(formData, "whatsapp", LIMITES.whatsapp);

  const erros: Record<string, string> = {};
  if (nome.length < 2) erros.nome = "Informe seu nome.";
  if (!RE_EMAIL.test(email)) erros.email = "Informe um e-mail válido.";
  if (whatsapp.replace(/\D/g, "").length < 8)
    erros.whatsapp = "Informe um WhatsApp com DDD.";
  if (Object.keys(erros).length > 0) {
    return { status: "erro", mensagem: "Revise os campos destacados.", erros };
  }

  const numero = (campo: string) => Number(texto(formData, campo, 8).replace(",", "."));
  const entrada = {
    sexo: (texto(formData, "sexo", 12) === "feminino" ? "feminino" : "masculino") as Sexo,
    idade: numero("idade"),
    peso: numero("peso"),
    altura: numero("altura"),
    gordura: numero("gordura") || undefined,
  };

  const base = calcular(
    entrada,
    texto(formData, "formula", 12) as Formula,
    texto(formData, "atividade", 12) as Atividade,
  );
  if (!base) {
    return { status: "erro", mensagem: "Os dados do plano não vieram completos." };
  }

  const plano = planejar(
    base.get,
    base.tmb,
    entrada.peso,
    numero("pesoAlvo") || entrada.peso,
  );
  if (!plano) {
    return { status: "erro", mensagem: "Os dados do plano não vieram completos." };
  }

  const m = macros(plano.alvo, entrada.peso, plano.direcao);
  const refeicoes = Math.min(6, Math.max(2, numero("refeicoes") || 4));
  const pratos = distribuir(plano.alvo, m, refeicoes);

  const apiKey = process.env.RESEND_API_KEY;
  const copia = process.env.CONTATO_EMAIL ?? marca.email;
  const remetente = process.env.CONTATO_REMETENTE ?? "Carlos Seiti <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      `[plano] RESEND_API_KEY ausente — lead registrado apenas no log.\n` +
        JSON.stringify({ nome, email, whatsapp, entrada, plano, macros: m }, null, 2),
    );
    return { status: "ok" };
  }

  const linhas = pratos
    .map(
      (r) =>
        `<tr>
           <td style="padding:8px 0;border-bottom:1px solid #eee">${escapar(r.nome)}</td>
           <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#8C673F">${r.kcal} kcal</td>
           <td style="padding:8px 0 8px 18px;border-bottom:1px solid #eee;text-align:right;color:#555">${r.proteina}P · ${r.carboidrato}C · ${r.gordura}G</td>
         </tr>`,
    )
    .join("");

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remetente,
        to: [email],
        // A cópia é anunciada na tela — o lead sabe que ela existe.
        bcc: [copia],
        reply_to: copia,
        subject: `${nome}, seu plano: ${plano.alvo} kcal por dia`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;color:#1D1B19;line-height:1.65;max-width:560px">
            <p style="letter-spacing:.18em;font-size:11px;color:#8C673F;text-transform:uppercase">
              Carlos Seiti · Nutrição Avançada
            </p>

            <p style="font-size:15px">Olá, ${escapar(nome)}.</p>
            <p style="font-size:12px;color:#777">WhatsApp informado: ${escapar(whatsapp)}</p>
            <p style="font-size:15px">Segue o plano que a calculadora montou com os seus dados.</p>

            <table style="width:100%;font-size:15px;margin:24px 0">
              <tr><td>Metabolismo basal</td><td style="text-align:right"><strong>${base.tmb} kcal</strong></td></tr>
              <tr><td>Gasto total no dia</td><td style="text-align:right"><strong>${base.get} kcal</strong></td></tr>
              <tr><td style="color:#8C673F">Alvo diário</td><td style="text-align:right;color:#8C673F"><strong>${plano.alvo} kcal</strong></td></tr>
            </table>

            ${
              plano.direcao === "manter"
                ? ""
                : `<p style="font-size:15px">Ritmo seguro de <strong>${plano.ritmoSemanal
                    .toFixed(2)
                    .replace(".", ",")} kg por semana</strong> — cerca de ${plano.semanas} semanas para percorrer ${plano.diferenca
                    .toFixed(1)
                    .replace(".", ",")} kg.</p>`
            }

            <p style="font-size:15px;margin-top:24px">
              <strong>Macros:</strong> ${m.proteina.g} g de proteína ·
              ${m.carboidrato.g} g de carboidrato · ${m.gordura.g} g de gordura.
            </p>

            <p style="font-size:15px;margin-top:24px"><strong>Distribuição em ${pratos.length} refeições</strong></p>
            <table style="width:100%;font-size:14px;border-collapse:collapse">${linhas}</table>

            <p style="font-size:14px;color:#555;margin-top:28px">
              Estes números são um ponto de partida com erro individual de 10 a 15 %.
              O que muda o resultado é o ajuste ao longo das semanas — é isso que
              eu faço na consultoria.
            </p>

            <p style="font-size:15px;margin-top:24px">
              Se quiser, responda este e-mail contando seu contexto. Eu leio e
              respondo pessoalmente.
            </p>

            <p style="font-size:14px;color:#8C673F;font-style:italic;margin-top:28px">
              Evolução com propósito.
            </p>
            <p style="font-size:12px;color:#999;margin-top:20px">
              Orientação em treino e nutrição esportiva. Não substitui avaliação
              médica ou nutricional clínica.
            </p>
          </div>
        `,
      }),
    });

    if (!resposta.ok) {
      console.error("[plano] Resend respondeu", resposta.status, await resposta.text());
      return { status: "erro", mensagem: "Não consegui enviar agora. Tente pelo WhatsApp." };
    }
  } catch (e) {
    console.error("[plano] falha no envio", e);
    return { status: "erro", mensagem: "Não consegui enviar agora. Tente pelo WhatsApp." };
  }

  return { status: "ok" };
}
