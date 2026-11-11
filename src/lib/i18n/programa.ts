/**
 * Textos da página de vendas do Reset Metabólico 21D (/programa-90-dias)
 * e do funil/simulador, nos três idiomas.
 *
 * O português é cópia literal do que a página sempre exibiu. Trechos com
 * destaque (<strong>, <span> neon) vêm como listas alternadas
 * [texto, destaque, texto, destaque, ...] — índices ímpares são o destaque.
 *
 * Sem "use client": serve ao servidor e ao cliente.
 */

import { credenciais, resultados, sobre } from "../content";
import type { Moeda } from "../produto";
import type { Idioma } from "../rotas-idioma";

type Fase = {
  semana: string;
  dias: string;
  titulo: string;
  subtitulo: string;
  mecanismo: string;
  entregavel: string;
};

type Item = { titulo: string; texto: string };

const pt = {
  meta: {
    titulo:
      "Reset Metabólico 21 Dias: desinche e emagreça",
    descricao:
      "Protocolo científico de 21 dias em 3 semanas para desinflamar, estabilizar a glicemia e perder gordura sem cortar carboidratos. Simule seu plano em 7 passos.",
    ogTitulo: "Reset Metabólico 21 Dias",
    ogDescricao:
      "3 semanas estruturadas pela Ciência de Alimentos para tirar o seu metabolismo da inércia — calculado para o seu corpo.",
    ogAlt: "Reset Metabólico 21D — Emagrecimento com Método",
  },

  semanas: [
    {
      semana: "Semana 01",
      dias: "Dias 1 a 7",
      titulo: "Descompressão Glicêmica & Desinchaço",
      subtitulo: "O corte imediato da retenção hídrica e dos picos de fome noturna",
      mecanismo:
        "Ajustamos a distribuição de proteínas por refeição, a densidade de fibras e a cinética dos carboidratos. Em 5 a 7 dias a insulina basal estabiliza, o volume abdominal cede visivelmente e aquela vontade descontrolada por doce à noite desaparece.",
      entregavel:
        "Meta do Dia 7: Redução de 1 a 2,5 kg (água intracelular/glicogênio + início da lipólise) e fome sob controle.",
    },
    {
      semana: "Semana 02",
      dias: "Dias 8 a 14",
      titulo: "Oxidação Lipídica & Sinal Mecânico",
      subtitulo: "Queima real de gordura preservando 100% da sua massa magra",
      mecanismo:
        "Com a glicemia estável e sem fome de rebote, o déficit calórico calculado sobre a sua Taxa Metabólica Basal obriga o corpo a oxidar tecido adiposo. O treino calibrado por Repetições em Reserva (RIR) sinaliza ao corpo que o músculo não pode ser gasto.",
      entregavel:
        "Meta do Dia 14: Redução visível na linha de cintura, roupas folgando e progressão de carga no treino.",
    },
    {
      semana: "Semana 03",
      dias: "Dias 15 a 21",
      titulo: "Blindagem Metabólica & Mapa do Dia 22",
      subtitulo: "Recalibração sobre o peso novo para evitar o efeito platô",
      mecanismo:
        "Na terceira semana recalculamos os macros para o seu novo peso corporal, evitando a termogênese adaptativa precoce. Você encerra o ciclo com autonomia alimentar e recebe a rota exata de transição para o Dia 22 em diante.",
      entregavel:
        "Meta do Dia 21: Fotos comparativas (Dia 1 vs. Dia 21), cintura aferida e plano de continuidade pronto.",
    },
  ] as Fase[],

  sintomas: [
    {
      titulo: "Acorda bem, mas termina o dia estufado",
      texto:
        "Má combinação de volume alimentar, baixa ingestão estratégica de água/fibras e picos glicêmicos que geram retenção e distensão abdominal todos os dias.",
    },
    {
      titulo: "Perde o controle da fome no fim da tarde",
      texto:
        "Não é falta de força de vontade: é erro na cinética proteica do almoço e do lanche. Quando a glicemia despenca às 18h, o cérebro exige caloria rápida.",
    },
    {
      titulo: "Treina há meses e vê sempre o mesmo corpo",
      texto:
        "Treinar sem controle de volume e longe da proximidade correta da falha (RIR), somado a calorias no chute, mantém você cansado e exatamente no mesmo lugar.",
    },
    {
      titulo: "Já fez dietas restritivas e recuperou tudo",
      texto:
        "Cortar arroz, pão e frutas derruba a leptina, destrói massa magra e garante a compulsão na segunda semana. O Reset usa comida brasileira de verdade.",
    },
  ] as Item[],

  entregaveis: [
    {
      codigo: "MÓDULO 01 · PRESCRIÇÃO",
      titulo: "Plano Individual Calculado para as 3 Semanas",
      descricao:
        "Suas calorias exatas, gramas de proteína, carboidrato e gordura por dia e por refeição, recalculadas a cada bloco de 7 dias conforme o peso desce.",
      destaque: "Personalizado no simulador",
    },
    {
      codigo: "MÓDULO 02 · NUTRIÇÃO (PDF)",
      titulo: "Protocolo de Nutrição em Comida Real",
      descricao:
        "Como converter suas metas calóricas em comida de verdade (arroz, feijão, carnes, ovos, pão, frutas) — no restaurante ou em casa, sem depender de balança.",
      destaque: "Tabela de substituições inclusa",
    },
    {
      codigo: "MÓDULO 03 · TREINO (PDF)",
      titulo: "Periodização de Treino: Casa ou Academia",
      descricao:
        "Sua semana completa exercício por exercício, ajustada ao seu nível (iniciante, retornando ou avançado) e aos dias que você realmente tem disponíveis.",
      destaque: "Com alternativas de exercícios",
    },
    {
      codigo: "MÓDULO 04 · EXECUÇÃO (PDF)",
      titulo: "Guia dos Primeiros 7 Dias + Protocolo de Aferição",
      descricao:
        "O passo a passo diário da primeira semana para cortar o inchaço logo na largada e o manual de como medir cintura, peso e fotos sem distorção.",
      destaque: "Checklist de execução diária",
    },
  ],

  perguntas: [
    {
      p: "Por que 21 dias funciona sem ser mais uma 'dieta milagrosa'?",
      r: "Porque não prometemos mudar a sua vida inteira em 3 semanas, e sim executar uma intervenção fisiológica precisa: 7 dias para estabilizar glicemia e cortar retenção hídrica, 7 dias para acelerar a oxidação de gordura com proteção muscular e 7 dias para consolidar o ritmo e entregar o mapa do Dia 22.",
    },
    {
      p: "Vou precisar cortar carboidratos, arroz ou pão?",
      r: "De forma alguma. Cortar carboidratos a zero só esvazia glicogênio e água muscular, derrubando seu rendimento no treino e gerando rebote. O Reset Metabólico controla a carga glicêmica combinando carboidratos com proteínas e fibras na proporção certa.",
    },
    {
      p: "Serve para quem treina em casa ou nunca fez academia?",
      r: "Sim. No simulador você escolhe se vai treinar em casa (com o peso do corpo e uma cadeira) ou na academia, além do seu nível atual. O programa monta o volume exato para a sua realidade.",
    },
    {
      p: "Como recebo o acesso após o pagamento?",
      r: "O pagamento é processado em ambiente seguro (Pix/Cartão no Brasil ou Cartão/MB Way em Portugal e Europa). Assim que confirmado, você acessa sua plataforma CS Performance no site com o seu e-mail para abrir seu calendário de 21 dias, missões diárias, receitas e protocolos em PDF.",
    },
    {
      p: "E se eu achar que o programa não é para mim?",
      r: "Você tem 7 dias de garantia incondicional. Pode entrar, ver toda a prescrição, baixar os PDFs e aplicar a primeira semana inteira. Se não ficar satisfeito por qualquer motivo, basta solicitar o reembolso e devolvemos 100% do seu dinheiro.",
    },
  ],

  abertura: {
    breadcrumbAria: "Você está em",
    inicio: "Início",
    atual: "Reset Metabólico 21 Dias",
    selo: "Emagrecimento com Método · Com Science",
    altEmblema: "Reset Metabólico 21D — Emagrecimento com Método",
    h1: "Destrave seu metabolismo em",
    h1Destaque: "21 Dias.",
    texto: [
      "Desinche o abdômen na ",
      "Semana 1",
      ", acelere a queima real de gordura na ",
      "Semana 2",
      " e elimine a fome de rebote na ",
      "Semana 3",
      " — com calorias, macros e treinos calculados para a sua biologia.",
    ],
    selos: [
      "⚡ Sem cortar carboidratos",
      "🍽️ Comida real (BR & PT)",
      "🏋️ Treino em Casa ou Academia",
      "💻 Plataforma Interativa + PDFs",
    ],
    ctaSimular: "Simular meu plano de 21 dias",
    ctaDireto: "Garantir acesso direto ·",
    autoria: ["Desenvolvido por ", "Carlos Seiti", " — 2× Mestre e Doutorando em Ciência de Alimentos."],
    painelEyebrow: "Arquitetura da Intervenção",
    painelTitulo: "O que muda em 3 semanas",
    acessoUnico: "Acesso Único",
    fase: (i: number) => `Fase ${i}/3`,
    resumo: [
      { valor: "21 Dias", nota: "3 blocos de 7 dias" },
      { valor: "100%", nota: "Calculado p/ você" },
      { valor: "7 Dias", nota: "Garantia blindada" },
    ],
  },

  vendas: {
    sintomasEyebrow: "Por que o seu corpo estagnou",
    sintomasTitulo: "O problema não é a sua genética. É tentar emagrecer no escuro.",
    sintomasTexto: [
      "Se você se reconhece em pelo menos um dos quatro sinais abaixo, o seu metabolismo não precisa de mais restrição — precisa de um ",
      "Reset estruturado de 21 dias",
      ".",
    ],
    sinalAlerta: "Sinal de Alerta",

    cronoEyebrow: "Ciência de Alimentos Aplicada",
    cronoTitulo: "Por que 21 dias é a janela exata para destravar o metabolismo.",
    cronoTexto:
      "Esqueça os desafios de internet baseados em passar fome. Aqui cada bloco de 7 dias atua em um mecanismo fisiológico real do seu corpo.",
    resultadoEsperado: "Resultado esperado na sexta-feira:",

    plataformaEyebrow: "Por Dentro da Plataforma CS Performance",
    plataformaTitulo:
      "Você não recebe um PDF solto. Você entra num painel de execução de 21 dias.",
    plataformaTexto: [
      "Assim que o seu pagamento é confirmado, o seu acesso abre o painel interativo ",
      "CS Performance · Reset Metabólico 21D",
      " direto no navegador do seu telemóvel ou computador:",
    ],
    plataformaItens: [
      {
        titulo: "Missões diárias interativas (Dia 01 a Dia 21):",
        texto: "marque cada tarefa concluída e acompanhe sua barra de progresso subir em tempo real.",
      },
      {
        titulo: "Aulas rápidas do dia (3 min):",
        texto: "orientação direta e sem enrolação para blindar a mente e a disciplina.",
      },
      {
        titulo: "20 Receitas Práticas & Snacks < 100 kcal:",
        texto:
          "opções doces e salgadas de alto volume proteico para matar a vontade de doce sem sair do plano.",
      },
      {
        titulo: "Diário de Progresso integrado:",
        texto: "registe peso, linha de cintura, treinos concluídos e adesão alimentar.",
      },
    ] as Item[],
    testarPlataforma: "Testar a plataforma por dentro agora →",
    garantirAcesso: "Garantir meu acesso ·",
    altPlataforma:
      "Painel de membros CS Performance — Reset Metabólico 21D com calendário, missões diárias, plano alimentar e receitas",

    difEyebrow: "A Diferença de Método",
    difTitulo: "Por que os “desafios de 21 dias” comuns falham — e por que este funciona.",
    mercadoEyebrow: "❌ O que o mercado vende",
    mercadoTitulo: "Dietas Detox & Cardápios Genéricos de Gaveta",
    mercadoItens: [
      "Mesma dieta de 1.200 kcal para uma mulher de 55 kg e um homem de 95 kg.",
      "Corta carboidratos a zero: você perde apenas água e massa muscular na primeira semana.",
      "Ingredientes caros e irreais que ninguém sustenta numa rotina de trabalho.",
      "No dia 22 você volta a comer normal e recupera o dobro do peso (efeito sanfona).",
    ],
    metodoEyebrow: "✓ Engenharia Alimentar Aplicada",
    metodoTitulo: "Reset Metabólico 21 Dias · Carlos Seiti",
    metodoItens: [
      {
        titulo: "Calculado para o seu peso, altura, idade e rotina:",
        texto: "déficit seguro que preserva seu metabolismo basal.",
      },
      {
        titulo: "Cinética de nutrientes:",
        texto: "proteína e fibras calibradas para desligar a fome noturna sem cortar arroz, pão ou fruta.",
      },
      {
        titulo: "Treino integrado (Casa ou Academia):",
        texto: "sinalização mecânica exata para obrigar o corpo a queimar gordura, não músculo.",
      },
      {
        titulo: "Protocolo do Dia 22 incluso:",
        texto: "você aprende exatamente como transicionar para manutenção ou continuar secando.",
      },
    ] as Item[],

    entregaveisEyebrow: "Acesso Imediato na Área de Membros",
    entregaveisTitulo: "Tudo o que você recebe ao destravar o seu Reset hoje.",
    entregaveisTexto:
      "Nada de aulas intermináveis que você nunca assiste. Você recebe o seu painel interativo de 21 dias e os protocolos diretos em PDF para abrir no telemóvel na hora de comer e treinar.",
    inclusoNoAcesso: "✓ Incluso no seu acesso de",

    provaEyebrow: "Resultados Reais da Metodologia",
    provaTitulo: "Quem aplica direção científica muda o corpo de verdade.",
    provaCta: resultados.cta as string,
    altCarlos:
      "Carlos Seiti — Engenheiro Alimentar, Mestre e Doutorando em Ciência de Alimentos",
    seloCarlos: "MSc · PhD Cand. Ciência de Alimentos",
    autorEyebrow: "Quem criou o protocolo",
    autorTitulo: "Ciência de laboratório traduzida para o seu prato.",
    autorParagrafos: [sobre.paragrafos[0], sobre.paragrafos[1]] as string[],
    credenciais: credenciais.map((c) => ({ valor: c.valor as string, rotulo: c.rotulo as string })),

    ofertaSelo: "Inscrição Aberta · Acesso Vitalício à Plataforma",
    altOferta: "Reset Metabólico 21D — Emagrecimento com Método",
    ofertaTitulo: ["Comece seu ", "Reset Metabólico 21D", " agora."],
    ofertaTexto:
      "Menos que o valor de uma única refeição fora de casa para ter as 3 semanas calculadas, acesso à plataforma CS Performance e todos os manuais práticos assinados por Carlos Seiti.",
    resumoTitulo: "Resumo do que você leva hoje:",
    resumoItens: [
      "✓ Plataforma Interativa CS Performance 21D (Calendário, Missões & Diário)",
      "✓ Prescrição Individual das 3 Semanas (Calorias, Macros e Refeições)",
      "✓ Protocolo de Nutrição em Comida Real + 20 Receitas Práticas (PDF)",
      "✓ Periodização de Treino Casa & Academia + Guia dos 7 Dias (PDF)",
    ],
    incluso: "Incluso",
    de: "De",
    porApenas: "por apenas:",
    pagamentoUnico: "pagamento único · sem mensalidade",
    subirSimulador: "Quer personalizar antes? Suba para o simulador ↑",
    rotuloComprar: "Destravar meu Reset de 21 Dias",
    aplicarConsultoria: "Quero aplicar para o Reset / Consultoria ·",
    verPreview: "Ver plataforma por dentro (Preview) →",
    garantiaTitulo: "Garantia Blindada de 7 Dias — Risco Zero",
    garantiaTexto:
      "Entre na plataforma, baixe os protocolos em PDF e aplique toda a Semana 1 (Descompressão Glicêmica). Se não sentir seu abdômen desinchar e sua fome estabilizar, basta pedir o reembolso em até 7 dias e devolvemos 100% do seu dinheiro.",

    faqEyebrow: "Dúvidas Frequentes",
    faqTitulo: "Perguntas antes de começar os seus 21 dias.",
    faqRodape: [
      "Quer conferir apenas seus índices isolados? Use gratuitamente a ",
      "calculadora de gordura corporal",
      " ou a ",
      "calculadora de calorias",
      ".",
    ],
  },

  funil: {
    eyebrow: "Diagnóstico Interativo Gratuito",
    titulo: "Simule seu Reset de 21 Dias em 60 segundos",
    selo: "7 toques · Sem cadastro para ver o cálculo",
    passo: (i: number, total: number) => `Passo ${i} de ${total}`,
    sexo: {
      titulo: "Você é homem ou mulher?",
      nota: "A composição corporal e o gasto energético diferem o bastante para mudar todo o plano. É a única razão da pergunta.",
      homem: "Homem",
      mulher: "Mulher",
    },
    atual: {
      titulo: "Qual silhueta é a sua hoje?",
      nota: "Aponte o que você vê no espelho. O número vem depois, por trás.",
      grupo: "Silhueta atual",
    },
    alvo: {
      titulo: "E qual é o corpo que você quer?",
      nota: "Escolha pelo corpo, não pelo número. É esta distância que o programa percorre.",
      grupo: "Silhueta desejada",
    },
    numeros: {
      titulo: "Seus números de hoje",
      nota: "É com eles que o plano é calculado. A silhueta diz para onde ir; estes dizem de onde se parte.",
      idade: "Idade",
      anos: "anos",
      altura: "Altura",
      peso: "Peso",
    },
    pesoAlvo: {
      titulo: "Onde você quer chegar na balança?",
      nota: "Se o número e a silhueta não combinarem, o programa diz — e explica qual dos dois vale a pena perseguir.",
      rotulo: "Peso desejado",
    },
    rotina: {
      titulo: "Como é o seu dia e onde você treina",
      nota: "O programa é montado sobre o que você tem de verdade. Prometer cinco dias e cumprir dois é pior que planejar dois.",
      seuDia: "Seu dia hoje",
      onde: "Onde você vai treinar",
      academia: ["Academia", "Máquinas, barras e halteres"] as [string, string],
      casa: ["Em casa", "Peso do corpo e o que houver por aí"] as [string, string],
    },
    treino: {
      titulo: "Quanto você consegue treinar",
      nota: "Última pergunta. O número que você sustenta por 21 dias vale mais que o número que você gostaria de fazer.",
      experiencia: "Sua experiência",
      nunca: ["Nunca treinei", "Ou foi há muitos anos"] as [string, string],
      voltando: ["Estou voltando", "Já treinei, parei"] as [string, string],
      constante: ["Treino há tempo", "De forma constante"] as [string, string],
      dias: "Dias de treino por semana",
      diasAria: (d: number) => `${d} dias de treino por semana`,
      refeicoes: "Refeições por dia",
      refeicoesAria: (r: number) => `${r} refeições por dia`,
    },
    voltar: "Voltar",
    continuar: "Continuar",
    verPrograma: "Ver meu programa",
    voceEstaAqui: "Você está aqui",
    deGordura: (g: number) => `${g}% de gordura`,
  },

  resultado: {
    faltouTitulo: "Faltou algum dado.",
    faltouTexto:
      "Não consegui montar o programa com o que foi preenchido. Volte um passo e confira idade, altura e peso.",
    voltar: "Voltar",
    eyebrow: (d: number) => `Seu programa de ${d} dias`,
    tituloRecomp: "O seu caso não é perder peso — é trocar composição.",
    tituloCabe: (d: number) => `O que você pediu cabe nos ${d} dias.`,
    tituloNaoCabe: (d: number) => `Vamos ser exatos sobre o que cabe em ${d} dias.`,
    hoje: "Hoje",
    noDia: (d: number) => `No dia ${d}`,
    dia: (d: number) => `Dia ${d}`,
    gorduraAprox: (g: number) => `~${g}% de gordura`,
    balancaPouco: "a balança mexe pouco de propósito",
    diferenca: (kg: string) => `${kg} kg de diferença`,
    treino: "Treino",
    porSemana: (d: number) => `${d}× / semana`,
    emCasa: "em casa",
    naAcademia: "na academia",
    precisaSaber: "O que você precisa saber",
    bloco: (n: number, intervalo: string) => `Bloco ${n} · ${intervalo}`,
    calorias: "Calorias",
    kcalDia: "kcal por dia",
    proteina: "Proteína",
    carboidrato: "Carboidrato",
    gordura: "Gordura",
    semanaTreino: (sessoes: number, series: number) =>
      `A semana de treino deste bloco — ${sessoes} sessões, ${series} séries`,
    maisFacil: "mais fácil:",
    ultimoDia: "No último dia do bloco",
    ajustar: "Ajustar as respostas",
  },

  oferta: {
    eyebrow: (d: number) => `Liberação Imediata · Reset Metabólico ${d} Dias`,
    entrada: "Oferta de Entrada ·",
    alt: "Reset Metabólico 21D — Emagrecimento com Método",
    titulo: "Você acabou de ver o plano. O programa é cumpri-lo.",
    texto: (d: number, blocos: number, dias: string) =>
      `Os ${d} dias divididos em ${blocos} blocos semanais, com as sessões numeradas, o guia alimentar de substituições sem balança, o registro de cargas e a aferição nos dias ${dias}. O plano acima, por escrito, em PDF e com data.`,
    itemPrescricao: (d: number) => `Prescrição dos ${d} dias salva na sua conta`,
    itemNutricao: "Protocolo de Nutrição em Comida Real (PDF)",
    itemTreino: (casa: boolean) => `Protocolo de Treino (${casa ? "Em Casa" : "Academia"}) (PDF)`,
    itemGuia: "Guia dos Primeiros 7 Dias + Aferição (PDF)",
    consultoria: "Começar consultoria",
    garantia: "🛡️ Garantia incondicional de 7 dias",
    assinatura:
      "Assinado por Carlos Seiti (MSc, PhD Cand.). O plano que você viu nesta tela é salvo automaticamente com o seu pedido.",
  },

  comprar: {
    rotuloPadrao: "Quero o programa",
    erroAbrir: "Não consegui abrir o pagamento. Tente de novo.",
    erroConexao: "Sem conexão com o pagamento. Tente de novo em instantes.",
    /** null = usa a mensagem do servidor (que é em português) */
    erroEmail: null as string | null,
    email: "Seu e-mail para liberar o acesso imediato",
    placeholder: "voce@email.com",
    abrindo: "Abrindo o pagamento…",
    rodape: (meios: string) =>
      `Pagamento seguro (${meios}). Liberação imediata na sua conta CS Performance.`,
    meios: {
      BRL: "Pix, cartão ou boleto",
      EUR: "Cartão, MB WAY ou Apple/Google Pay",
    } as Record<Moeda, string>,
  },

  moeda: {
    grupo: "Moeda de exibição",
  },

  galeria: {
    ampliar: "Ampliar",
    ampliarAria: (nome: string) => `Ampliar foto de antes e depois de ${nome}`,
    abrirInstagram: (nome: string, handle: string) => `Abrir Instagram de ${nome} (${handle})`,
    transformacao: (nome: string) => `Transformação de ${nome}`,
    verInstagram: "Ver Instagram",
    fechar: "Fechar visualização ampliada",
    /** alt por @instagram; PT vem de content.ts */
    alts: Object.fromEntries(
      resultados.transformacoes.map((t) => [t.instagram, t.alt as string]),
    ) as Record<string, string>,
  },
};

