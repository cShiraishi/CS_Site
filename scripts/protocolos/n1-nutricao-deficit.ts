/**
 * N1 — Nutrição em déficit.
 *
 * A divisão de trabalho entre a tela e este PDF é deliberada e vale
 * explicá-la, porque ela decide o conteúdo de todos os protocolos:
 *
 *  · A tela calcula. Ela sabe o peso, a altura, a idade e a silhueta, e
 *    devolve kcal e macros bloco por bloco. Isso é pessoal e não cabe num
 *    ficheiro estático.
 *  · O PDF executa. Ele transforma "160 g de proteína por dia" em palmas
 *    de frango e conchas de arroz, diz o que trocar quando o alimento não
 *    existe, e dá a escada de ajuste para quando a balança parar.
 *
 * Quem compra por R$ 47 não está a pagar pelo número — a calculadora do
 * site dá números de graça. Está a pagar por esta segunda metade.
 */

import { PROTEINA_POR_KG } from "../../src/lib/calorias";
import { DURACAO_PADRAO } from "../../src/lib/programa";
import { capa, documento, folha, milhar, n, type Marca } from "./identidade";
import { porcao, porcoesPara, tabela } from "./porcoes";

/* ============================================================
   PEÇAS DE CONTEÚDO
   ============================================================ */

/** Linhas de uma tabela de porções, com um rótulo de grupo opcional. */
function linhasPorcao(ids: string[], grupo?: string): string {
  const titulo = grupo
    ? `<tr><td class="grupo" colspan="7">${grupo}</td></tr>`
    : "";

  return (
    titulo +
    tabela(ids)
      .map(
        (p) => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.medida}</td>
        <td class="num">${p.gramas} g</td>
        <td class="num">${milhar(p.kcal)}</td>
        <td class="num">${p.p} g</td>
        <td class="num">${p.c} g</td>
        <td class="num">${p.g} g</td>
      </tr>`,
      )
      .join("")
  );
}

/**
 * Larguras fixas para as colunas das tabelas de porções.
 *
 * Sem isto cada tabela dimensiona-se pelo seu próprio conteúdo, e três
 * tabelas empilhadas na mesma folha ficam com a coluna "Medida de casa" a
 * começar em três sítios diferentes. Na tela ninguém repara; numa folha
 * impressa é a primeira coisa que se vê.
 */
function cabecalhoPorcao(): string {
  return `
    <colgroup>
      <col style="width:50mm" /><col style="width:38mm" />
      <col style="width:16mm" /><col style="width:16mm" />
      <col style="width:16mm" /><col style="width:16mm" /><col style="width:16mm" />
    </colgroup>
    <tr>
      <th>Alimento</th>
      <th>Medida de casa</th>
      <th class="num">Peso</th>
      <th class="num">kcal</th>
      <th class="num">Prot.</th>
      <th class="num">Carb.</th>
      <th class="num">Gord.</th>
    </tr>`;
}

/* ============================================================
   AS FOLHAS
   ============================================================ */

function folhaAbertura(): string {
  return `
<div class="secao">
  <h2>O que este protocolo é —<br />e o que ele não é</h2>
  <hr class="fio-curto" />
  <p>
    A tela do programa deu os seus números: quantas calorias por dia, quanta
    proteína, quanto carboidrato, quanta gordura, em cada um dos três blocos
    de 30 dias. Este protocolo é a outra metade do trabalho, a que nenhuma
    calculadora faz: <strong>transformar esses gramas em comida</strong>.
  </p>
  <p>
    Não há lista de alimentos proibidos aqui. Há feijoada, pizza e cerveja nas
    tabelas das próximas páginas, com os números ao lado — porque a sua vida
    tem feijoada, pizza e cerveja, e um plano que finge o contrário dura onze
    dias. O que existe é aritmética: cada coisa tem um preço em calorias, e
    saber o preço é o que permite escolher.
  </p>
</div>

<div class="secao">
  <h3>O que ele não é</h3>
  <ul class="limpa">
    <li><strong>Não é prescrição médica nem nutricional individualizada.</strong>
      É um protocolo de execução construído sobre os números que você mesmo
      informou. Avaliação individual pressupõe exames, histórico e consulta.</li>
    <li><strong>Não é uma dieta de ${milhar(1200)} kcal.</strong> O motor do
      programa não corta abaixo do seu metabolismo basal, nem mais de 25 % do
      seu gasto, em nenhum bloco. Se você esperava um número menor, o número
      menor é o que faz a pessoa recuperar o peso no mês 4.</li>
    <li><strong>Não promete quilos.</strong> Promete ${DURACAO_PADRAO} dias de
      método e um ritmo que a literatura de intervenção sustenta: algo entre
      0,5 % e 1 % do peso corporal por semana.</li>
  </ul>
</div>

<div class="nota">
  <h3>Procure um médico antes, se</h3>
  <p>
    Você está grávida ou amamentando; tem ou teve transtorno alimentar; tem
    doença renal, hepática ou cardíaca; é diabético em uso de insulina ou de
    secretagogos; usa medicação de uso contínuo que dependa de peso ou de
    horário de refeição; tem menos de 18 anos.
  </p>
  <p>
    Nenhuma dessas situações impede o programa. Todas elas mudam a forma de
    o fazer, e essa mudança é clínica — não é de PDF.
  </p>
</div>`;
}

function folhaFicha(): string {
  /*
   * A ficha é escrita à mão de propósito.
   *
   * Um PDF estático não conhece os números desta pessoa, e preenchê-los
   * exigiria gerar um ficheiro por cliente — o que atrasa a entrega, gasta
   * em cada venda e cria o problema de guardar PDFs com dados pessoais.
   * Copiar três linhas da tela custa um minuto e tem um efeito que a
   * geração automática não tem: quem escreve o número decora o número.
   */
  const linhas = [1, 2, 3]
    .map(
      (b) => `
      <tr>
        <td><strong>Bloco ${b}</strong><br /><span style="font-size:8pt; color:var(--tinta-fraca)">Dias ${
          (b - 1) * 30 + 1
        } a ${b * 30}</span></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
      </tr>`,
    )
    .join("");

  return `
<div class="secao">
  <h2>A sua ficha</h2>
  <hr class="fio-curto" />
  <p>
    Copie da tela do programa, uma linha por bloco. Depois disto, o resto do
    protocolo é execução — e você não precisa de voltar ao site para nada.
  </p>
</div>

<div class="secao">
  <table>
    <caption>Em carlosseiti.com/programa-90-dias, a mesma resposta é gerada de novo com os mesmos dados.</caption>
    <tr>
      <th style="width:28mm">Bloco</th>
      <th class="num">Peso inicial</th>
      <th class="num">kcal / dia</th>
      <th class="num">Proteína</th>
      <th class="num">Carboidrato</th>
      <th class="num">Gordura</th>
    </tr>
    ${linhas}
  </table>
</div>

<div class="secao grade g2">
  <div class="cartao">
    <h3>As duas medidas do dia 1</h3>
    <p style="font-size:8.5pt; color:var(--tinta-fraca); margin-bottom:1mm">Peso, em jejum</p>
    <p style="font-size:9.5pt; margin-bottom:5mm">
      <span class="vago" style="min-width:30mm">&nbsp;</span>&nbsp;kg
    </p>
    <p style="font-size:8.5pt; color:var(--tinta-fraca); margin-bottom:1mm">Cintura, na altura do umbigo</p>
    <p style="font-size:9.5pt">
      <span class="vago" style="min-width:30mm">&nbsp;</span>&nbsp;cm
    </p>
    <p style="font-size:9pt; color:var(--tinta-fraca); margin-top:4mm">
      A cintura é a medida que continua a mexer-se nas semanas em que a
      balança empaca. É por isso que ela está aqui.
    </p>
  </div>
  <div class="cartao">
    <h3>As fotos</h3>
    <p style="font-size:9.5pt">
      Frente e lado, de manhã, em jejum, mesma roupa, mesma parede, mesma luz.
      Hoje, no dia 30, no 60 e no 90.
    </p>
    <p style="font-size:9pt; color:var(--tinta-fraca); margin-top:3mm">
      Você não vai querer tirar a primeira. Tire. É a única das quatro que não
      pode ser tirada depois.
    </p>
  </div>
</div>

<div class="nota">
  <h3>Por que três alvos e não um</h3>
  <p>
    Gasto energético acompanha massa corporal: perder 6 kg reduz o seu gasto
    diário em algumas centenas de calorias. Manter o alvo do dia 1 até ao dia
    90 é, por construção, chegar ao segundo mês com um déficit que já não
    existe — o platô que quase todo mundo atribui a metabolismo lento.
    Cada bloco recalcula sobre o peso projetado do anterior.
  </p>
</div>`;
}

function folhaPrato(): string {
  const base = ["arroz-branco", "arroz-integral", "feijao-carioca", "macarrao", "mandioca-cozida", "pure"];
  const proteinas = ["frango-grelhado", "bife-grelhado", "peixe-grelhado", "lombo-porco", "ovo-cozido", "camarao"];

  return `
<div class="secao">
  <h2>O prato, sem balança</h2>
  <hr class="fio-curto" />
  <p>
    A sua mão acompanha o seu tamanho e está sempre com você. Todas as
    medidas deste protocolo são de casa — concha, palma, colher de servir —
    com o peso ao lado para quando houver balança.
  </p>
</div>

<div class="secao">
  <table>
    ${cabecalhoPorcao()}
    ${linhasPorcao(proteinas, "Proteínas")}
    ${linhasPorcao(base, "Base e acompanhamentos")}
  </table>
</div>

<div class="nota">
  <h3>O erro que não aparece no prato</h3>
  <p>
    O óleo de cozinha. Um fio de azeite é ${porcao("azeite").kcal} kcal e não
    muda a aparência de nada; três colheres de sopa numa panela de refogado
    são mais de 350 kcal invisíveis. Na Calculadora do Prato, no site, a
    incerteza dos refogados é de 25 % justamente por isso.
  </p>
  <p>
    Se um único hábito mudar nesta semana, que seja medir o óleo com a colher
    em vez de o verter da garrafa.
  </p>
</div>`;
}

function folhaProteina(): string {
  return `
<div class="secao">
  <h2>Quanta proteína,<br />em palmas</h2>
  <hr class="fio-curto" />
  <p>
    A meta de proteína é a mais difícil de cumprir e a que mais muda o
    resultado. Esta tabela traduz o seu número em comida — e mostra que ele
    é alcançável sem nenhum suplemento.
  </p>
</div>

<div class="secao">
  <table>
    <caption>Em déficit o plano usa ${n(PROTEINA_POR_KG.perder)} g por quilo de peso — o mesmo número que o motor aplica na tela.</caption>
    <tr>
      <th>Se o seu peso é</th>
      <th class="num">Proteína / dia</th>
      <th class="num">Equivale a</th>
      <th class="num">Por refeição, em 4</th>
    </tr>
    ${[60, 70, 80, 90, 100, 110]
      .map((peso) => {
        const meta = Math.round(peso * PROTEINA_POR_KG.perder);
        const palmas = porcoesPara("frango-grelhado", meta);
        /*
         * Por refeição em gramas, e não em palmas.
         *
         * Em palmas, o arredondamento ao meio transforma 0,75 e 1,12 no
         * mesmo "1" — quatro faixas de peso diferentes dariam a mesma
         * instrução, que é a forma mais limpa de uma tabela mentir.
         */
        const porRefeicao = Math.round(meta / 4 / 5) * 5;
        return `
      <tr>
        <td>${peso} kg</td>
        <td class="num">${meta} g</td>
        <td class="num">${n(palmas)} palmas de frango</td>
        <td class="num">${porRefeicao} g</td>
      </tr>`;
      })
      .join("")}
  </table>
</div>

<div class="secao grade g2">
  <div class="cartao">
    <h3>A ordem dentro do prato</h3>
    <ol>
      <li>Salada e legumes primeiro — ocupam volume por quase nenhuma caloria.</li>
      <li>Proteína em seguida — é a meta mais difícil e a que mais sacia.</li>
      <li>Carboidrato por último, com o que sobrou do alvo.</li>
    </ol>
    <p style="font-size:9pt; color:var(--tinta-fraca)">
      Na ordem inversa o carboidrato preenche o prato e a proteína fica para
      o fim do dia, quando já não cabe.
    </p>
  </div>
  <div class="escuro">
    <h3>Cinco ou seis refeições?</h3>
    <p style="font-size:9.5pt">
      Não aceleram nada. A frequência de refeições não altera gasto
      energético de forma relevante — o que altera é a sua adesão. Se cinco
      cabem na sua rotina, use cinco. Se a terceira acontece às pressas no
      carro, use três.
    </p>
  </div>
</div>`;
}

function folhaTrocas(): string {
  const proteinas = ["frango-grelhado", "picanha", "linguica", "frango-empanado"];
  const carbos = ["arroz-branco", "pao-frances", "farofa", "batata-frita", "mandioca-frita"];
  const extras = ["azeite", "maionese", "catupiry", "salada-folhas"];

  return `
<div class="secao">
  <h2>O que custa o quê</h2>
  <hr class="fio-curto" />
  <p>
    Mesma medida de casa, preços diferentes. Nada aqui é proibido — o que
    muda é a escolha deixar de ser adivinhada.
  </p>
</div>

<div class="secao">
  <h3>Proteínas · mesma palma, outro preço</h3>
  <table>
    ${cabecalhoPorcao()}
    ${linhasPorcao(proteinas)}
  </table>
</div>

<div class="secao">
  <h3>Carboidratos e acompanhamentos</h3>
  <table>
    ${cabecalhoPorcao()}
    ${linhasPorcao(carbos)}
  </table>
</div>

<div class="secao">
  <h3>Molhos, extras e o que é quase de graça</h3>
  <table>
    ${cabecalhoPorcao()}
    ${linhasPorcao(extras)}
  </table>
</div>

${notaDaFarofa()}`;
}

/**
 * A nota da farofa, calculada e não afirmada.
 *
 * A primeira versão desta nota dizia que uma colher de farofa tem mais
 * calorias que uma concha de arroz. É falso — são 101 contra 128 — e o
 * erro passou porque a frase soava certa. Agora a comparação sai dos
 * mesmos números que estão impressos na tabela acima, e se a tabela
 * mudar, a frase muda com ela.
 */
function notaDaFarofa(): string {
  const farofa = porcao("farofa");
  const arroz = porcao("arroz-branco");
  const vezes = Math.round((arroz.gramas / farofa.gramas) * 10) / 10;

  return `
<div class="nota">
  <p>
    <strong>Leia a farofa outra vez.</strong> Uma colher de servir são
    ${farofa.kcal} kcal em ${farofa.gramas} g; uma concha de arroz são
    ${arroz.kcal} kcal em ${arroz.gramas} g — quase as mesmas calorias com
    ${n(vezes)} vezes o peso. É o que quer dizer densidade energética: a
    farofa não enche o prato nem a barriga, e duas colheres custam mais do
    que o arroz inteiro que você cortou para compensar.
  </p>
</div>`;
}

function folhaDia(): string {
  /*
   * Os modelos são frações do dia, não gramas fixos.
   *
   * O alvo calórico muda por pessoa e por bloco, então um modelo em gramas
   * só serviria a quem tivesse exatamente aquele alvo. Em frações, o mesmo
   * modelo serve a todos os alvos e a todos os blocos — e é assim que o
   * motor do programa distribui as refeições na tela.
   */
  /*
   * As fatias são calculadas, não escritas.
   *
   * Em três refeições dá 33, 33 e 34 — a última absorve o arredondamento,
   * que é exatamente o que `distribuir()` faz na tela. Escrever "33 %"
   * três vezes somaria 99 e deixaria um por cento do dia sem dono.
   */
  const modelo = (refeicoes: [string, string][]) => {
    const fatia = Math.floor(100 / refeicoes.length);
    const sobra = 100 - fatia * refeicoes.length;

    return `
    <table>
      <colgroup>
        <col style="width:38mm" /><col style="width:28mm" /><col />
      </colgroup>
      <tr><th>Refeição</th><th class="num">Fatia do dia</th><th>Como fica na prática</th></tr>
      ${refeicoes
        .map(
          ([nome, pratico], i) => `
      <tr>
        <td><strong>${nome}</strong></td>
        <td class="num">${fatia + (i === refeicoes.length - 1 ? sobra : 0)} %</td>
        <td style="font-size:8.5pt; color:var(--tinta-fraca)">${pratico}</td>
      </tr>`,
        )
        .join("")}
    </table>`;
  };

  const tres = modelo([
    ["Café da manhã", "2 ovos cozidos, 1 fatia de cuscuz, 1 fruta"],
    ["Almoço", "1 palma de frango, 1 concha de arroz, 1 concha de feijão, pegador de salada"],
    ["Jantar", "1 palma de peixe, 2 colheres de legumes, 1 colher de mandioca"],
  ]);

  const quatro = modelo([
    ["Café da manhã", "Omelete de 2 ovos, 1 tapioca pequena"],
    ["Almoço", "1 palma de bife, 1 concha de arroz, 1 concha de feijão, salada"],
    ["Lanche", "1 fruta e 2 fatias de queijo, ou 1 sanduíche natural"],
    ["Jantar", "1 palma de frango, 2 colheres de legumes no vapor"],
  ]);

  const cinco = modelo([
    ["Café da manhã", "2 ovos cozidos, 1 fatia de cuscuz"],
    ["Lanche", "1 fruta, 2 fatias de queijo"],
    ["Almoço", "1 palma de frango, 1 concha de arroz, 1 concha de feijão, salada"],
    ["Lanche", "1 tapioca com queijo, ou iogurte com fruta"],
    ["Jantar", "1 palma de peixe, 2 colheres de legumes"],
  ]);

  return `
<div class="secao">
  <h2>Montar o dia</h2>
  <hr class="fio-curto" />
  <p>
    O programa divide o dia por igual entre as refeições que você disse
    conseguir fazer, e distribui a proteína por igual entre elas. Isso não é
    arredondamento: o estímulo de síntese proteica responde à dose por
    refeição, não ao total despejado de uma vez.
  </p>
</div>

<div class="secao">
  <h3>Três refeições</h3>
  ${tres}
</div>

<div class="secao">
  <h3>Quatro refeições</h3>
  ${quatro}
</div>

<div class="secao">
  <h3>Cinco refeições</h3>
  ${cinco}
</div>

<div class="nota">
  <p>
    <strong>A fatia do dia é a mesma para todos os blocos.</strong> O que muda
    de um bloco para o outro é o alvo total, que diminui com o peso — então
    o modelo não precisa de ser refeito: a mesma divisão aplicada ao número
    novo da sua ficha dá as refeições do bloco novo.
  </p>
</div>`;
}

function folhaRegras(): string {
  const cerveja = porcao("cerveja");
  const refri = porcao("refrigerante");
  const suco = porcao("suco-natural");

  return `
<div class="secao">
  <h2>As cinco regras<br />do déficit</h2>
  <hr class="fio-curto" />
</div>

<div class="secao">
  <h3>1 · Proteína é piso, não teto</h3>
  <p>
    A meta de proteína da sua ficha é o mínimo do dia. Ultrapassá-la não
    atrapalha o déficit: proteína é o macronutriente mais saciante por
    caloria e o que protege massa magra enquanto o resto diminui. Ficar
    abaixo dela é o que faz a balança descer com massa magra dentro.
  </p>
</div>

<div class="secao">
  <h3>2 · Volume antes de caloria</h3>
  <p>
    Um pegador de folhas e tomate é ${porcao("salada-folhas").kcal} kcal e
    ocupa um terço do prato. Duas colheres de legumes no vapor são
    ${porcao("legumes-vapor", 2).kcal} kcal. Fome em déficit é, em boa parte,
    volume gástrico — e volume é a coisa mais barata do cardápio.
  </p>
</div>

<div class="secao">
  <h3>3 · Caloria líquida não enche</h3>
  <p>
    Um copo de ${refri.gramas} ml de refrigerante: ${refri.kcal} kcal. De suco
    natural de laranja: ${suco.kcal} kcal — natural não quer dizer sem
    calorias. Uma long neck de cerveja: ${cerveja.kcal} kcal. Nenhum dos três
    reduz a fome da refeição seguinte em nada.
  </p>
</div>

<div class="secao">
  <h3>4 · Álcool cobra duas vezes</h3>
  <p>
    A primeira é direta: 7 kcal por grama, mais que carboidrato e proteína. A
    segunda é a que estraga a semana — álcool reduz a inibição, e a decisão
    alimentar das duas horas seguintes deixa de ser sua. Se vai beber, decida
    antes o que vai comer depois.
  </p>
</div>

<div class="escuro">
  <h3>5 · A aritmética do fim de semana</h3>
  <p style="font-size:9.5pt; max-width:none">
    Esta é a regra que explica a maioria dos ${DURACAO_PADRAO} dias que não
    dão resultado. Suponha um déficit de 500 kcal por dia, cumprido com rigor
    de segunda a sexta: <strong>${milhar(2500)} kcal de déficit na semana</strong>.
  </p>
  <p style="font-size:9.5pt; max-width:none">
    Agora o sábado e o domingo livres. Uma pizza de quatro fatias
    (${milhar(porcao("pizza-mussarela", 4).kcal)} kcal), três long necks
    (${milhar(porcao("cerveja", 3).kcal)} kcal) e uma sobremesa: passa de
    ${milhar(1500)} kcal acima do habitual num dia só. Dois dias assim anulam
    a semana inteira — e a sensação, inteiramente honesta, é de ter feito
    dieta a semana toda.
  </p>
  <p style="font-size:9.5pt; max-width:none">
    O programa não pede fim de semana igual aos outros dias. Pede que o fim
    de semana entre na conta: <strong>o déficit é semanal, não diário</strong>.
    Reserve as calorias — corte um pouco mais de segunda a sexta e gaste no
    sábado, de propósito, sem culpa e sem compensar na segunda.
  </p>
</div>`;
}

function folhaPlato(): string {
  return `
<div class="secao">
  <h2>Quando a balança para</h2>
  <hr class="fio-curto" />
  <p>
    Vai parar. Não é defeito do plano nem do seu metabolismo: peso corporal
    oscila um a dois quilos por água, sódio, glicogênio, intestino e — nas
    mulheres — fase do ciclo. Nenhum desses movimentos é gordura.
  </p>
</div>

<div class="secao">
  <h3>Primeiro, a régua certa</h3>
  <ul class="limpa">
    <li>Pese-se em <strong>três manhãs da semana</strong>, em jejum, depois do
      banheiro, sem roupa. Use a <strong>média das três</strong>.</li>
    <li>Compare médias de semanas, nunca dias com dias.</li>
    <li>Só considere um platô depois de <strong>14 dias sem a média se mover</strong>.</li>
  </ul>
  <p>
    Uma pesagem única contra a de ontem mede sobretudo o sal do jantar. Foi a
    comparação errada que fez muita gente abandonar um plano que estava a
    funcionar.
  </p>
</div>

<div class="secao">
  <h3>Depois, a escada — nesta ordem</h3>
  <table>
    <tr><th style="width:12mm">Grau</th><th>O que conferir</th><th>Por que vem aqui</th></tr>
    <tr>
      <td><strong>1</strong></td>
      <td>Adesão real dos 14 dias: fins de semana, óleo de cozinha, bebidas, provas de comida enquanto cozinha.</td>
      <td style="font-size:8.5pt; color:var(--tinta-fraca)">É a causa na grande maioria dos casos, e a única que não custa nada corrigir.</td>
    </tr>
    <tr>
      <td><strong>2</strong></td>
      <td>Sono e passos. Menos de 6 h de sono e queda de atividade espontânea reduzem o gasto do dia sem aparecer em lugar nenhum.</td>
      <td style="font-size:8.5pt; color:var(--tinta-fraca)">O gasto caiu, o plano não.</td>
    </tr>
    <tr>
      <td><strong>3</strong></td>
      <td>Acrescente <strong>${milhar(2000)} passos por dia</strong>, e espere mais 14 dias.</td>
      <td style="font-size:8.5pt; color:var(--tinta-fraca)">Aumentar gasto antes de cortar comida preserva a adesão e a massa magra.</td>
    </tr>
    <tr>
      <td><strong>4</strong></td>
      <td>Só agora: corte <strong>10 % das calorias</strong> do bloco, mantendo a proteína intacta.</td>
      <td style="font-size:8.5pt; color:var(--tinta-fraca)">O corte sai do carboidrato e da gordura, nunca do piso de proteína.</td>
    </tr>
    <tr>
      <td><strong>5</strong></td>
      <td>Nunca abaixo do seu metabolismo basal, e nunca mais de 25 % abaixo do seu gasto total.</td>
      <td style="font-size:8.5pt; color:var(--tinta-fraca)">É o teto de segurança do motor do programa. Abaixo disso, perde-se músculo.</td>
    </tr>
  </table>
</div>

<div class="nota">
  <h3>O que não está na escada</h3>
  <p>
    Cardio em jejum, chá, suplemento termogênico, jejum de 24 horas, cortar
    carboidrato à noite. Nenhum deles aparece aqui porque nenhum deles
    resolve um platô — e o tempo gasto a tentá-los é o tempo que o grau 1
    levaria a resolver.
  </p>
</div>`;
}

function folhaRegistro(): string {
  /*
   * As semanas saem da duração do programa, e não de um 12 escrito à mão.
   *
   * Vale a pena dizer por quê: 12 semanas são 84 dias, e o programa tem
   * 90. Uma grelha de doze linhas perde os últimos seis dias — justamente
   * os do fim do bloco 3, que é onde se decide o que fica. É o género de
   * descuido que ninguém reclama e todo mundo repara.
   */
  const total = Math.ceil(DURACAO_PADRAO / 7);

  const linhas = Array.from({ length: total }, (_, i) => i + 1)
    .map((s) => {
      const inicio = (s - 1) * 7 + 1;
      const fim = Math.min(s * 7, DURACAO_PADRAO);
      return `
      <tr>
        <td><strong>${s}</strong><br /><span style="font-size:7.5pt; color:var(--tinta-fraca)">dias ${inicio}–${fim}</span></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
        <td class="vago-celula"></td>
      </tr>`;
    })
    .join("");

  return `
<div class="secao">
  <h2>O registro das semanas</h2>
  <hr class="fio-curto" />
  <p>
    Uma linha por semana: a média de três pesagens, a cintura, quantas
    sessões de treino saíram das que estavam marcadas, e uma nota — viagem,
    doença, semana de muito trabalho. A nota é o que torna o número
    interpretável três semanas depois.
  </p>
  <p style="font-size:9pt; color:var(--tinta-fraca)">
    São ${total} linhas e não 12, porque ${DURACAO_PADRAO} dias são doze
    semanas e mais ${DURACAO_PADRAO - 84} dias. A última linha é curta de
    propósito.
  </p>
</div>

<table>
  <tr>
    <th style="width:20mm">Semana</th>
    <th class="num" style="width:32mm">Peso médio (kg)</th>
    <th class="num" style="width:28mm">Cintura (cm)</th>
    <th class="num" style="width:22mm">Sessões</th>
    <th>Nota</th>
  </tr>
  ${linhas}
</table>`;
}

function folhaFecho(marca: Marca): string {
  return `
<div class="secao">
  <h2>O que vem depois<br />do dia 90</h2>
  <hr class="fio-curto" />
  <p>
    O dia ${DURACAO_PADRAO + 1} é onde a maioria dos resultados se perde, e
    não por falta de disciplina: é por falta de plano. Quem passa
    ${DURACAO_PADRAO} dias em déficit e volta a comer &ldquo;normal&rdquo;
    volta a um normal que produzia o peso antigo.
  </p>
  <p>
    O protocolo <strong>N4 — Nutrição em manutenção</strong> existe para isso,
    e está na sua área de entrega. Abra-o na semana 11, não na 13.
  </p>
</div>

<div class="secao grade g2">
  <div class="cartao">
    <h3>Os outros protocolos</h3>
    <ul class="limpa">
      <li>O seu protocolo de treino, conforme o local e a experiência</li>
      <li>G1 — Como medir</li>
      <li>G2 — Os primeiros 7 dias</li>
      <li>G3 — Tabela de substituições</li>
      <li>G4 — Registro de cargas</li>
      <li>G5 — Quando o peso para</li>
    </ul>
  </div>
  <div class="cartao">
    <h3>Onde perguntar</h3>
    <p style="font-size:9.5pt">
      ${marca.site}<br />
      ${marca.nome} no Instagram<br /><br />
      A área de entrega fica disponível com o seu e-mail de compra, sem prazo
      de validade.
    </p>
  </div>
</div>

<div class="nota">
  <h3>Os limites deste documento, ditos de uma vez</h3>
  <p>
    As equações de gasto energético (Mifflin-St Jeor e companhia) têm erro
    típico de 10 % a 15 % entre indivíduos. Os valores nutricionais são
    estimativas de cardápio com base em TACO e TBCA, ajustadas para cima
    onde o prato de restaurante leva mais óleo que a versão de laboratório —
    não são análise bromatológica do seu almoço.
  </p>
  <p>
    Isto significa que o seu alvo é um ponto de partida calibrado, não uma
    medição. O que o corrige é o seu registro semanal: duas semanas de dados
    seus valem mais que qualquer equação.
  </p>
</div>

<div style="margin-top:12mm; padding-top:6mm; border-top:1pt solid var(--ouro)">
  <div style="font-family:var(--serif); font-size:17pt; line-height:1.2">${marca.nome}</div>
  <div style="font-size:7.5pt; letter-spacing:0.2em; text-transform:uppercase; color:var(--ouro-profundo); margin-top:1.5mm">
    ${marca.assinatura}
  </div>
</div>`;
}

/* ============================================================
   O DOCUMENTO
   ============================================================ */

export function n1(dados: { marca: Marca; quando: string }): string {
  const { marca } = dados;
  const corrido = "Programa 90 dias · N1 · Nutrição em déficit";

  const interiores = [
    folhaAbertura(),
    folhaFicha(),
    folhaPrato(),
    folhaProteina(),
    folhaTrocas(),
    folhaDia(),
    folhaRegras(),
    folhaPlato(),
    folhaRegistro(),
    folhaFecho(marca),
  ];

  // A capa não leva número; o interior conta a partir de 1.
  const total = interiores.length;

  return documento({
    titulo: "N1 — Nutrição em déficit · Programa 90 Dias",
    folhas: [
      capa({
        marca,
        codigo: "Protocolo N1",
        titulo: "Nutrição em déficit",
        subtitulo:
          "O seu alvo calórico convertido em comida de verdade — conchas, palmas e colheres, sem lista proibida e sem balança.",
        programa: "Programa 90 Dias",
        quando: dados.quando,
      }),
      ...interiores.map((conteudo, i) =>
        folha({
          corrido,
          numero: i + 1,
          total,
          site: marca.site,
          conteudo,
        }),
      ),
    ],
  });
}