export type TextoPrograma = typeof pt;

const es: TextoPrograma = {
  meta: {
    titulo:
      "Reset Metabólico 21 Días: menos hinchazón",
    descricao:
      "Protocolo científico de 21 días en 3 semanas para desinflamar, estabilizar la glucemia y perder grasa sin eliminar carbohidratos. Simula tu plan en 7 pasos.",
    ogTitulo: "Reset Metabólico 21 Días",
    ogDescricao:
      "3 semanas estructuradas por la Ciencia de los Alimentos para sacar tu metabolismo de la inercia — calculado para tu cuerpo.",
    ogAlt: "Reset Metabólico 21D — Adelgazar con Método",
  },

  semanas: [
    {
      semana: "Semana 01",
      dias: "Días 1 a 7",
      titulo: "Descompresión Glucémica y Deshinchazón",
      subtitulo: "El corte inmediato de la retención de líquidos y de los picos de hambre nocturna",
      mecanismo:
        "Ajustamos el reparto de proteína por comida, la densidad de fibra y la cinética de los carbohidratos. En 5 a 7 días la insulina basal se estabiliza, el volumen abdominal cede de forma visible y esas ganas descontroladas de dulce por la noche desaparecen.",
      entregavel:
        "Meta del Día 7: reducción de 1 a 2,5 kg (agua intracelular/glucógeno + inicio de la lipólisis) y hambre bajo control.",
    },
    {
      semana: "Semana 02",
      dias: "Días 8 a 14",
      titulo: "Oxidación Lipídica y Señal Mecánica",
      subtitulo: "Quema real de grasa preservando el 100 % de tu masa magra",
      mecanismo:
        "Con la glucemia estable y sin hambre de rebote, el déficit calórico calculado sobre tu Tasa Metabólica Basal obliga al cuerpo a oxidar tejido adiposo. El entrenamiento calibrado por Repeticiones en Reserva (RIR) le indica al cuerpo que el músculo no se puede gastar.",
      entregavel:
        "Meta del Día 14: reducción visible de la cintura, ropa más holgada y progresión de carga en el entrenamiento.",
    },
    {
      semana: "Semana 03",
      dias: "Días 15 a 21",
      titulo: "Blindaje Metabólico y Mapa del Día 22",
      subtitulo: "Recalibración sobre el peso nuevo para evitar el estancamiento",
      mecanismo:
        "En la tercera semana recalculamos los macros para tu nuevo peso corporal, evitando la termogénesis adaptativa precoz. Cierras el ciclo con autonomía alimentaria y recibes la ruta exacta de transición del Día 22 en adelante.",
      entregavel:
        "Meta del Día 21: fotos comparativas (Día 1 vs. Día 21), cintura medida y plan de continuidad listo.",
    },
  ],

  sintomas: [
    {
      titulo: "Te levantas bien, pero acabas el día hinchado",
      texto:
        "Mala combinación de volumen de comida, poca ingesta estratégica de agua/fibra y picos glucémicos que generan retención y distensión abdominal todos los días.",
    },
    {
      titulo: "Pierdes el control del hambre al final de la tarde",
      texto:
        "No es falta de fuerza de voluntad: es un error en la cinética proteica de la comida y la merienda. Cuando la glucemia se desploma a las 18 h, el cerebro exige calorías rápidas.",
    },
    {
      titulo: "Llevas meses entrenando y ves siempre el mismo cuerpo",
      texto:
        "Entrenar sin control de volumen y lejos de la proximidad correcta al fallo (RIR), sumado a calorías a ojo, te mantiene cansado y exactamente en el mismo sitio.",
    },
    {
      titulo: "Ya hiciste dietas restrictivas y lo recuperaste todo",
      texto:
        "Eliminar arroz, pan y fruta hunde la leptina, destruye masa magra y garantiza los atracones en la segunda semana. El Reset usa comida real, la de todos los días.",
    },
  ],

  entregaveis: [
    {
      codigo: "MÓDULO 01 · PRESCRIPCIÓN",
      titulo: "Plan Individual Calculado para las 3 Semanas",
      descricao:
        "Tus calorías exactas, gramos de proteína, carbohidrato y grasa por día y por comida, recalculados en cada bloque de 7 días a medida que baja el peso.",
      destaque: "Personalizado en el simulador",
    },
    {
      codigo: "MÓDULO 02 · NUTRICIÓN (PDF)",
      titulo: "Protocolo de Nutrición con Comida Real",
      descricao:
        "Cómo convertir tus metas calóricas en comida de verdad (arroz, legumbres, carnes, huevos, pan, fruta) — en el restaurante o en casa, sin depender de la báscula.",
      destaque: "Tabla de sustituciones incluida",
    },
    {
      codigo: "MÓDULO 03 · ENTRENAMIENTO (PDF)",
      titulo: "Periodización de Entrenamiento: Casa o Gimnasio",
      descricao:
        "Tu semana completa ejercicio por ejercicio, ajustada a tu nivel (principiante, retomando o avanzado) y a los días que de verdad tienes disponibles.",
      destaque: "Con ejercicios alternativos",
    },
    {
      codigo: "MÓDULO 04 · EJECUCIÓN (PDF)",
      titulo: "Guía de los Primeros 7 Días + Protocolo de Medición",
      descricao:
        "El paso a paso diario de la primera semana para cortar la hinchazón desde la salida y el manual para medir cintura, peso y fotos sin distorsión.",
      destaque: "Checklist de ejecución diaria",
    },
  ],

  perguntas: [
    {
      p: "¿Por qué funcionan 21 días sin ser otra 'dieta milagro'?",
      r: "Porque no prometemos cambiar toda tu vida en 3 semanas, sino ejecutar una intervención fisiológica precisa: 7 días para estabilizar la glucemia y cortar la retención de líquidos, 7 días para acelerar la oxidación de grasa protegiendo el músculo y 7 días para consolidar el ritmo y entregarte el mapa del Día 22.",
    },
    {
      p: "¿Tendré que eliminar carbohidratos, arroz o pan?",
      r: "En absoluto. Llevar los carbohidratos a cero solo vacía el glucógeno y el agua muscular, hunde tu rendimiento en el entrenamiento y genera rebote. El Reset Metabólico controla la carga glucémica combinando carbohidratos con proteína y fibra en la proporción correcta.",
    },
    {
      p: "¿Sirve si entreno en casa o nunca he ido al gimnasio?",
      r: "Sí. En el simulador eliges si vas a entrenar en casa (con tu peso corporal y una silla) o en el gimnasio, además de tu nivel actual. El programa arma el volumen exacto para tu realidad.",
    },
    {
      p: "¿Cómo recibo el acceso después del pago?",
      r: "El pago se procesa en un entorno seguro (Pix/tarjeta en Brasil o tarjeta/MB Way en Portugal y Europa). En cuanto se confirma, accedes a tu plataforma CS Performance en el sitio con tu e-mail para abrir tu calendario de 21 días, misiones diarias, recetas y protocolos en PDF.",
    },
    {
      p: "¿Y si siento que el programa no es para mí?",
      r: "Tienes 7 días de garantía incondicional. Puedes entrar, ver toda la prescripción, descargar los PDF y aplicar la primera semana completa. Si no quedas satisfecho por cualquier motivo, solo pide el reembolso y te devolvemos el 100 % de tu dinero.",
    },
  ],

  abertura: {
    breadcrumbAria: "Estás en",
    inicio: "Inicio",
    atual: "Reset Metabólico 21 Días",
    selo: "Adelgazar con Método · Con Ciencia",
    altEmblema: "Reset Metabólico 21D — Adelgazar con Método",
    h1: "Desbloquea tu metabolismo en",
    h1Destaque: "21 Días.",
    texto: [
      "Deshincha el abdomen en la ",
      "Semana 1",
      ", acelera la quema real de grasa en la ",
      "Semana 2",
      " y elimina el hambre de rebote en la ",
      "Semana 3",
      " — con calorías, macros y entrenamientos calculados para tu biología.",
    ],
    selos: [
      "⚡ Sin eliminar carbohidratos",
      "🍽️ Comida real, sin productos raros",
      "🏋️ Entreno en Casa o Gimnasio",
      "💻 Plataforma Interactiva + PDFs",
    ],
    ctaSimular: "Simular mi plan de 21 días",
    ctaDireto: "Acceso directo ·",
    autoria: ["Creado por ", "Carlos Seiti", " — 2 maestrías y doctorando en Ciencia de los Alimentos."],
    painelEyebrow: "Arquitectura de la Intervención",
    painelTitulo: "Qué cambia en 3 semanas",
    acessoUnico: "Acceso Único",
    fase: (i: number) => `Fase ${i}/3`,
    resumo: [
      { valor: "21 Días", nota: "3 bloques de 7 días" },
      { valor: "100%", nota: "Calculado para ti" },
      { valor: "7 Días", nota: "Garantía blindada" },
    ],
  },

  vendas: {
    sintomasEyebrow: "Por qué tu cuerpo se estancó",
    sintomasTitulo: "El problema no es tu genética. Es intentar adelgazar a ciegas.",
    sintomasTexto: [
      "Si te reconoces en al menos una de las cuatro señales de abajo, tu metabolismo no necesita más restricción — necesita un ",
      "Reset estructurado de 21 días",
      ".",
    ],
    sinalAlerta: "Señal de Alerta",

    cronoEyebrow: "Ciencia de los Alimentos Aplicada",
    cronoTitulo: "Por qué 21 días es la ventana exacta para desbloquear el metabolismo.",
    cronoTexto:
      "Olvida los retos de internet basados en pasar hambre. Aquí cada bloque de 7 días actúa sobre un mecanismo fisiológico real de tu cuerpo.",
    resultadoEsperado: "Resultado esperado el viernes:",

    plataformaEyebrow: "Por Dentro de la Plataforma CS Performance",
    plataformaTitulo:
      "No recibes un PDF suelto. Entras en un panel de ejecución de 21 días.",
    plataformaTexto: [
      "En cuanto se confirma tu pago, tu acceso abre el panel interactivo ",
      "CS Performance · Reset Metabólico 21D",
      " directamente en el navegador de tu móvil u ordenador:",
    ],
    plataformaItens: [
      {
        titulo: "Misiones diarias interactivas (Día 01 a Día 21):",
        texto: "marca cada tarea completada y mira cómo sube tu barra de progreso en tiempo real.",
      },
      {
        titulo: "Clases rápidas del día (3 min):",
        texto: "orientación directa y sin rodeos para blindar la mente y la disciplina.",
      },
      {
        titulo: "20 Recetas Prácticas y Snacks < 100 kcal:",
        texto:
          "opciones dulces y saladas con mucha proteína para quitarte las ganas de dulce sin salirte del plan.",
      },
      {
        titulo: "Diario de Progreso integrado:",
        texto: "registra peso, cintura, entrenamientos completados y adherencia a la alimentación.",
      },
    ],
    testarPlataforma: "Probar la plataforma por dentro ahora →",
    garantirAcesso: "Asegurar mi acceso ·",
    altPlataforma:
      "Panel de miembros CS Performance — Reset Metabólico 21D con calendario, misiones diarias, plan de alimentación y recetas",

    difEyebrow: "La Diferencia del Método",
    difTitulo: "Por qué los “retos de 21 días” comunes fallan — y por qué este funciona.",
    mercadoEyebrow: "❌ Lo que vende el mercado",
    mercadoTitulo: "Dietas Detox y Menús Genéricos de Cajón",
    mercadoItens: [
      "La misma dieta de 1.200 kcal para una mujer de 55 kg y un hombre de 95 kg.",
      "Elimina los carbohidratos por completo: en la primera semana solo pierdes agua y masa muscular.",
      "Ingredientes caros e irreales que nadie sostiene con una rutina de trabajo.",
      "El día 22 vuelves a comer normal y recuperas el doble del peso (efecto rebote).",
    ],
    metodoEyebrow: "✓ Ingeniería Alimentaria Aplicada",
    metodoTitulo: "Reset Metabólico 21 Días · Carlos Seiti",
    metodoItens: [
      {
        titulo: "Calculado para tu peso, altura, edad y rutina:",
        texto: "déficit seguro que preserva tu metabolismo basal.",
      },
      {
        titulo: "Cinética de nutrientes:",
        texto: "proteína y fibra calibradas para apagar el hambre nocturna sin eliminar arroz, pan ni fruta.",
      },
      {
        titulo: "Entrenamiento integrado (Casa o Gimnasio):",
        texto: "señal mecánica exacta para obligar al cuerpo a quemar grasa, no músculo.",
      },
      {
        titulo: "Protocolo del Día 22 incluido:",
        texto: "aprendes exactamente cómo pasar a mantenimiento o seguir definiendo.",
      },
    ],

    entregaveisEyebrow: "Acceso Inmediato al Área de Miembros",
    entregaveisTitulo: "Todo lo que recibes al desbloquear tu Reset hoy.",
    entregaveisTexto:
      "Nada de clases interminables que nunca ves. Recibes tu panel interactivo de 21 días y los protocolos directos en PDF para abrir en el móvil a la hora de comer y entrenar.",
    inclusoNoAcesso: "✓ Incluido en tu acceso de",

    provaEyebrow: "Resultados Reales del Método",
    provaTitulo: "Quien aplica dirección científica cambia el cuerpo de verdad.",
    provaCta: "Ver transformaciones en Instagram",
    altCarlos:
      "Carlos Seiti — Ingeniero de Alimentos, máster y doctorando en Ciencia de los Alimentos",
    seloCarlos: "MSc · PhD Cand. Ciencia de los Alimentos",
    autorEyebrow: "Quién creó el protocolo",
    autorTitulo: "Ciencia de laboratorio traducida a tu plato.",
    autorParagrafos: [
      "Soy Carlos Seiti. Trabajo con nutrición y entrenamiento desde una formación académica en Ciencia de los Alimentos — dos maestrías terminadas, doctorado en curso — y paso el día leyendo datos. Llevé ese rigor a la asesoría, porque la mayor parte de lo que circula sobre pérdida de grasa no sobrevive a una lectura crítica de la evidencia.",
      "También entreno y compito. Sé lo que es sostener un protocolo con trabajo, plazos y cansancio — por eso ningún plan mío depende de que seas perfecto.",
    ],
    credenciais: [
      { valor: "2×", rotulo: "Maestrías terminadas" },
      { valor: "PhD", rotulo: "Doctorando en Alimentos" },
      { valor: "39", rotulo: "Vidas transformadas" },
      { valor: "100%", rotulo: "Seguimiento individual" },
    ],

    ofertaSelo: "Inscripción Abierta · Acceso de por Vida a la Plataforma",
    altOferta: "Reset Metabólico 21D — Adelgazar con Método",
    ofertaTitulo: ["Empieza tu ", "Reset Metabólico 21D", " ahora."],
    ofertaTexto:
      "Menos que una sola comida fuera de casa para tener las 3 semanas calculadas, acceso a la plataforma CS Performance y todos los manuales prácticos firmados por Carlos Seiti.",
    resumoTitulo: "Resumen de lo que te llevas hoy:",
    resumoItens: [
      "✓ Plataforma Interactiva CS Performance 21D (Calendario, Misiones y Diario)",
      "✓ Prescripción Individual de las 3 Semanas (Calorías, Macros y Comidas)",
      "✓ Protocolo de Nutrición con Comida Real + 20 Recetas Prácticas (PDF)",
      "✓ Periodización de Entrenamiento Casa y Gimnasio + Guía de los 7 Días (PDF)",
    ],
    incluso: "Incluido",
    de: "Antes",
    porApenas: "ahora solo:",
    pagamentoUnico: "pago único · sin mensualidad",
    subirSimulador: "¿Quieres personalizarlo antes? Sube al simulador ↑",
    rotuloComprar: "Desbloquear mi Reset de 21 Días",
    aplicarConsultoria: "Quiero aplicar al Reset / Asesoría ·",
    verPreview: "Ver la plataforma por dentro (Preview) →",
    garantiaTitulo: "Garantía Blindada de 7 Días — Riesgo Cero",
    garantiaTexto:
      "Entra en la plataforma, descarga los protocolos en PDF y aplica toda la Semana 1 (Descompresión Glucémica). Si no notas tu abdomen deshinchado y tu hambre estabilizada, solo pide el reembolso dentro de los 7 días y te devolvemos el 100 % de tu dinero.",

    faqEyebrow: "Dudas Frecuentes",
    faqTitulo: "Preguntas antes de empezar tus 21 días.",
    faqRodape: [
      "¿Solo quieres ver tus índices por separado? Usa gratis la ",
      "calculadora de grasa corporal",
      " o la ",
      "calculadora de calorías",
      ".",
    ],
  },

  funil: {
    eyebrow: "Diagnóstico Interactivo Gratuito",
    titulo: "Simula tu Reset de 21 Días en 60 segundos",
    selo: "7 toques · Sin registro para ver el cálculo",
    passo: (i: number, total: number) => `Paso ${i} de ${total}`,
    sexo: {
      titulo: "¿Eres hombre o mujer?",
      nota: "La composición corporal y el gasto energético difieren lo suficiente como para cambiar todo el plan. Es el único motivo de la pregunta.",
      homem: "Hombre",
      mulher: "Mujer",
    },
    atual: {
      titulo: "¿Qué silueta es la tuya hoy?",
      nota: "Señala lo que ves en el espejo. El número viene después, por detrás.",
      grupo: "Silueta actual",
    },
    alvo: {
      titulo: "¿Y cuál es el cuerpo que quieres?",
      nota: "Elige por el cuerpo, no por el número. Es esta distancia la que recorre el programa.",
      grupo: "Silueta deseada",
    },
    numeros: {
      titulo: "Tus números de hoy",
      nota: "Con ellos se calcula el plan. La silueta dice a dónde ir; estos dicen desde dónde se parte.",
      idade: "Edad",
      anos: "años",
      altura: "Altura",
      peso: "Peso",
    },
    pesoAlvo: {
      titulo: "¿A dónde quieres llegar en la báscula?",
      nota: "Si el número y la silueta no coinciden, el programa te lo dice — y explica cuál de los dos vale la pena perseguir.",
      rotulo: "Peso deseado",
    },
    rotina: {
      titulo: "Cómo es tu día y dónde entrenas",
      nota: "El programa se arma sobre lo que tienes de verdad. Prometer cinco días y cumplir dos es peor que planear dos.",
      seuDia: "Tu día hoy",
      onde: "Dónde vas a entrenar",
      academia: ["Gimnasio", "Máquinas, barras y mancuernas"],
      casa: ["En casa", "Peso corporal y lo que tengas a mano"],
    },
    treino: {
      titulo: "Cuánto puedes entrenar",
      nota: "Última pregunta. El número que sostienes durante 21 días vale más que el que te gustaría hacer.",
      experiencia: "Tu experiencia",
      nunca: ["Nunca he entrenado", "O fue hace muchos años"],
      voltando: ["Estoy volviendo", "Entrené y lo dejé"],
      constante: ["Entreno hace tiempo", "De forma constante"],
      dias: "Días de entrenamiento por semana",
      diasAria: (d: number) => `${d} días de entrenamiento por semana`,
      refeicoes: "Comidas por día",
      refeicoesAria: (r: number) => `${r} comidas por día`,
    },
    voltar: "Volver",
    continuar: "Continuar",
    verPrograma: "Ver mi programa",
    voceEstaAqui: "Estás aquí",
    deGordura: (g: number) => `${g}% de grasa`,
  },

  resultado: {
    faltouTitulo: "Falta algún dato.",
    faltouTexto:
      "No pude armar el programa con lo que se completó. Vuelve un paso y revisa edad, altura y peso.",
    voltar: "Volver",
    eyebrow: (d: number) => `Tu programa de ${d} días`,
    tituloRecomp: "Tu caso no es perder peso — es cambiar la composición.",
    tituloCabe: (d: number) => `Lo que pediste cabe en los ${d} días.`,
    tituloNaoCabe: (d: number) => `Seamos exactos sobre lo que cabe en ${d} días.`,
    hoje: "Hoy",
    noDia: (d: number) => `El día ${d}`,
    dia: (d: number) => `Día ${d}`,
    gorduraAprox: (g: number) => `~${g}% de grasa`,
    balancaPouco: "la báscula se mueve poco a propósito",
    diferenca: (kg: string) => `${kg} kg de diferencia`,
    treino: "Entreno",
    porSemana: (d: number) => `${d}× / semana`,
    emCasa: "en casa",
    naAcademia: "en el gimnasio",
    precisaSaber: "Lo que necesitas saber",
    bloco: (n: number, intervalo: string) => `Bloque ${n} · ${intervalo}`,
    calorias: "Calorías",
    kcalDia: "kcal por día",
    proteina: "Proteína",
    carboidrato: "Carbohidrato",
    gordura: "Grasa",
    semanaTreino: (sessoes: number, series: number) =>
      `La semana de entrenamiento de este bloque — ${sessoes} sesiones, ${series} series`,
    maisFacil: "más fácil:",
    ultimoDia: "El último día del bloque",
    ajustar: "Ajustar las respuestas",
  },

  oferta: {
    eyebrow: (d: number) => `Acceso Inmediato · Reset Metabólico ${d} Días`,
    entrada: "Oferta de Entrada ·",
    alt: "Reset Metabólico 21D — Adelgazar con Método",
    titulo: "Acabas de ver el plan. El programa es cumplirlo.",
    texto: (d: number, blocos: number, dias: string) =>
      `Los ${d} días divididos en ${blocos} bloques semanales, con las sesiones numeradas, la guía alimentaria de sustituciones sin báscula, el registro de cargas y la medición en los días ${dias}. El plan de arriba, por escrito, en PDF y con fecha.`,
    itemPrescricao: (d: number) => `Prescripción de los ${d} días guardada en tu cuenta`,
    itemNutricao: "Protocolo de Nutrición con Comida Real (PDF)",
    itemTreino: (casa: boolean) =>
      `Protocolo de Entrenamiento (${casa ? "En Casa" : "Gimnasio"}) (PDF)`,
    itemGuia: "Guía de los Primeros 7 Días + Medición (PDF)",
    consultoria: "Empezar asesoría",
    garantia: "🛡️ Garantía incondicional de 7 días",
    assinatura:
      "Firmado por Carlos Seiti (MSc, PhD Cand.). El plan que viste en esta pantalla se guarda automáticamente con tu pedido.",
  },

  comprar: {
    rotuloPadrao: "Quiero el programa",
    erroAbrir: "No pude abrir el pago. Inténtalo de nuevo.",
    erroConexao: "Sin conexión con el pago. Inténtalo de nuevo en unos instantes.",
    erroEmail: "Revisa tu e-mail e inténtalo de nuevo.",
    email: "Tu e-mail para liberar el acceso inmediato",
    placeholder: "tu@email.com",
    abrindo: "Abriendo el pago…",
    rodape: (meios: string) =>
      `Pago seguro (${meios}). Acceso inmediato en tu cuenta CS Performance.`,
    meios: {
      BRL: "Pix, tarjeta o boleto",
      EUR: "Tarjeta, MB WAY o Apple/Google Pay",
    },
  },

  moeda: {
    grupo: "Moneda de visualización",
  },

  galeria: {
    ampliar: "Ampliar",
    ampliarAria: (nome: string) => `Ampliar la foto de antes y después de ${nome}`,
    abrirInstagram: (nome: string, handle: string) => `Abrir el Instagram de ${nome} (${handle})`,
    transformacao: (nome: string) => `Transformación de ${nome}`,
    verInstagram: "Ver Instagram",
    fechar: "Cerrar vista ampliada",
    alts: {
      "@carlosabraoficial": "Evolución corporal de Carlos Abra, con registros de antes y después",
      "@laisdas": "Evolución corporal de Laís, con registros de antes y después vistos de espaldas",
      "@luanitocastro": "Evolución corporal de Luanito Castro, con registros de antes y después",
      "@isaiassantos_2021": "Evolución corporal de Isaías Santos, con registros de antes y después",
    },
  },
};

const en: TextoPrograma = {
  meta: {
    titulo:
      "21-Day Metabolic Reset: beat the bloat",
    descricao:
      "A science-based 21-day protocol in 3 weeks to reduce inflammation, stabilize blood sugar and lose fat without cutting carbs. Simulate your plan in 7 steps.",
    ogTitulo: "21-Day Metabolic Reset",
    ogDescricao:
      "3 weeks structured by Food Science to pull your metabolism out of inertia — calculated for your body.",
    ogAlt: "Metabolic Reset 21D — Fat Loss with a Method",
  },

  semanas: [
    {
      semana: "Week 01",
      dias: "Days 1–7",
      titulo: "Blood-Sugar Decompression & De-bloat",
      subtitulo: "An immediate cut in water retention and nighttime hunger spikes",
      mecanismo:
        "We adjust protein distribution per meal, fiber density and carbohydrate kinetics. Within 5 to 7 days basal insulin stabilizes, abdominal volume visibly goes down and that out-of-control late-night sugar craving disappears.",
      entregavel:
        "Day 7 goal: 1 to 2.5 kg down (intracellular water/glycogen + the start of lipolysis) and hunger under control.",
    },
    {
      semana: "Week 02",
      dias: "Days 8–14",
      titulo: "Fat Oxidation & Mechanical Signal",
      subtitulo: "Real fat burning while preserving 100% of your lean mass",
      mecanismo:
        "With stable blood sugar and no rebound hunger, a calorie deficit calculated from your Basal Metabolic Rate forces the body to oxidize fat tissue. Training calibrated by Reps in Reserve (RIR) tells your body that muscle can't be spent.",
      entregavel:
        "Day 14 goal: a visibly smaller waistline, looser clothes and load progression in training.",
    },
    {
      semana: "Week 03",
      dias: "Days 15–21",
      titulo: "Metabolic Shield & Day 22 Map",
      subtitulo: "Recalibration for your new weight to avoid a plateau",
      mecanismo:
        "In the third week we recalculate your macros for your new body weight, avoiding early adaptive thermogenesis. You close the cycle with food autonomy and get the exact transition route for Day 22 onward.",
      entregavel:
        "Day 21 goal: comparison photos (Day 1 vs. Day 21), measured waist and a continuation plan ready.",
    },
  ],

  sintomas: [
    {
      titulo: "You wake up fine but end the day bloated",
      texto:
        "A poor mix of food volume, low strategic intake of water/fiber and blood-sugar spikes that cause retention and abdominal distension every single day.",
    },
    {
      titulo: "You lose control of hunger in the late afternoon",
      texto:
        "It's not a lack of willpower: it's a mistake in the protein kinetics of lunch and your snack. When blood sugar crashes at 6 p.m., your brain demands fast calories.",
    },
    {
      titulo: "You've trained for months and always see the same body",
      texto:
        "Training without volume control and far from the right proximity to failure (RIR), plus guesswork calories, keeps you tired and exactly where you started.",
    },
    {
      titulo: "You've done restrictive diets and gained it all back",
      texto:
        "Cutting rice, bread and fruit tanks leptin, destroys lean mass and guarantees binge eating by week two. The Reset uses real, everyday food.",
    },
  ],

  entregaveis: [
    {
      codigo: "MODULE 01 · PRESCRIPTION",
      titulo: "Individual Plan Calculated for All 3 Weeks",
      descricao:
        "Your exact calories, grams of protein, carbs and fat per day and per meal, recalculated every 7-day block as your weight comes down.",
      destaque: "Personalized in the simulator",
    },
    {
      codigo: "MODULE 02 · NUTRITION (PDF)",
      titulo: "Real-Food Nutrition Protocol",
      descricao:
        "How to turn your calorie targets into real food (rice, beans, meat, eggs, bread, fruit) — at a restaurant or at home, without relying on a food scale.",
      destaque: "Food swap table included",
    },
    {
      codigo: "MODULE 03 · TRAINING (PDF)",
      titulo: "Training Periodization: Home or Gym",
      descricao:
        "Your full week exercise by exercise, adjusted to your level (beginner, returning or advanced) and to the days you actually have available.",
      destaque: "With exercise alternatives",
    },
    {
      codigo: "MODULE 04 · EXECUTION (PDF)",
      titulo: "First 7 Days Guide + Measurement Protocol",
      descricao:
        "The day-by-day walkthrough of week one to cut bloating right out of the gate, plus the manual for measuring waist, weight and photos without distortion.",
      destaque: "Daily execution checklist",
    },
  ],

  perguntas: [
    {
      p: "Why do 21 days work without being another 'miracle diet'?",
      r: "Because we don't promise to change your whole life in 3 weeks — we run a precise physiological intervention: 7 days to stabilize blood sugar and cut water retention, 7 days to speed up fat oxidation while protecting muscle, and 7 days to lock in the rhythm and hand you the Day 22 map.",
    },
    {
      p: "Will I have to cut carbs, rice or bread?",
      r: "Not at all. Taking carbs to zero only drains glycogen and muscle water, tanks your training performance and causes rebound. The Metabolic Reset controls glycemic load by pairing carbs with protein and fiber in the right ratio.",
    },
    {
      p: "Does it work if I train at home or have never been to a gym?",
      r: "Yes. In the simulator you choose whether you'll train at home (with your body weight and a chair) or at the gym, plus your current level. The program builds the exact volume for your reality.",
    },
    {
      p: "How do I get access after paying?",
      r: "Payment is processed in a secure environment (Pix/card in Brazil or card/MB Way in Portugal and Europe). As soon as it's confirmed, you log in to your CS Performance platform on the site with your email to open your 21-day calendar, daily missions, recipes and PDF protocols.",
    },
    {
      p: "What if I feel the program isn't for me?",
      r: "You get a 7-day unconditional guarantee. You can log in, see the full prescription, download the PDFs and run the entire first week. If you're not satisfied for any reason, just request a refund and we'll return 100% of your money.",
    },
  ],

  abertura: {
    breadcrumbAria: "You are here",
    inicio: "Home",
    atual: "21-Day Metabolic Reset",
    selo: "Fat Loss with a Method · Backed by Science",
    altEmblema: "Metabolic Reset 21D — Fat Loss with a Method",
    h1: "Unlock your metabolism in",
    h1Destaque: "21 Days.",
    texto: [
      "De-bloat your belly in ",
      "Week 1",
      ", speed up real fat burning in ",
      "Week 2",
      " and shut down rebound hunger in ",
      "Week 3",
      " — with calories, macros and workouts calculated for your biology.",
    ],
    selos: [
      "⚡ No cutting carbs",
      "🍽️ Real, everyday food",
      "🏋️ Home or Gym Workouts",
      "💻 Interactive Platform + PDFs",
    ],
    ctaSimular: "Simulate my 21-day plan",
    ctaDireto: "Get direct access ·",
    autoria: ["Developed by ", "Carlos Seiti", " — two Master's degrees and PhD candidate in Food Science."],
    painelEyebrow: "Intervention Architecture",
    painelTitulo: "What changes in 3 weeks",
    acessoUnico: "One-Time Access",
    fase: (i: number) => `Phase ${i}/3`,
    resumo: [
      { valor: "21 Days", nota: "3 blocks of 7 days" },
      { valor: "100%", nota: "Calculated for you" },
      { valor: "7 Days", nota: "Ironclad guarantee" },
    ],
  },

  vendas: {
    sintomasEyebrow: "Why your body stalled",
    sintomasTitulo: "The problem isn't your genetics. It's trying to lose fat in the dark.",
    sintomasTexto: [
      "If you recognize yourself in at least one of the four signs below, your metabolism doesn't need more restriction — it needs a ",
      "structured 21-day Reset",
      ".",
    ],
    sinalAlerta: "Warning Sign",

    cronoEyebrow: "Applied Food Science",
    cronoTitulo: "Why 21 days is the exact window to unlock your metabolism.",
    cronoTexto:
      "Forget internet challenges built on starving yourself. Here every 7-day block acts on a real physiological mechanism in your body.",
    resultadoEsperado: "Expected result by Friday:",

    plataformaEyebrow: "Inside the CS Performance Platform",
    plataformaTitulo:
      "You don't get a loose PDF. You step into a 21-day execution dashboard.",
    plataformaTexto: [
      "As soon as your payment is confirmed, your access opens the interactive dashboard ",
      "CS Performance · Metabolic Reset 21D",
      " right in your phone or computer browser:",
    ],
    plataformaItens: [
      {
        titulo: "Interactive daily missions (Day 01 to Day 21):",
        texto: "check off each completed task and watch your progress bar rise in real time.",
      },
      {
        titulo: "Quick daily lessons (3 min):",
        texto: "straight-to-the-point guidance, no fluff, to lock in mindset and discipline.",
      },
      {
        titulo: "20 Practical Recipes & Snacks < 100 kcal:",
        texto:
          "sweet and savory high-protein options to kill sugar cravings without leaving the plan.",
      },
      {
        titulo: "Built-in Progress Journal:",
        texto: "log weight, waistline, completed workouts and nutrition adherence.",
      },
    ],
    testarPlataforma: "Try the platform from the inside now →",
    garantirAcesso: "Get my access ·",
    altPlataforma:
      "CS Performance member dashboard — Metabolic Reset 21D with calendar, daily missions, meal plan and recipes",

    difEyebrow: "The Method Difference",
    difTitulo: "Why typical “21-day challenges” fail — and why this one works.",
    mercadoEyebrow: "❌ What the market sells",
    mercadoTitulo: "Detox Diets & Generic Off-the-Shelf Meal Plans",
    mercadoItens: [
      "The same 1,200 kcal diet for a 55 kg woman and a 95 kg man.",
      "Carbs cut to zero: in the first week you only lose water and muscle.",
      "Expensive, unrealistic ingredients nobody can sustain with a work schedule.",
      "On day 22 you go back to eating normally and regain double the weight (yo-yo effect).",
    ],
    metodoEyebrow: "✓ Applied Food Engineering",
    metodoTitulo: "21-Day Metabolic Reset · Carlos Seiti",
    metodoItens: [
      {
        titulo: "Calculated for your weight, height, age and routine:",
        texto: "a safe deficit that preserves your basal metabolism.",
      },
      {
        titulo: "Nutrient kinetics:",
        texto: "protein and fiber calibrated to switch off nighttime hunger without cutting rice, bread or fruit.",
      },
      {
        titulo: "Integrated training (Home or Gym):",
        texto: "a precise mechanical signal that forces your body to burn fat, not muscle.",
      },
      {
        titulo: "Day 22 protocol included:",
        texto: "you learn exactly how to transition to maintenance or keep leaning out.",
      },
    ],

    entregaveisEyebrow: "Instant Access to the Members Area",
    entregaveisTitulo: "Everything you get when you unlock your Reset today.",
    entregaveisTexto:
      "No endless video lessons you never watch. You get your interactive 21-day dashboard and straight-to-the-point PDF protocols to open on your phone when it's time to eat and train.",
    inclusoNoAcesso: "✓ Included in your access for",

    provaEyebrow: "Real Results from the Method",
    provaTitulo: "People who apply scientific direction truly change their bodies.",
    provaCta: "See transformations on Instagram",
    altCarlos:
      "Carlos Seiti — Food Engineer, Master's and PhD candidate in Food Science",
    seloCarlos: "MSc · PhD Cand. Food Science",
    autorEyebrow: "Who created the protocol",
    autorTitulo: "Lab science translated to your plate.",
    autorParagrafos: [
      "I'm Carlos Seiti. I work with nutrition and training from an academic background in Food Science — two Master's degrees completed, PhD in progress — and I spend my days reading data. I brought that rigor to coaching, because most of what circulates about fat loss doesn't survive a critical reading of the evidence.",
      "I also train and compete. I know what it takes to stick to a protocol with work, deadlines and fatigue — that's why none of my plans depend on you being perfect.",
    ],
    credenciais: [
      { valor: "2×", rotulo: "Master's degrees" },
      { valor: "PhD", rotulo: "Food Science candidate" },
      { valor: "39", rotulo: "Lives transformed" },
      { valor: "100%", rotulo: "1-on-1 coaching" },
    ],

    ofertaSelo: "Enrollment Open · Lifetime Platform Access",
    altOferta: "Metabolic Reset 21D — Fat Loss with a Method",
    ofertaTitulo: ["Start your ", "Metabolic Reset 21D", " now."],
    ofertaTexto:
      "Less than a single meal out to get all 3 weeks calculated, access to the CS Performance platform and every practical manual signed by Carlos Seiti.",
    resumoTitulo: "Summary of what you get today:",
    resumoItens: [
      "✓ CS Performance 21D Interactive Platform (Calendar, Missions & Journal)",
      "✓ Individual 3-Week Prescription (Calories, Macros and Meals)",
      "✓ Real-Food Nutrition Protocol + 20 Practical Recipes (PDF)",
      "✓ Home & Gym Training Periodization + 7-Day Guide (PDF)",
    ],
    incluso: "Included",
    de: "Was",
    porApenas: "now only:",
    pagamentoUnico: "one-time payment · no subscription",
    subirSimulador: "Want to personalize first? Back to the simulator ↑",
    rotuloComprar: "Unlock my 21-Day Reset",
    aplicarConsultoria: "Apply for the Reset / Coaching ·",
    verPreview: "See the platform inside (Preview) →",
    garantiaTitulo: "Ironclad 7-Day Guarantee — Zero Risk",
    garantiaTexto:
      "Log in to the platform, download the PDF protocols and run all of Week 1 (Blood-Sugar Decompression). If you don't feel your belly de-bloat and your hunger stabilize, just request a refund within 7 days and we'll return 100% of your money.",

    faqEyebrow: "FAQ",
    faqTitulo: "Questions before you start your 21 days.",
    faqRodape: [
      "Just want to check your numbers on their own? Use the free ",
      "body fat calculator",
      " or the ",
      "calorie calculator",
      ".",
    ],
  },

  funil: {
    eyebrow: "Free Interactive Assessment",
    titulo: "Simulate your 21-Day Reset in 60 seconds",
    selo: "7 taps · No sign-up to see the math",
    passo: (i: number, total: number) => `Step ${i} of ${total}`,
    sexo: {
      titulo: "Are you a man or a woman?",
      nota: "Body composition and energy expenditure differ enough to change the whole plan. That's the only reason we ask.",
      homem: "Man",
      mulher: "Woman",
    },
    atual: {
      titulo: "Which physique is yours today?",
      nota: "Point to what you see in the mirror. The number comes later, behind the scenes.",
      grupo: "Current physique",
    },
    alvo: {
      titulo: "And what body do you want?",
      nota: "Choose by the body, not the number. This is the distance the program covers.",
      grupo: "Goal physique",
    },
    numeros: {
      titulo: "Your numbers today",
      nota: "The plan is calculated from them. The physique says where to go; these say where you start.",
      idade: "Age",
      anos: "years",
      altura: "Height",
      peso: "Weight",
    },
    pesoAlvo: {
      titulo: "Where do you want the scale to land?",
      nota: "If the number and the physique don't match, the program tells you — and explains which one is worth chasing.",
      rotulo: "Goal weight",
    },
    rotina: {
      titulo: "What your day looks like and where you train",
      nota: "The program is built on what you actually have. Promising five days and doing two is worse than planning two.",
      seuDia: "Your day today",
      onde: "Where you'll train",
      academia: ["Gym", "Machines, barbells and dumbbells"],
      casa: ["At home", "Body weight and whatever's around"],
    },
    treino: {
      titulo: "How much you can train",
      nota: "Last question. The number you can sustain for 21 days is worth more than the number you'd like to do.",
      experiencia: "Your experience",
      nunca: ["Never trained", "Or it was many years ago"],
      voltando: ["Getting back into it", "I used to train, then stopped"],
      constante: ["Training for a while", "Consistently"],
      dias: "Training days per week",
      diasAria: (d: number) => `${d} training days per week`,
      refeicoes: "Meals per day",
      refeicoesAria: (r: number) => `${r} meals per day`,
    },
    voltar: "Back",
    continuar: "Continue",
    verPrograma: "See my program",
    voceEstaAqui: "You are here",
    deGordura: (g: number) => `${g}% body fat`,
  },

  resultado: {
    faltouTitulo: "Some data is missing.",
    faltouTexto:
      "I couldn't build the program from what was filled in. Go back a step and check age, height and weight.",
    voltar: "Back",
    eyebrow: (d: number) => `Your ${d}-day program`,
    tituloRecomp: "Your case isn't about losing weight — it's about changing composition.",
    tituloCabe: (d: number) => `What you asked for fits into the ${d} days.`,
    tituloNaoCabe: (d: number) => `Let's be precise about what fits into ${d} days.`,
    hoje: "Today",
    noDia: (d: number) => `On day ${d}`,
    dia: (d: number) => `Day ${d}`,
    gorduraAprox: (g: number) => `~${g}% body fat`,
    balancaPouco: "the scale barely moves, on purpose",
    diferenca: (kg: string) => `${kg} kg difference`,
    treino: "Training",
    porSemana: (d: number) => `${d}× / week`,
    emCasa: "at home",
    naAcademia: "at the gym",
    precisaSaber: "What you need to know",
    bloco: (n: number, intervalo: string) => `Block ${n} · ${intervalo}`,
    calorias: "Calories",
    kcalDia: "kcal per day",
    proteina: "Protein",
    carboidrato: "Carbs",
    gordura: "Fat",
    semanaTreino: (sessoes: number, series: number) =>
      `This block's training week — ${sessoes} sessions, ${series} sets`,
    maisFacil: "easier:",
    ultimoDia: "On the last day of the block",
    ajustar: "Adjust my answers",
  },

  oferta: {
    eyebrow: (d: number) => `Instant Access · ${d}-Day Metabolic Reset`,
    entrada: "Intro Offer ·",
    alt: "Metabolic Reset 21D — Fat Loss with a Method",
    titulo: "You've just seen the plan. The program is following through on it.",
    texto: (d: number, blocos: number, dias: string) =>
      `The ${d} days split into ${blocos} weekly blocks, with numbered sessions, a scale-free food swap guide, a load log and check-ins on days ${dias}. The plan above, in writing, as a dated PDF.`,
    itemPrescricao: (d: number) => `Your ${d}-day prescription saved to your account`,
    itemNutricao: "Real-Food Nutrition Protocol (PDF)",
    itemTreino: (casa: boolean) => `Training Protocol (${casa ? "Home" : "Gym"}) (PDF)`,
    itemGuia: "First 7 Days Guide + Measurements (PDF)",
    consultoria: "Start coaching",
    garantia: "🛡️ 7-day unconditional guarantee",
    assinatura:
      "Signed by Carlos Seiti (MSc, PhD Cand.). The plan you saw on this screen is saved automatically with your order.",
  },

  comprar: {
    rotuloPadrao: "I want the program",
    erroAbrir: "I couldn't open the payment page. Please try again.",
    erroConexao: "Couldn't reach the payment provider. Please try again in a moment.",
    erroEmail: "Please check your email and try again.",
    email: "Your email to unlock instant access",
    placeholder: "you@email.com",
    abrindo: "Opening payment…",
    rodape: (meios: string) =>
      `Secure payment (${meios}). Instant access in your CS Performance account.`,
    meios: {
      BRL: "Pix, card or boleto",
      EUR: "Card, MB WAY or Apple/Google Pay",
    },
  },

  moeda: {
    grupo: "Display currency",
  },

  galeria: {
    ampliar: "Zoom",
    ampliarAria: (nome: string) => `Enlarge ${nome}'s before and after photo`,
    abrirInstagram: (nome: string, handle: string) => `Open ${nome}'s Instagram (${handle})`,
    transformacao: (nome: string) => `${nome}'s transformation`,
    verInstagram: "View Instagram",
    fechar: "Close enlarged view",
    alts: {
      "@carlosabraoficial": "Carlos Abra's body transformation, with before and after photos",
      "@laisdas": "Laís's body transformation, with before and after photos taken from behind",
      "@luanitocastro": "Luanito Castro's body transformation, with before and after photos",
      "@isaiassantos_2021": "Isaías Santos's body transformation, with before and after photos",
    },
  },
};

export const TEXTO_PROGRAMA: Record<Idioma, TextoPrograma> = { pt, es, en };
