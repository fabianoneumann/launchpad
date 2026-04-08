# Design System Web — Especificacao de Alta Fidelidade

Documento de especificacao executavel para agentes de IA implementarem interfaces web de experiencia premium em plataformas de venda de passeios turisticos.

**Regra de uso:** Toda decisao de implementacao que nao estiver explicitamente definida aqui e uma lacuna que DEVE ser reportada, nao inferida.

---

## 1) Contrato de Fidelidade

Este documento define o nivel minimo de execucao aceitavel:

- Toda tela entregue deve ser **indistinguivel de um produto comercial de alto padrao**.
- Componentes sem estado completo (hover, active, focus, disabled, loading, error) sao rejeitados.
- Animacoes sem curva de easing definida sao rejeitadas.
- Qualquer elemento visual que nao use token oficial deste documento e invalido.
- O agente nao pode assumir valores nao especificados. Deve sinalizar como `TODO` e pausar.

### 1.1 Campos que NUNCA podem ser inferidos

Os campos abaixo exigem decisao humana explicita. O agente **nao pode** preenchê-los a partir de codigo de referência, paletas extraídas, padroes visuais ou qualquer outra fonte externa. Se estiverem em branco, o agente sinaliza `AGUARDA-HUMANO:[campo]` e nao implementa nada que dependa deles.

| Campo | Por que nao pode ser inferido |
|---|---|
| Sensacao primaria (secao 3.1) | Define a proposta emocional da marca — decisao de produto, nao de codigo |
| Sensacao secundaria (secao 3.1) | Idem |
| O que NUNCA deve ser sentido (secao 3.1) | Idem |
| Ritmo por contexto de pagina (secao 3.2) | Depende da intencao editorial da marca, nao do CSS de terceiros |
| Intensidade visual por pagina (secao 3.3) | Decisao de negocio: quanto encantar vs. quanto converter |
| Adjetivos de identidade + consequencia tecnica (secao 4.1) | Vocabulario de marca — nao pode ser copiado de outra empresa |
| Assinatura visual — nome, descricao, onde aparece (secao 4.2) | O elemento unico da marca: nao existe em referencias externas |
| Paleta de cores (secao 6.1) — todos os valores hex | Cores de marca sao decisao estrategica, nao extracao de CSS |
| Tipografia — display font e body font (secao 6.2) | Escolha tipografica de marca: fontes de referencias pertencem a outras empresas |
| Gradientes oficiais (secao 6.1) | Derivados da paleta, que depende de decisao humana |

**Regra:** o agente pode usar os campos acima como referencia para validar consistencia interna, mas nao pode criá-los nem completá-los. Campos em branco = bloqueio de implementacao dos elementos que deles dependem.

---

## 2) Contexto do Produto

- **Produto:** Plataforma web de venda de passeios turisticos.
- **Publico principal:** Turistas adultos em fase de descoberta, comparacao e decisao de compra.
- **Dispositivos prioritarios:** Mobile-first. Desktop e o ambiente de conversao final.
- **Jornada principal:** Descoberta → Exploracao → Detalhe → Reserva → Confirmacao.
- **Tensao central de UX:** Alto encantamento visual sem sacrificar velocidade de decisao.

---

## 3) Filosofia da Experiencia

Define a sensacao que a interface deve provocar, o ritmo de interacao e o nivel de intensidade visual.

### 3.1 Sensacao alvo

> **AGUARDA-HUMANO.** Esta secao nao pode ser preenchida por agente. Nenhuma leitura de codigo CSS, HTML ou JS de referencia externa autoriza o agente a inferir a proposta emocional da marca. Deixar em branco bloqueia a implementacao das secoes que dependem de identidade (4.1, 4.2, hero, paleta).

Preencher as tres dimensoes abaixo. Cada uma tem consequencia tecnica direta.

| Dimensao | Descricao | Consequencia tecnica obrigatoria |
|---|---|---|
| **Sensacao primaria** | O que o usuario sente nos primeiros 3 segundos | [ex: "expansao e possibilidade" → hero full-bleed, tipografia display grande, espaco generoso] |
| **Sensacao secundaria** | O que o usuario sente ao interagir e navegar | [ex: "controle e clareza" → feedback imediato em toda acao, hierarquia textual rigorosa] |
| **O que NUNCA deve ser sentido** | Sensacoes que quebram a proposta | [ex: "pressa, inseguranca, confusao" → proibido: multiplos CTAs competindo, alertas de escassez agressivos, layout denso sem respiro] |

Regra: se uma decisao de design nao reforcar a sensacao primaria nem a secundaria, ela e rejeitada.

### 3.2 Ritmo da interface

Definir qual dos tres ritmos abaixo se aplica:

| Ritmo | Caracteristica | Exemplos de uso |
|---|---|---|
| **Contemplativo** | Transicoes lentas, pausas intencionais, foco em atmosfera | Hero, detalhe de passeio |
| **Fluido** | Transicoes suaves e continuas, sem quebras perceptiveis | Navegacao entre paginas |
| **Responsivo** | Feedback imediato (<150ms), direto ao ponto | Formularios, filtros, checkout |

Regra: cada contexto de pagina define seu ritmo. O ritmo nao pode ser uniforme em toda a aplicacao.

### 3.3 Intensidade visual

Escala de 1 a 5:

- **1 — Minimalista:** sem efeitos de profundidade, sem gradiente, tipografia e espaco em foco.
- **2 — Contido:** sombras sutis, gradiente de no maximo 2 cores, animacoes de entrada apenas.
- **3 — Equilibrado:** uso de profundidade (blur, sobreposicao), gradientes compostos, parallax leve.
- **4 — Expressivo:** backgrounds atmostericos, motion em scroll, micro-interacoes ricas.
- **5 — Imersivo:** camadas visuais multiplas, video ou animacao generativa, full-bleed hero.

Definir intensidade por contexto:

- [ ] Home: [1-5]
- [ ] Listagem: [1-5]
- [ ] Detalhe do passeio: [1-5]
- [ ] Checkout: [1-5] (recomendado: maximo 2 — nao distrair)

---

## 4) Direcao Estetica (Art Direction)

### 4.1 Identidade visual

> **AGUARDA-HUMANO.** O vocabulario de marca nao pode ser copiado de nenhuma referencia. O agente nao pode inferir adjetivos de identidade a partir de cores, fontes ou efeitos de terceiros. Cada adjetivo define a proposta de posicionamento da empresa — decisao de produto.

Preencher com no maximo 5 adjetivos que descrevem o carater visual da interface. Cada adjetivo deve ter uma consequencia tecnica associada:

| Adjetivo | Consequencia tecnica |
|---|---|
| [preencher] | [ex: uso de blur em backgrounds de modal] |
| [preencher] | [ex: tipografia display com alto tracking em titulos] |
| [preencher] | [ex: paleta com dominancia de escuros e acento natural] |

### 4.2 Assinatura visual obrigatoria

> **AGUARDA-HUMANO.** A assinatura e o elemento que torna a marca reconhecivel — nao existe em nenhum site externo. O agente nao pode criar, sugerir nem assumir uma assinatura visual. Se este bloco estiver vazio, o agente registra `AGUARDA-HUMANO:assinatura-visual` e implementa as telas sem o elemento distintivo ate que seja definido.

Definir o elemento visual unico que aparece em pelo menos 3 telas e torna a interface reconhecivel:

- [ ] Nome do elemento: [ex: "Camada atmosferica"]
- [ ] Descricao tecnica: [ex: overlay com gradiente radial de opacidade 0.4 + noise texture de 3% sobre imagens de fundo]
- [ ] Onde aparece: [listar telas]
- [ ] Implementacao de referencia: [arquivo CSS/componente]

### 4.3 Restricoes esteticas absolutas (proibido em qualquer tela)

- Gradientes genericos purple-to-pink sem relacao com a paleta oficial.
- Fonte Inter, Roboto, Arial ou qualquer fonte system-ui como display font.
- Cards com border-radius > 24px em contexto de produto premium.
- Sombra box-shadow unica em todos os niveis de elevacao.
- Animacoes com `linear` easing em elementos visiveis ao usuario.
- Icones misturados de bibliotecas diferentes (ex: Heroicons + Lucide juntos).

---

## 5) Mapeamento de Referencias Externas

### 5.1 Tipos de extracao validos

Cada referencia deve ser classificada em exatamente um dos tipos abaixo:

| Tipo | O que extrair | O que descartar obrigatoriamente |
|---|---|---|
| **Layout** | Estrutura de secoes, hierarquia de blocos, proporcoes | Cores, fontes, branding |
| **Tipografia** | Escala, pesos, espacamento, ritmo textual | Nome da fonte (substituir pela oficial) |
| **Motion** | Duracao, easing, tipo de transicao, stagger | Logica de trigger se incompativel |
| **Atmosfera** | Tratamento de imagem, sobreposicoes, textura, profundidade | Identidade visual da marca original |
| **Componente** | Anatomia, estados, comportamento | Estilo visual (aplicar tokens proprios) |
| **Conteudo** | Ordem informacional, CTAs, hierarquia de dados | Tom de voz e copy |

### 5.2 Tabela de referencias

| ID | Arquivo/URL | Tipo | Extrair | Descartar | Pagina alvo | Nivel de influencia |
|---|---|---|---|---|---|---|
| REF-01 | [preencher] | [tipo] | [detalhar] | [detalhar] | [pagina] | Alto / Medio / Baixo |
| REF-02 | [preencher] | [tipo] | [detalhar] | [detalhar] | [pagina] | Alto / Medio / Baixo |
| REF-03 | [preencher] | [tipo] | [detalhar] | [detalhar] | [pagina] | Alto / Medio / Baixo |

### 5.3 Instrucao para o agente ao processar referencias

1. Ler o arquivo da referencia.
2. Identificar o tipo conforme 5.1.
3. Extrair apenas os elementos da coluna "Extrair" da tabela 5.2.
4. Nunca transferir valores literais (hex, px, font-family) — apenas principios e proporcoes.
5. Registrar no `web-v1.md` qual decisao foi inspirada por qual referencia (rastreabilidade).

### 5.4 Proibicoes no uso de referencias

**Regra:** cada referencia tem exatamente um tipo de extracao. Mistura de tipos na mesma referencia e invalida.

**Proibido:**
- Transferir valores literais de CSS (hex, px, ms, rem, font-family) de qualquer referencia para o documento.
- Atribuir mais de um tipo de extracao a uma mesma referencia (ex: REF-01 nao pode ser simultaneamente Layout e Motion).
- Usar uma referencia de tipo Atmosfera para derivar anatomia de componentes.
- Usar uma referencia de tipo Conteudo para derivar tokens visuais ou motion.
- Aplicar nivel de influencia Alto em mais de 2 referencias para a mesma pagina (cria conflito de direcao).
- Copiar layout literal de qualquer referencia — apenas proporcoes e principios estruturais.
- Usar referencia de branding externo (logo, cores de marca, tipografia proprietaria) mesmo que o tipo seja Atmosfera.
- Implementar qualquer padrao extraido de referencia sem converter para os tokens da secao 6.

**Condicao de rejeicao:** se o agente nao conseguir mapear a extracao para um token ou regra existente deste documento, a referencia nao pode ser aplicada. Registrar como `TODO:referencia-sem-mapeamento:[REF-id]`.

---

## 6) Design Tokens

Todos os valores abaixo sao os unicos valores validos para implementacao. O agente nao pode usar valores fora desta lista.

> **Tokens marcados com `[AGUARDA-HUMANO]` nao podem ser derivados de referencias externas.** O agente pode preencher apenas tokens marcados com `[PODE-EXTRAIR]`, e somente apos converter o valor para o formato do token (nunca colar literal do CSS de referencia).

### 6.1 Paleta de Cores

> **AGUARDA-HUMANO.** Nenhum valor de cor pode ser extraido de site de referencia. Cores de marca sao decisao estrategica. O agente pode apenas organizar os valores fornecidos pelo humano no formato abaixo. Se qualquer hex estiver em branco, o agente nao implementa nenhum componente colorido e registra `AGUARDA-HUMANO:paleta`.

```
-- Definir todos os valores antes de iniciar qualquer implementacao --

Primary:
  50:  [hex]
  100: [hex]
  500: [hex]  ← uso principal
  600: [hex]  ← hover
  700: [hex]  ← active/pressed
  900: [hex]  ← texto sobre fundo claro

Secondary:
  500: [hex]
  600: [hex]

Accent:
  500: [hex]  ← uso em CTA principal, highlights, badges de destaque

Neutral:
  0:   [hex]  ← branco base
  50:  [hex]
  100: [hex]
  200: [hex]
  300: [hex]
  400: [hex]  ← placeholder, borders desabilitados
  500: [hex]  ← texto secundario
  700: [hex]  ← texto body
  900: [hex]  ← texto heading
  950: [hex]  ← fundo escuro base

Semanticos:
  success: [hex]
  warning: [hex]
  error:   [hex]
  info:    [hex]

Gradientes oficiais (os unicos permitidos):
  gradient-hero:   [definir stops, angulo e opacidade]
  gradient-card:   [definir stops, angulo e opacidade]
  gradient-overlay:[definir stops, angulo e opacidade]
```

### 6.2 Tipografia

> **Display font e Body font: AGUARDA-HUMANO.** Fontes de marca nao podem ser copiadas de referencias externas — pertencem a outras empresas. Mono font pode ser inferida como `JetBrains Mono` ou `IBM Plex Mono` se nao especificada, desde que seja open-source e sem conflito de licenca. Pesos e escalas de tamanho: **PODE-EXTRAIR** — podem ser derivados de padroes tipograficos da referencia, convertendo para a escala rem abaixo.

```
Display font:  [nome] — uso exclusivo em titulos de hero e section headers de alto impacto
Body font:     [nome] — uso em paragrafos, labels, inputs, navegacao
Mono font:     [nome] — uso em precos, codigos de reserva, dados numericos

Escala de tamanho (rem):
  2xs: 0.625   (10px)
  xs:  0.75    (12px)
  sm:  0.875   (14px)
  md:  1       (16px)  ← base
  lg:  1.125   (18px)
  xl:  1.25    (20px)
  2xl: 1.5     (24px)
  3xl: 1.875   (30px)
  4xl: 2.25    (36px)
  5xl: 3       (48px)
  6xl: 3.75    (60px)
  7xl: 4.5     (72px)

Peso por contexto:
  heading-display: [peso]  ← hero, H1
  heading-section: [peso]  ← H2, section titles
  heading-card:    [peso]  ← H3, card titles
  body-strong:     [peso]  ← destaque inline
  body-regular:    [peso]  ← paragrafos
  label:           [peso]  ← form labels, navigation
  caption:         [peso]  ← metadata, datas, categorias

Line-height por contexto:
  display:  1.1
  heading:  1.2
  body:     1.6
  caption:  1.4

Letter-spacing por contexto:
  display:        [valor]  ← geralmente -0.02em a -0.04em
  heading:        [valor]
  body:           0
  label-uppercase:[valor]  ← minimo 0.05em quando em uppercase
  mono:           0

Largura maxima de linha (ch):
  leitura longa:  65–75ch
  leitura media:  50–60ch
  label/caption:  sem restricao
```

### 6.3 Espacamento

```
Escala base: 4px (0.25rem)

  1:  4px
  2:  8px
  3:  12px
  4:  16px
  5:  20px
  6:  24px
  8:  32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
  32: 128px

Grid:
  max-width-content:  [valor]
  max-width-text:     [valor]
  max-width-narrow:   [valor]
  gutter-desktop:     [valor]
  gutter-tablet:      [valor]
  gutter-mobile:      [valor]
  columns-desktop:    12
  columns-tablet:     8
  columns-mobile:     4

Border radius:
  none:   0
  sm:     4px
  md:     8px
  lg:     12px
  xl:     16px
  2xl:    24px
  full:   9999px  ← uso exclusivo em badges e pills

Elevacao (box-shadow):
  0 — sem sombra (elementos planos, fundos)
  1 — sombra de 4px (cards em repouso)
  2 — sombra de 8px (dropdowns, popovers)
  3 — sombra de 16px (modais, drawers)
  4 — sombra de 32px (elementos flutuantes, toasts)

  Definir valor completo de cada nivel: [rgba + blur + spread + offset]
```

### 6.4 Motion Tokens

```
Duracao:
  instant:      0ms      ← sem animacao (prefers-reduced-motion)
  micro:        80ms     ← ripple, flash de feedback
  fast:         150ms    ← hover, focus ring, small state changes
  base:         250ms    ← a maioria das transicoes de UI
  slow:         400ms    ← entrada de modais, drawers, page transitions
  atmospheric:  600ms    ← hero reveals, scroll-triggered reveals
  cinematic:    1000ms+  ← transicoes de pagina com continuidade visual

Easing:
  linear:       linear                          ← proibido em transicoes visiveis
  standard:     cubic-bezier(0.4, 0, 0.2, 1)   ← transicoes de estado geral
  decelerate:   cubic-bezier(0, 0, 0.2, 1)     ← elementos que entram na tela
  accelerate:   cubic-bezier(0.4, 0, 1, 1)     ← elementos que saem da tela
  spring:       cubic-bezier(0.34, 1.56, 0.64, 1) ← interacoes com feedback fisico
  smooth:       cubic-bezier(0.25, 0.46, 0.45, 0.94) ← scrolls, carrosseis

Stagger delay entre itens em lista:
  base:   40ms
  slow:   80ms
  maximo: 20 itens (apos isso sem delay — performance)
```

---

## 7) Sistema de Animacao

### 7.1 Mapa de animacoes por trigger

| Trigger | Duracao | Easing | Propriedades animadas |
|---|---|---|---|
| Hover em card | fast (150ms) | standard | transform: translateY(-4px), box-shadow nivel 1→2 |
| Hover em botao primario | fast (150ms) | standard | background-color, transform: scale(1.02) |
| Focus em input | fast (150ms) | standard | border-color, box-shadow (focus ring) |
| Pressed/Active | micro (80ms) | accelerate | transform: scale(0.97) |
| Entrada de modal | slow (400ms) | decelerate | opacity 0→1, translateY(16px)→0 |
| Saida de modal | base (250ms) | accelerate | opacity 1→0, translateY(0)→8px |
| Scroll reveal (primeiro viewport) | atmospheric (600ms) | decelerate | opacity 0→1, translateY(24px)→0 |
| Scroll reveal (profundo) | slow (400ms) | decelerate | opacity 0→1, translateY(16px)→0 |
| Page transition saida | base (250ms) | accelerate | opacity 1→0 |
| Page transition entrada | slow (400ms) | decelerate | opacity 0→1 |
| Toast entrada | base (250ms) | spring | translateX(100%)→0 ou translateY(-100%)→0 |
| Toast saida | fast (150ms) | accelerate | opacity 1→0, translateX(0)→100% |
| Skeleton shimmer | 1500ms loop | linear | background-position |
| Loading spinner | 800ms loop | linear | transform: rotate(360deg) |

### 7.2 Regras de Quando Usar Cada Tipo de Animacao

O agente NAO decide quando animar. Esta tabela e a unica fonte de verdade.

| Contexto | Tipo de animacao permitido | Tipo proibido | Justificativa |
|---|---|---|---|
| Hover em elemento interativo | Transformacao sutil (scale, translateY, cor de fundo) — rapida e contida | Animacoes de opacidade completa, blur | Resposta deve parecer imediata, nao dramática |
| Entrada de pagina / rota | Fade-in + translateY leve da pagina inteira | Scale, rotation, efeitos de zoom | Transicao suave, sem quebra de contexto espacial |
| Feedback de acao confirmada (click, submit) | Compressao (scale 0.97) + ripple no ponto de click | Animacao longa (>400ms) bloqueando proxima acao | Resposta fisica imediata, sem atrasar o fluxo |
| Erro de validacao | Shake lateral (translateX) + cor de borda | Animacao de fade suave — parece aviso, nao erro | Erro deve ser inconfundivel e urgente |
| Entrada de elemento no scroll | Fade + translateY (de baixo para cima) | translateX lateral, scale, rotation | Direcao vertical reforca leitura natural da pagina |
| Saida de modal / drawer | Fade-out + translateY para baixo | Animacao igual a entrada — direcao invertida | Saida deve ter direcao oposta a entrada |
| Loading / estado de espera | Skeleton shimmer ou spinner continuo | Animacao de conteudo parcial aparecendo | Usuario precisa de feedback estavel, nao fragmentado |
| Listagem de cards carregando | Stagger fade-in sequencial | Stagger com scale ou movimento lateral | Foco na legibilidade, nao em espetaculo visual |
| Fluxo de checkout (steps) | Apenas transicao horizontal de step (translateX) | Scroll reveal, parallax, qualquer animacao decorativa | Contexto critico — zero distracao |
| Notificacao / toast | Entrada por slide lateral ou superior | Fade simples sem movimento | Deve chamar atencao periferal sem interromper |
| Toggle / checkbox / switch | Animacao de estado interno (stroke, fill, translate do thumb) | Animacao do container pai | Movimento confinado ao proprio elemento |
| Galeria / carousel | Cross-fade ou slide direcional | Zoom, flip, efeitos 3D | Clareza de navegacao espacial |

Regra: qualquer animacao que nao esteja nesta tabela e proibida. Sinalizar como `TODO:animacao-nao-mapeada`.

### 7.3 Restricoes absolutas de animacao

- Nunca animar `width`, `height` ou `top/left` diretamente. Usar `transform` e `opacity`.
- Nunca usar `transition: all`. Sempre listar propriedades especificas.
- Nunca usar easing `linear` em transicoes de estado visiveis ao usuario.
- Maximo de 3 elementos com animacao simultanea na mesma area de viewport.
- Scroll parallax: deslocamento maximo de 30% da altura do elemento. Acima disso, rejeitar.
- Animacoes de loop continuo (spinner, shimmer) devem usar `will-change: transform` e rodar em compositor thread.

### 7.4 Reduced motion

Todo elemento animado deve ter fallback em `@media (prefers-reduced-motion: reduce)`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Substituir por transicao de opacidade com fast duration */
  /* Nunca remover feedback de estado — apenas reduzir movimento */
  transition-duration: 150ms;
  animation-duration: 150ms;
  transform: none !important; /* exceto scale em hover — manter */
}
```

### 7.5 Proibicoes Globais de Animacao

**Regra:** qualquer comportamento listado abaixo e causa automatica de rejeicao da entrega, sem excecao.

**Proibido em qualquer contexto:**
- `transition: all` — anima propriedades nao intencionais e degrada performance.
- Easing `linear` em transicoes visiveis ao usuario (exceto shimmer e spinner).
- Animar `width`, `height`, `top` ou `left` diretamente — usar sempre `transform` e `opacity`.
- Bounce exagerado: overshoot > 20% do valor final em qualquer easing spring.
- Mais de 3 elementos animados simultaneamente no mesmo viewport.
- Animacao que bloqueia proxima acao do usuario (duracao > 400ms na thread principal).
- Loop infinito sem `will-change: transform` declarado.
- Parallax com deslocamento > 30% da altura do container.
- `background-attachment: fixed` como implementacao de parallax.
- Scroll reveal com `translateX` lateral — apenas `translateY` de baixo para cima.
- Scroll reveal com `scale` ou `rotation`.
- Microinteracao em elemento com estado `disabled` — o elemento nao reage a nenhum evento.
- `shake` de erro com amplitude > 6px ou com mais de 4 ciclos.
- `scale` > 1.05 em hover (exceto favoritar/curtir, que permite 1.3 apenas no icone).
- Qualquer animacao decorativa em: checkout, pagamento, cadastro, recuperacao de senha.
- Animacao de entrada de pagina com `scale`, `rotation` ou `zoom`.
- Stagger com mais de 20 itens com delay individual.
- `animation-delay` > 600ms em qualquer elemento (usuario nao deve esperar).

---

## 8) Estados de Interacao

Todo componente interativo DEVE implementar todos os estados abaixo. Estados ausentes sao motivo de rejeicao.

### 8.1 Mapa de estados por componente

| Estado | Mudancas visuais obrigatorias | Mudancas de movimento | Intensidade | Proibido |
|---|---|---|---|---|
| **Default** | Tokens base sem modificacao | Nenhum movimento | 0 | Sombras, bordas ou cores fora dos tokens |
| **Hover** | background-color escurece 10%, ou borda aparece, ou elevacao sobe 1 nivel | transform: translateY(-4px) em cards; scale(1.02) em botoes; duracao fast, easing standard | Baixa — sutil, nao dramatica | cursor: default; nenhuma mudanca visual; scale > 1.03 |
| **Focus** | Focus ring: 2px solid accent-500, offset 2px | Sem movimento de transform — apenas aparecimento do ring | Baixa — funcional, nao decorativa | outline: none sem substituto; focus ring animado com duracao > 150ms |
| **Active / Pressed** | Background escurece 15%; sem elevacao (volta ao nivel 0 se estava em hover) | transform: scale(0.97); duracao micro (80ms), easing accelerate | Imediata — resposta fisica direta | scale > 1 no estado pressed; duracao > 150ms |
| **Disabled** | opacity: 0.4; background neutral-50 em campos; sem elevacao | Nenhum movimento em hover ou focus | Zero — o elemento nao reage | Remover do DOM; ocultar com visibility:hidden; manter eventos de mouse ativos |
| **Loading** | Substituir conteudo por spinner (botao) ou skeleton (area maior); manter dimensoes do elemento | Spinner: rotacao continua 800ms linear; skeleton: shimmer 1500ms linear | Continua e previsivel — usuario precisa saber que algo acontece | Alterar o texto do botao para "Carregando..." sem spinner; remover a area do elemento; flash de conteudo |
| **Error** | Borda error (2px); icone de alerta (16px) a direita do campo; mensagem de erro abaixo em texto error, font-size sm | Shake horizontal: translateX(0→-4px→4px→-4px→0), 3 ciclos, 400ms total, easing spring | Alta — deve ser inconfundivel | Apenas mudanca de cor sem texto; mensagem de erro sem associacao aria-describedby |
| **Success** | Borda success (2px); icone de check (16px) a direita; mensagem de confirmacao abaixo em texto success | Icone de check animado: stroke-dashoffset 100%→0%, 250ms, easing decelerate | Media — confirmacao positiva, nao celebracao excessiva | Apenas cor sem texto; animacoes de celebracao (confetti, pulse excessivo) |
| **Selected / Active (nav)** | Background accent-500 com opacity 15%; texto accent-500; indicador lateral de 3px solid accent-500 na borda esquerda | Sem movimento — estado persistente nao usa transform | Baixa e persistente | Apenas mudanca de cor sem indicador adicional; bold sem mudanca de cor |

### 8.2 Focus ring — padrao universal

```css
:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: 2px;
  border-radius: /* mesmo valor do componente */;
}
:focus:not(:focus-visible) {
  outline: none;
}
```

### 8.3 Proibicoes Globais de Estados

**Regra:** os comportamentos abaixo sao invalidos em qualquer estado de qualquer componente.

**Proibido:**
- `visibility: hidden` em estado `disabled` — usar `opacity: 0.4` + `pointer-events: none`.
- `display: none` em estado `loading` — manter area e dimensoes do elemento.
- Alterar `width`, `height` ou `min-height` do componente entre estados.
- Transicao de hover com duracao > 150ms.
- Transicao de qualquer estado de feedback com duracao > 400ms.
- Dois estados com o mesmo estilo visual (ex: `default` e `disabled` com o mesmo `opacity`).
- Omitir `cursor: not-allowed` em estado `disabled`.
- Omitir `aria-disabled="true"` em elemento interativo com estado `disabled`.
- Omitir `aria-busy="true"` em elemento com estado `loading`.
- Estado `success` sem mensagem textual associada — apenas cor e icone nao constituem feedback.
- Estado `error` sem mensagem textual associada via `aria-describedby`.
- Estado `loading` que altera o texto do botao para "Carregando..." sem spinner visual.
- Estado `hover` sem nenhuma mudanca visual — qualquer interativo deve reagir ao hover.
- Estado `focus` sem focus ring visivel — `outline: none` sem substituto e causa de rejeicao.
- Scale > 1.03 em qualquer estado de hover (exceto icone de favoritar).

---

## 9) Microinteracoes

### 9.0 Principios de execucao (nao negociaveis)

1. **Movimento antes de cor:** botoes e elementos interativos respondem com movimento (scale, translate) alem da mudanca de cor. Cor sozinha nao constitui feedback suficiente.
2. **Feedback progressivo, nao abrupto:** transicoes de estado nunca saltam diretamente do valor inicial ao valor final. Toda mudanca usa duracao e easing definidos na secao 6.4.
3. **Confinamento ao elemento:** a microinteracao acontece dentro do proprio elemento ou em sua area imediata. Nunca propaga efeito para elementos vizinhos.
4. **Sem bloqueio de acao:** nenhuma microinteracao pode atrasar ou impedir a proxima acao do usuario. Animacoes de entrada de feedback nao devem exceder 400ms.
5. **Reversivel sem glitch:** ao sair do estado (ex: mouse leave em hover), a reversao usa a mesma duracao e easing da entrada — nunca e instantanea.

Microinteracoes obrigatorias por elemento:

| Elemento | Trigger | Propriedades CSS animadas | Valor inicial | Valor final | Duracao | Easing | Proibido |
|---|---|---|---|---|---|---|---|
| Botao primario (CTA) | `mousedown` / `click` confirmado | `transform: scale` | `1` | `0.97` + ripple radial de `0%` a `100%` de raio | `80ms` (press) + `400ms` (ripple) | `accelerate` (press), `decelerate` (ripple) | Animar apenas cor; escala > 1 no press |
| Botao (hover) | `mouseenter` | `background-color`, `transform: scale` | token base | escurece 10%, `scale(1.02)` | `150ms` | `standard` | `scale > 1.03`; sem mudanca visual |
| Botao (mouse leave) | `mouseleave` | `background-color`, `transform: scale` | estado hover | estado default | `150ms` | `standard` | Transicao instantanea (duracao 0) |
| Input / Textarea | `focus` | `border-color`, `box-shadow` (focus ring) | `neutral-300` | `accent-500`, ring 2px offset 2px | `150ms` | `standard` | `outline: none` sem substituto |
| Input (floating label) | `focus` ou `value != empty` | `transform: translateY`, `font-size`, `color` | `translateY(0)`, `md`, `neutral-500` | `translateY(-20px)`, `sm`, `accent-500` | `250ms` | `standard` | Placeholder como substituto de label |
| Input (erro) | `blur` com validacao falha | `border-color`, `transform: translateX` | `neutral-300`, `translateX(0)` | `error`, shake: `0→-4px→4px→-4px→0` (3 ciclos) | `150ms` (borda) + `400ms` (shake) | `standard` (borda), `spring` (shake) | Amplitude > 6px; mais de 4 ciclos; fade suave |
| Card de passeio (hover desktop) | `mouseenter` | `transform: translateY`, `box-shadow`, imagem `transform: scale` | `translateY(0)`, `elevacao-1`, `scale(1)` | `translateY(-4px)`, `elevacao-2`, `scale(1.05)` | `400ms` | `standard` | Scale fora do container (usar `overflow: hidden`); hover em mobile |
| Favoritar / curtir | `click` | `transform: scale` do icone, `fill` | `scale(1)`, preenchimento vazio | `scale(1.3)` → `scale(1)`, preenchimento accent | `300ms` | `spring` | Animar o container pai; scale > 1.3 |
| Contador de quantidade | `click` em + ou - | `transform: translateY` do numero | `translateY(0)` | incremento: `translateY(-100%)` saindo + `translateY(100%)` entrando; decremento: inverso | `150ms` | `decelerate` (entrada), `accelerate` (saida) | Troca abrupta de numero sem transicao |
| Checkbox / toggle ativando | `click` | `stroke-dashoffset` do checkmark SVG | `100%` (invisivel) | `0%` (visivel) | `250ms` | `decelerate` | Aparecer sem animacao de desenho |
| Toggle (thumb) | `click` | `transform: translateX` do thumb, `background-color` do track | posicao off, cor neutral-300 | posicao on, cor accent-500 | `250ms` | `standard` | Pular de posicao sem transicao |
| Toast entrada | montagem no DOM | `transform: translateX` (lateral) ou `translateY` (superior) | `translateX(100%)` ou `translateY(-100%)` | `translateX(0)` ou `translateY(0)` | `250ms` | `spring` | Fade simples sem movimento |
| Icone de check no toast | `250ms` apos entrada do toast | `stroke-dashoffset` | `100%` | `0%` | `150ms` | `spring` | Aparecer simultaneamente com o toast |
| Galeria — troca de slide | `click` em thumbnail ou swipe | `opacity` da imagem saindo e entrando | saindo: `1→0`; entrando: `0→1` | — | `250ms` | `standard` | Zoom, flip, efeito 3D |
| Filtro ativado | `click` | `transform: scale` do badge de contagem | `scale(0)` | `scale(1)` | `150ms` | `spring` | Badge aparece sem animacao |

### 9.1 Proibicoes Globais de Microinteracoes

**Regra:** microinteracao ausente em elemento mapeado acima e causa de rejeicao.

**Proibido:**
- Microinteracao que propaga efeito para elementos fora do proprio componente.
- Animacao de microinteracao com duracao > 400ms.
- Microinteracao em elemento com estado `disabled`.
- Ripple em botao `secondary` ou `ghost` (apenas `primary`).
- Floating label sem retornar a posicao original quando o campo perde foco e esta vazio.
- Shake de erro com `translateX` > 6px de amplitude ou > 4 ciclos.
- Qualquer microinteracao decorativa em fluxos criticos (ver secao 25).
- Usar `transform: rotate` como microinteracao em botoes ou inputs.
- Animacao de microinteracao que nao usa os tokens de motion da secao 6.4.
- `scale(0)` em elemento visivel como estado inicial de microinteracao de entrada (usar `opacity: 0` + `scale(0.8)` no maximo).

---

## 10) Sistema de Atencao e Hierarquia Visual

### 10.1 Fluxo de atencao por pagina

Cada pagina deve ter exatamente um elemento de nivel Z1 (atencao maxima) por viewport. O agente deve identificar e respeitar esta hierarquia antes de implementar qualquer tela.

| Nivel | Descricao | Maximo por viewport | Propriedades visuais que conferem este nivel |
|---|---|---|---|
| Z1 | CTA principal, headline do hero | 1 | Maior tamanho tipografico da pagina, ou cor accent de fundo, ou posicao central acima do fold |
| Z2 | Subheadline, card em destaque, preco principal | 2–3 | Tamanho tipografico secundario, ou elevacao-2, ou contraste alto sem accent |
| Z3 | Conteudo de suporte, grid de cards, descricoes | sem limite | Tamanho body, elevacao-1 ou 0, cor neutral-700 |
| Z4 | Metadata, labels, rodape de secao, datas | sem limite | Tamanho sm ou xs, cor neutral-500, peso regular |

### 10.1-A Protocolo de resolucao de conflito de atencao

Quando dois elementos do mesmo nivel disputam atencao na mesma area de viewport, aplicar nesta ordem:

1. Verificar se ambos sao realmente necessarios no mesmo viewport. Se nao, mover um para fora do fold.
2. Se ambos sao necessarios: rebaixar o elemento de menor prioridade de negocio para o nivel imediatamente inferior (ex: Z1 → Z2).
3. Nunca elevar o elemento de menor prioridade — apenas rebaixar o concorrente.
4. Documentar o conflito e a resolucao no formato de entrega da secao 21.3.

Sinais de conflito que o agente DEVE detectar e resolver:
- Dois botoes com variante `primary` na mesma secao → rebaixar o secundario para `secondary`.
- Dois elementos com cor accent de fundo no mesmo viewport → remover accent do elemento de menor prioridade.
- Dois titulos com font-size >= 3xl no mesmo viewport → rebaixar o segundo para 2xl.
- Mais de 3 badges/tags em um unico card → exibir apenas os 2 mais relevantes, ocultar os demais.

### 10.2 Regras de contraste

- Texto sobre fundo solido: minimo WCAG AA (4.5:1 para texto normal, 3:1 para texto grande).
- Texto sobre imagem ou gradiente: overlay obrigatorio. Contraste do texto sobre o overlay: minimo 7:1.
- Texto de CTA primario: sempre verificar contraste contra o estado hover tambem.
- Nunca colocar texto de corpo (md ou menor) diretamente sobre imagem sem overlay.

### 10.3 Dominancia de elementos

- Em qualquer secao, no maximo 1 elemento pode ter cor accent de fundo.
- Botoes secundarios nao podem competir visualmente com o CTA primario da mesma area.
- Badges e tags de destaque: maximo 2 por card.

### 10.4 Regras de nao-competicao entre elementos

O agente DEVE verificar cada par de elementos abaixo antes de entregar qualquer tela:

| Par de elementos | Regra de nao-competicao |
|---|---|
| CTA primario + CTA secundario | Diferenca visual obrigatoria: variante diferente (primary vs secondary ou ghost), nunca o mesmo tamanho e a mesma cor |
| Headline + subheadline | Diferenca minima de 2 steps na escala tipografica (ex: 4xl e 2xl, nao 4xl e 3xl) |
| Card em destaque + cards comuns | Card em destaque usa elevacao-2; cards comuns elevacao-1. Nunca o mesmo nivel |
| Badge de preco + badge de categoria | Cores diferentes: preco usa accent ou neutral-900; categoria usa neutral-100 com texto neutral-700 |
| Imagem de hero + texto sobre ela | Texto sempre sobre overlay — nunca diretamente sobre imagem |
| Navbar + conteudo da pagina | Navbar sempre com background diferente do fundo da primeira secao quando em scroll |
| Filtros ativos + filtros inativos | Filtro ativo tem fundo accent-500 com texto neutral-0; inativo tem fundo neutral-100 com texto neutral-700 |

### 10.5 Proibicoes do Sistema de Atencao

**Regra:** os comportamentos abaixo violam o sistema de hierarquia e causam rejeicao automatica.

**Proibido em qualquer tela:**
- Dois elementos com variante `primary` no mesmo viewport.
- Dois elementos com cor `accent` de fundo no mesmo viewport.
- Dois titulos com `font-size >= 3xl` no mesmo viewport sem diferenca de contraste de pelo menos 40% entre eles.
- CTA primario e CTA secundario com a mesma altura, largura e peso tipografico na mesma area.
- Mais de 1 elemento de nivel Z1 por viewport.
- Mais de 3 elementos de nivel Z2 por viewport.
- Mais de 2 badges de destaque no mesmo card.
- Elemento Z4 com `font-size >= md` (Z4 usa apenas `sm` ou `xs`).
- Elemento Z3 com cor `accent` (accent e exclusivo de Z1 e Z2).
- Badge de urgencia/escassez em vermelho (`error`) — usar apenas `warning`.
- Texto de urgencia/escassez sem dado real associado.
- Elemento Z2 com a mesma `box-shadow` de elemento Z1.
- Botao `ghost` competindo visualmente com botao `primary` (ex: mesma cor de texto, mesmo tamanho).

---

## 11) Profundidade e Camadas (Z-axis)

### 11.1 Escala de elevacao

| Nivel | Uso | Box-shadow token |
|---|---|---|
| 0 | Fundo de pagina, secoes planas | nenhuma |
| 1 | Cards em repouso, inputs | elevacao-1 |
| 2 | Cards em hover, dropdowns abertos | elevacao-2 |
| 3 | Modais, drawers, sidebars flutuantes | elevacao-3 |
| 4 | Toasts, tooltips, elementos sempre-no-topo | elevacao-4 |

### 11.2 Blur e backdrop-filter

- `backdrop-filter: blur()` e permitido apenas em: navbar ao fazer scroll, modais com overlay, drawers.
- Valor maximo: `blur(20px)`.
- Sempre acompanhado de overlay de cor com opacidade: minimo 0.6 para fundos escuros, 0.8 para fundos claros.
- Nunca usar backdrop-filter em cards de lista — performance.

### 11.3 Z-index oficiais

```
base:      0
raised:    10    ← cards hover, sticky elements
dropdown:  100
sticky:    200   ← navbar ao fazer scroll
modal-overlay: 300
modal:     400
toast:     500
tooltip:   600
```

---

## 12) Backgrounds e Atmosfera Visual

### 12.1 Tipos permitidos por contexto

| Contexto | Tipos permitidos | Restricoes |
|---|---|---|
| Hero (home) | Imagem full-bleed + overlay, video muted loop + overlay, gradient mesh | Contraste de texto minimo 7:1 sobre overlay |
| Secao de destaque | Gradient de 2 stops, cor solida com noise texture | Noise max 4% de opacidade |
| Card de passeio | Imagem no topo (aspect-ratio fixo), sem background decorativo no corpo | Sem gradiente no corpo do card |
| Secao de conversao (CTA final) | Cor solida accent ou dark, sem imagem de fundo | |
| Formularios e checkout | Cor neutra solida, sem gradiente, sem imagem | |
| Modal e drawer | Cor neutra solida + backdrop blur no overlay | |

### 12.2 Tratamento de imagens

- Todas as imagens de passeios devem ter aspect-ratio definido e fixo (ex: 16/9 ou 4/3).
- Nenhuma imagem pode esticar ou comprimir fora do aspect-ratio. Usar `object-fit: cover`.
- Imagens hero: carregar versao webp com fallback jpg. Tamanho maximo: [preencher]kb.
- Imagens de card: lazy loading com skeleton no placeholder.
- Tratamento tonal: [definir se ha filtro de cor/tonalidade aplicado via CSS para consistencia]

---

## 13) Comportamento de Scroll

### 13.1 Scroll reveal

- Elementos que aparecem no scroll usam: `opacity: 0 → 1` + `translateY: 24px → 0`.
- Duracao: atmospheric (600ms) para primeiros elementos de secao, slow (400ms) para demais.
- Threshold de trigger: elemento entra 15% no viewport.
- Maximo de 4 elementos com scroll reveal simultaneo na mesma secao.
- Listas de cards: stagger de 40ms entre cada item, maximo de 8 itens com stagger (restantes aparecem sem delay).
- Nunca aplicar scroll reveal em elementos acima do fold (hero, navbar).

### 13.2 Sticky elements

- Navbar: sempre sticky. Ao scroll > 64px: background recebe backdrop-blur + opacidade 0.9, sombra elevacao-2.
- CTA de reserva em pagina de detalhe: sticky no bottom em mobile quando o CTA original nao estiver visivel.
- Sidebar de filtros em listagem (desktop): sticky com offset de acordo com altura da navbar.

### 13.3 Proibicoes de animacao por contexto de scroll

**Regra:** o agente DEVE verificar o contexto antes de aplicar qualquer animacao de scroll. Animacao nao listada como permitida nesta tabela e automaticamente proibida.

| Contexto | Scroll reveal | Parallax | Sticky | Justificativa |
|---|---|---|---|---|
| Hero / primeiro viewport | Proibido | Permitido (hero apenas) | Navbar | Conteudo acima do fold deve estar visivel imediatamente |
| Secoes de conteudo (home) | Permitido | Proibido | Nao | Ritmo de descoberta — revelacao progressiva e desejada |
| Listagem de cards | Apenas stagger na carga inicial | Proibido | Sidebar de filtros | Scroll frequente — sem reveal em cada rolagem |
| Pagina de detalhe — galeria e resumo | Parallax na galeria apenas | Permitido na galeria | CTA de reserva | Intensidade alta permitida no topo |
| Pagina de detalhe — descricao e abaixo | Scroll reveal leve | Proibido | CTA de reserva | Foco em leitura, nao em efeito |
| Checkout (qualquer step) | Proibido | Proibido | Resumo do pedido | Contexto critico — zero distracao |
| Formularios (qualquer pagina) | Proibido | Proibido | Nao | Foco em preenchimento, nao em efeito |
| Modal / drawer (conteudo interno) | Proibido | Proibido | Nao | Contexto confinado — scroll reveal nao faz sentido |

### 13.3-A Proibicoes Absolutas de Scroll

**Proibido em qualquer contexto:**
- Scroll reveal com `translateX` lateral — apenas `translateY` de baixo para cima e permitido.
- Scroll reveal com `scale` ou `rotation`.
- Parallax em qualquer breakpoint mobile (qualquer intensidade, sem excecao).
- Parallax com deslocamento > 30% da altura do container.
- Parallax implementado com `background-attachment: fixed`.
- Scroll reveal com threshold de trigger < 10% (elemento anima antes de aparecer na tela).
- Scroll reveal com threshold de trigger > 30% (elemento anima muito depois de aparecer).
- Mais de 4 elementos com scroll reveal simultaneo na mesma secao.
- Scroll reveal em hero, navbar ou qualquer elemento acima do fold.
- Qualquer animacao de scroll em: checkout, pagamento, cadastro, formularios criticos, modais, drawers.
- Re-animar scroll reveal ao rolar para cima e descer novamente (animacao ocorre apenas na primeira vez).
- Scroll reveal com `opacity` iniciando em valor > 0.1 (deve iniciar em 0 ou muito proximo).
- `IntersectionObserver` com `rootMargin` positivo que faz o reveal antes do elemento entrar no viewport.

### 13.4 Parallax

- Permitido apenas em: imagem de hero, background de secao em detalhe de passeio.
- Velocidade de parallax: 0.3x da velocidade de scroll (deslocamento maximo 30%).
- Implementar com `transform: translateY()` via scroll event, nunca com `background-attachment: fixed` (performance).
- Desabilitado em mobile (touch scroll + performance).
- Desabilitado quando `prefers-reduced-motion: reduce` esta ativo.

---

## 14) Responsividade com Intencao

Breakpoints nao mudam apenas o layout — mudam a experiencia, o nivel de intensidade visual e os componentes ativos.

### 14.1 Breakpoints oficiais

```
mobile-sm:  < 375px
mobile:     375px – 767px
tablet:     768px – 1023px
desktop-sm: 1024px – 1279px
desktop:    1280px – 1535px
desktop-xl: ≥ 1536px
```

### 14.2 O que muda por breakpoint (alem do layout)

| Elemento | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero | Imagem centralizada, CTA empilhado, texto menor | Imagem lateral, texto medio | Full-bleed, texto grande, parallax ativo |
| Navegacao | Bottom navigation ou hamburger drawer | Top nav com icones | Top nav completo com labels |
| Cards de passeio | 1 coluna, imagem topo | 2 colunas | 3–4 colunas com hover effects |
| Filtros | Sheet/drawer no bottom | Sidebar colapsavel | Sidebar sempre visivel |
| Intensidade de animacao | Reduzida (sem parallax, sem hover effects) | Parcial (hover, sem parallax) | Completa |
| Sticky CTA reserva | Visivel como bar no bottom | Visivel como bar no bottom | Embutido na pagina, sem sticky |
| Galeria de fotos | Swipe horizontal (1 por vez) | Grid 2x2 | Grid ou carousel com thumbnails |

### 14.3 Prioridades de experiencia por dispositivo

Mobile e desktop nao sao o mesmo produto redimensionado. As prioridades sao diferentes.

**Mobile — prioridades em ordem:**
1. Velocidade de acesso a informacao critica (preco, disponibilidade, CTA de reserva).
2. Legibilidade sem zoom (font-size minimo 16px em body, 14px em labels).
3. Touch targets acessiveis (minimo 44x44px, espacamento minimo 8px entre alvos).
4. Scroll vertical fluido sem interrupcoes de animacao.
5. Experiencia visual expressiva — apenas onde nao compete com os itens acima.

**Desktop — prioridades em ordem:**
1. Experiencia visual imersiva e encantamento no primeiro acesso.
2. Eficiencia de navegacao e comparacao de passeios.
3. Confianca atraves de detalhe e qualidade visual.
4. Conversao no detalhe e no checkout.

**Consequencias tecnicas obrigatorias:**

| Decisao | Mobile | Desktop |
|---|---|---|
| Hover effects | Nenhum (touch nao tem hover) | Obrigatorio em todos os interativos |
| Parallax | Desabilitado | Habilitado apenas nos contextos da secao 13.4 |
| Scroll reveal | Apenas fade simples, sem translateY — performance | Fade + translateY conforme secao 13.1 |
| Numero de colunas de cards | 1 | 3–4 |
| Tamanho tipografico de hero | 3xl–4xl maximo | 5xl–7xl conforme design |
| CTA de reserva | Sempre visivel (sticky bottom bar) | Inline na pagina, sticky sidebar |
| Filtros | Ocultos ate acionados (bottom sheet) | Visiveis permanentemente (sidebar) |
| Galeria de passeio | Touch-swipe nativo, 1 imagem por vez | Thumbnails + imagem principal, hover para trocar |
| Animacoes de entrada | Apenas opacity (sem transform) | opacity + translateY conforme secao 7.1 |

### 14.4 Proibicoes por Dispositivo

**Proibido em Mobile:**
- Qualquer hover effect (touch nao tem estado hover — nenhuma excecao).
- Parallax de qualquer tipo ou intensidade.
- Scroll reveal com `translateY` (apenas `opacity`).
- Menus fly-out que dependem de hover para abrir.
- Tooltips que dependem de hover para aparecer — usar tap + bottom sheet.
- Cards com mais de 1 coluna na listagem principal.
- Bottom sheet que abre automaticamente sem acao do usuario.
- `font-size` de hero > `4xl` (3rem equivale a 48px — limite de legibilidade em tela pequena).
- Sidebar de filtros sempre visivel.
- Touch targets < 44x44px.
- Espacamento < 8px entre dois alvos de toque adjacentes.

**Proibido em Desktop:**
- Sticky bottom bar de CTA de reserva (CTA fica inline ou em sticky sidebar).
- Bottom navigation (usar top navigation).
- Swipe horizontal como unica forma de navegar galeria — sempre oferecer thumbnails ou botoes.
- Sidebar de filtros colapsada por padrao — deve estar sempre visivel.
- Font-size de body < `md` (16px) — desktop nao dispensa legibilidade.
- Ausencia de hover effects em qualquer elemento interativo.

---

## 15) Sistema de Componentes

### 15.1 Anatomia obrigatoria por componente

Para cada componente nuclear abaixo, o agente DEVE implementar:
1. Todos os estados definidos na secao 8.
2. Variantes visuais documentadas aqui.
3. Microinteracoes da secao 9 quando aplicavel.
4. Tokens oficiais da secao 6 — sem excecao.

#### Button

| Variante | Uso | Cor de fundo | Cor de texto | Border |
|---|---|---|---|---|
| primary | CTA principal, reserva, continuar | accent-500 | neutral-0 | nenhuma |
| secondary | Acoes secundarias | transparent | primary-500 | 1.5px primary-500 |
| ghost | Acoes terciarias, links em contexto de card | transparent | neutral-700 | nenhuma |
| destructive | Cancelar, excluir | error | neutral-0 | nenhuma |
| icon-only | Acoes contextuais (favoritar, compartilhar) | transparent | neutral-500 | nenhuma |

Tamanhos:
- sm: height 32px, padding 12px, font-size sm
- md: height 40px, padding 16px, font-size md ← padrao
- lg: height 48px, padding 24px, font-size lg
- xl: height 56px, padding 32px, font-size lg ← uso exclusivo em CTA hero

#### Input / Textarea

- Default: border neutral-300, background neutral-0
- Focus: border accent-500, focus ring padrao
- Error: border error, icone de alerta a direita, mensagem abaixo
- Disabled: opacity 0.4, background neutral-50, cursor not-allowed
- Floating label: obrigatorio quando o campo tem label (nao usar placeholder como substituto de label)

#### Card de Passeio

Estrutura fixa (nao reordenar):
1. Imagem (aspect-ratio 16/9, object-fit cover, zoom no hover)
2. Badge de categoria (posicao: absolute, topo-esquerdo da imagem)
3. Badge de destaque/oferta se aplicavel (posicao: absolute, topo-direito)
4. Corpo: titulo, localizacao, duracao, avaliacao, preco
5. CTA secundario (ver detalhes) — opcional por contexto

Estados:
- Default: elevacao-1
- Hover (desktop): elevacao-2, translateY(-4px), zoom na imagem
- Favorito ativo: icone de coracao preenchido com cor accent
- Esgotado: overlay com opacidade 0.5, badge "Esgotado", CTA desabilitado

#### Navbar

- Altura: 64px desktop, 56px mobile.
- Comportamento de scroll: descrito na secao 13.2.
- Logo: sempre a esquerda, altura maxima 32px.
- Itens de navegacao: alinhados ao centro ou direita conforme definido em web-v1.
- CTA principal (ex: "Reservar"): sempre visivel na navbar desktop.
- Mobile: hamburger a direita, drawer full-height da esquerda.

#### Skeleton / Loading State

- Cor base: neutral-200.
- Cor shimmer: neutral-100.
- Animacao: shimmer horizontal, 1500ms, loop infinito.
- Formato: deve espelhar exatamente o layout do conteudo final (mesmas proporcoes).
- Tempo minimo de exibicao: 300ms (evitar flash de skeleton).

### 15.2 Icones

- Biblioteca: [definir — apenas uma].
- Tamanho base: 20px (md), 16px (sm), 24px (lg).
- Cor: herda a cor do contexto via `currentColor`.
- Nunca redimensionar icone para tamanhos fora da escala definida.

---

## 16) Padroes de Pagina

### 16.1 Home

- Objetivo: fazer o usuario sentir que quer estar la. Direcionar para busca ou passeio em destaque.
- Fold obrigatorio: hero com imagem atmosferica, headline de alto impacto, campo de busca ou CTA primario.
- Estrutura de secoes (ordem obrigatoria):
  1. Hero (intensidade visual maxima da pagina)
  2. Barra de busca rapida (se nao estiver no hero)
  3. Categorias de passeio (icone + label, scroll horizontal em mobile)
  4. Passeios em destaque (max 4-6 cards)
  5. Bloco de confianca (avaliacoes, numero de clientes, selos)
  6. CTA final de conversao (fundo escuro ou accent, headline + botao)
- Animacoes: stagger em cards de destaque, scroll reveal em secoes 3-6.

### 16.2 Listagem de Passeios

- Objetivo: encontrar o passeio certo com o minimo de esforco.
- Layout desktop: sidebar de filtros (esquerda, 280px) + grid de cards (direita).
- Layout mobile: filtros em bottom sheet, grid de 1 coluna.
- Filtros obrigatorios: categoria, duracao, preco (range slider), avaliacao minima, disponibilidade.
- Ordenacao obrigatoria: relevancia, preco (asc/desc), avaliacao, popularidade.
- Estado vazio: ilustracao + mensagem + CTA para limpar filtros.
- Estado de carregamento: skeleton grid com mesmo numero de cards da ultima busca.
- Paginacao: infinite scroll com botao "Carregar mais" como fallback.

### 16.3 Detalhe do Passeio

- Objetivo: eliminar toda duvida. CTA de reserva deve estar sempre acessivel.
- Estrutura (ordem obrigatoria):
  1. Galeria (hero com imagem principal + thumbnails ou carousel)
  2. Titulo, categoria, avaliacao, numero de avaliacoes
  3. Resumo rapido (duracao, tamanho do grupo, idioma, nivel de dificuldade)
  4. Descricao completa (expansivel em mobile)
  5. O que esta incluido / o que nao esta incluido
  6. Roteiro / itinerario (accordion por etapa)
  7. Ponto de encontro (mapa ou endereco)
  8. Politica de cancelamento
  9. Avaliacoes de clientes (lista com paginacao)
  10. Passeios relacionados (3-4 cards)
- CTA de reserva: sticky sidebar em desktop (preco + botao), sticky bar no bottom em mobile.
- Intensidade visual: alta na galeria, reduzida a partir da descricao.

### 16.4 Checkout / Reserva

- Objetivo: concluir a reserva com zero distracao.
- Restricao de intensidade: nivel 2 maximo. Sem backgrounds atmosfericos, sem animacoes de scroll.
- Estrutura: formulario em steps (max 3 steps) + resumo sempre visivel.
  - Step 1: data, horario, numero de participantes
  - Step 2: dados dos participantes
  - Step 3: pagamento + confirmacao
- Progresso: indicador de steps com estado (completo, ativo, pendente).
- Resumo: sticky em desktop (direita), colapsavel no topo em mobile.
- Erros de validacao: inline, imediatos, com mensagem em linguagem humana.

---

## 17) Conteudo e UX de Conversao

### 17.1 Hierarquia textual por secao

| Elemento | Comprimento maximo | Tom | Estrutura |
|---|---|---|---|
| Hero headline | 6–10 palavras | Evocativo, presente | Verbo de acao ou substantivo de lugar |
| Hero subheadline | 12–20 palavras | Claro, beneficio direto | Sujeito + verbo + beneficio |
| CTA primario | 2–4 palavras | Acao + contexto | "Reservar agora", "Ver passeios" |
| CTA secundario | 2–4 palavras | Neutro | "Saiba mais", "Ver detalhes" |
| Descricao de card | 1–2 linhas | Descritivo, sensorial | Localizacao + caracteristica principal |
| Bloco de confianca | Dados numericos | Objetivo | "X passeios", "Y avaliacoes 5 estrelas" |

### 17.2 Sinais de confianca obrigatorios

Presentes em: home (bloco dedicado), detalhe (resumo rapido), checkout (rodape do formulario):
- Numero de avaliacoes e nota media.
- Politica de cancelamento em destaque.
- Metodo de pagamento seguro (icones).
- [Adicionar outros conforme marca]

### 17.3 Urgencia e escassez

- Permitidos apenas se baseados em dados reais: "Apenas X vagas restantes", "X pessoas visualizando agora".
- Formato visual: badge neutro-warning, nao vermelho agressivo.
- Nunca usar urgencia ficticia ou contadores regressivos falsos.

---

## 18) Acessibilidade

Nivel minimo: WCAG 2.1 AA. Verificacao obrigatoria antes de qualquer entrega.

| Criterio | Regra |
|---|---|
| Contraste de texto | 4.5:1 normal, 3:1 texto grande (18px+ ou 14px+ bold) |
| Contraste de componentes | 3:1 para bordas de inputs, icones funcionais |
| Navegacao por teclado | Tab order logico, todos os interativos focaveis |
| Focus visivel | Focus ring definido na secao 8.2, sempre visivel |
| Labels | Todo input tem label associado (for/id ou aria-label) |
| Imagens | Alt text descritivo para imagens de conteudo, alt="" para decorativas |
| Erros | Mensagens de erro associadas ao campo via aria-describedby |
| Motion | Fallback definido na secao 7.4 |
| Touch targets | Minimo 44x44px para elementos interativos em mobile |
| Landmarks | nav, main, aside, footer semanticos em toda pagina |

---

## 19) Performance Budget

Limites maximos obrigatorios. Ultrapassar qualquer limite requer justificativa explicita.

| Metrica | Limite | Estrategia de garantia |
|---|---|---|
| LCP | < 2.5s | Preload da imagem hero, webp, CDN |
| CLS | < 0.1 | Dimensoes explicitas em imagens e skeletons |
| FID/INP | < 200ms | Nao bloquear main thread com animacoes |
| Peso total JS (inicial) | < 200kb gzip | Code splitting por rota |
| Peso de imagem hero | < [preencher]kb | webp + srcset + lazy (exceto hero) |
| Fontes | Max 2 familias, max 3 pesos cada | font-display: swap, preload |
| Animacoes simultaneas | Max 3 por viewport | Pausar fora do viewport (IntersectionObserver) |
| backdrop-filter | Max 2 elementos simultaneos | Nao usar em listas ou cards |

---

## 20) Mapeamento de Referencias para o Agente

### 20.1 Protocolo de leitura de referencias

Ao receber arquivos da pasta `/references`, o agente DEVE:

1. Identificar o tipo de cada referencia (layout, tipografia, motion, atmosfera, componente, conteudo).
2. Extrair apenas os elementos do tipo identificado conforme a tabela 5.1.
3. Nao transferir valores literais de CSS — converter para tokens equivalentes deste documento.
4. Registrar a extracao no campo "Inspirado por" do `web-v1.md`.
5. Se uma referencia contradizer uma regra deste template, o template prevalece.

### 20.2 Formato de registro de extracao

Para cada decisao inspirada em referencia externa, registrar no `web-v1.md`:

```
Decisao: [nome do componente/padrao]
Referencia: REF-[id]
Tipo de extracao: [tipo]
O que foi extraido: [descricao tecnica]
Adaptacao aplicada: [como foi convertido para os tokens/regras deste documento]
```

---

## 20-A) Arvore de Decisao para Ambiguidades

Quando o agente encontrar uma situacao nao coberta explicitamente por este documento, deve seguir esta arvore em ordem:

```
1. A situacao e coberta por alguma regra deste documento?
   SIM → aplicar a regra.
   NAO → continuar.

2. A situacao envolve um valor nao preenchido ([preencher])?
   SIM → sinalizar como TODO:[descricao] e nao implementar o elemento.
   NAO → continuar.

3. A situacao e um componente sem anatomia definida?
   SIM → usar o componente mais proximo ja definido como base,
          aplicar os tokens da secao 6,
          implementar todos os estados da secao 8,
          registrar como "componente derivado de [base]" na entrega.
   NAO → continuar.

4. A situacao e uma variacao de layout nao mapeada?
   SIM → aplicar o principio de hierarquia da secao 10,
          garantir nao-competicao conforme secao 10.4,
          registrar a decisao na entrega.
   NAO → continuar.

5. A situacao envolve uma animacao nao mapeada na secao 7.2?
   SIM → nao animar. Implementar sem animacao e sinalizar como TODO:animacao-nao-mapeada.
   NAO → sinalizar como TODO:[descricao-da-situacao] e pausar.
```

## 21) Regras para o Agente de IA (Prompt Contract)

### 21.1 O que o agente DEVE fazer

1. Usar exclusivamente os tokens da secao 6. Nenhum valor de cor, tamanho, duracao ou easing pode ser inventado.
2. Implementar todos os estados da secao 8 em todos os componentes interativos.
3. Aplicar as microinteracoes da secao 9 nos elementos mapeados.
4. Seguir o protocolo de referencias da secao 20 e as proibicoes da secao 5.4.
5. Verificar contraste e acessibilidade conforme secao 18 antes de entregar.
6. Reportar como `TODO:[descricao]` qualquer decisao que nao esteja coberta por este documento.
7. Verificar se a rota ativa o Modo Critico (secao 25) antes de aplicar qualquer animacao ou efeito visual.
8. Aplicar fallback conservador da secao 24 quando houver lacuna de especificacao, sempre com registro de TODO.

### 21.2 O que o agente NAO PODE fazer

- Inventar tokens, valores de cor, tamanho, duracao ou easing nao presentes neste documento.
- Omitir estados de componente (hover, focus, disabled, loading, error).
- Usar fontes nao definidas na secao 6.2.
- Aplicar `transition: all` em qualquer elemento.
- Usar `linear` easing em transicoes visiveis.
- Copiar layout literal de referencias externas.
- Usar `background-attachment: fixed` para parallax.
- Ignorar o protocolo de acessibilidade da secao 18.
- Assumir valores para campos marcados como `[preencher]` — deve sinalizar e aguardar.
- Aplicar animacoes ou efeitos visuais em rotas de Modo Critico alem do permitido na secao 25.2.
- Omitir o registro de fallback quando a secao 24 for ativada.
- Misturar tipos de extracao de referencias conforme proibido na secao 5.4.
- Aplicar qualquer comportamento listado nas proibicoes das secoes 7.5, 8.3, 9.1, 10.5, 13.3-A e 14.4.

**Campos marcados como AGUARDA-HUMANO — proibicoes especificas:**
- Inferir sensacao primaria ou secundaria (secao 3.1) a partir de cores, fontes ou efeitos de qualquer referencia.
- Inferir adjetivos de identidade (secao 4.1) a partir de estilos visuais de terceiros.
- Criar ou sugerir uma assinatura visual (secao 4.2) sem instrucao humana explicita.
- Preencher qualquer valor hex de cor (secao 6.1) a partir de referencia CSS externa.
- Escolher display font ou body font (secao 6.2) a partir de fontes usadas em sites de referencia.
- Implementar qualquer componente que dependa de tokens `AGUARDA-HUMANO` ausentes — registrar `AGUARDA-HUMANO:[campo]` e bloquear apenas os elementos dependentes, mantendo o restante da implementacao.

### 21.3 Formato de entrega obrigatorio

Toda entrega de componente ou pagina deve incluir:

```
Componente/Pagina: [nome]
Estados implementados: [listar]
Tokens utilizados: [listar tokens de cor, tipo e motion]
Referencias aplicadas: [REF-id ou "nenhuma"]
Acessibilidade verificada: [sim/nao + criterios]
Performance: [notas]
TODOs pendentes: [listar ou "nenhum"]
```

---

## 22) Anti-Padroes — Proibido em Qualquer Entrega

| Anti-padrao | Consequencia | Alternativa obrigatoria |
|---|---|---|
| `transition: all` | Anima propriedades nao intencionais, degrada performance | Listar propriedades especificas |
| `linear` easing em UI visivel | Movimento robotico, sem sensacao de fisicalidade | Usar `standard` ou `decelerate` |
| `outline: none` sem substituto | Quebra navegacao por teclado | Usar focus ring da secao 8.2 |
| Placeholder como substituto de label | Inacessivel, desaparece no foco | Floating label ou label visivel |
| Texto sobre imagem sem overlay | Contraste imprevisivel | Overlay obrigatorio conforme secao 12 |
| `background-attachment: fixed` | Performance catastrofica em mobile | `transform: translateY()` via scroll event |
| Cores fora da paleta oficial | Incoerencia visual | Apenas tokens da secao 6.1 |
| Animacao sem `prefers-reduced-motion` | Inacessivel | Fallback obrigatorio conforme secao 7.4 |
| Estados de componente incompletos | Experiencia quebrada | Todos os estados da secao 8 obrigatorios |
| `console.log` em codigo de producao | — | Remover antes de entregar |

---

## 24) Fallback de Execucao

Define o comportamento conservador obrigatorio quando uma regra especifica nao estiver especificada neste documento e a arvore de decisao da secao 20-A nao resolver.

**Condicao de ativacao:** agente encontra situacao nao coberta por nenhuma secao deste documento.

**Comportamento conservador obrigatorio (aplicar nesta ordem):**

1. **Sem animacao:** implementar sem qualquer animacao. Nenhuma transicao inventada.
2. **Legibilidade em primeiro lugar:** `neutral-700` para texto body, `neutral-900` para headings, `neutral-0` para fundo de pagina.
3. **Sem gradiente:** fundo neutro solido. Sem efeito de profundidade nao definido.
4. **Espacamento seguro:** `padding` e `gap` de `16px` (espacamento-4) como valor padrao universal.
5. **Border radius seguro:** `md` (8px) como valor padrao universal.
6. **Elevacao zero:** nenhum `box-shadow` ate que o contexto seja definido nos tokens.
7. **Tipografia segura:** body font, peso `body-regular`, tamanho `md`.
8. **Estados minimos obrigatorios (mesmo no fallback):**
   - Hover: `background-color` escurece 5%, duracao `fast` (150ms), easing `standard`.
   - Focus: focus ring padrao da secao 8.2.
   - Disabled: `opacity: 0.4`, `pointer-events: none`, `cursor: not-allowed`.
9. **Sinalizar como TODO:** registrar `TODO:fallback-aplicado:[descricao-da-situacao]` no formato de entrega da secao 21.3.

**Restricao:** fallback nao dispensa o preenchimento dos tokens. E uma solucao temporaria que deve ser substituida quando os valores forem definidos no `web-v1.md`.

**Proibido no fallback:**
- Inventar paleta de cores fora dos tokens.
- Inventar animacoes nao mapeadas.
- Usar Inter, Roboto, Arial ou qualquer fonte system-ui como display font.
- Aplicar efeitos de profundidade (blur, gradiente, sombra) nao definidos.
- Omitir silenciosamente o `TODO` — toda decisao de fallback deve ser reportada.
- Aplicar fallback e considerar o componente completo — ele deve ser revisado quando os tokens forem preenchidos.

---

## 25) Modo Critico — Fluxos Sensiveis

Define restricoes maximas de experiencia visual para contextos onde distracoes comprometem a conclusao da tarefa.

**Aplicavel a:** checkout, pagamento, cadastro, recuperacao de senha, alteracao de dados sensiveis, confirmacao de reserva.

**Ativacao automatica:** quando a rota for `/checkout/*`, `/pagamento/*`, `/cadastro/*`, `/conta/*`, `/confirmacao/*`.

**Regra geral:** em Modo Critico, a interface serve o fluxo. Nenhum elemento visual compete com a tarefa do usuario.

### 25.1 O que muda no Modo Critico

| Elemento | Comportamento padrao (fora do modo critico) | Comportamento em Modo Critico |
|---|---|---|
| Animacoes decorativas | Permitidas conforme secao 7 | Removidas completamente |
| Scroll reveal | Permitido conforme secao 13.3 | Proibido |
| Parallax | Permitido no hero e detalhe | Proibido |
| Backgrounds atmosfericos | Permitidos conforme secao 12 | Substituidos por `neutral-50` ou `neutral-0` solido |
| Intensidade visual | Conforme secao 3.3 | Forcado para nivel 2 maximo |
| Microinteracoes | Todas as mapeadas na secao 9 | Apenas: focus ring, floating label, shake de erro, indicador de step |
| CTAs por viewport | Ate 3 (Z1+Z2+Z3) | Maximo 1 CTA primario por viewport |
| Badges de urgencia/escassez | Permitidos com dados reais | Proibidos |
| Stagger em listas | Permitido conforme secao 6.4 | Proibido |
| Animacao de entrada de pagina | Fade + translateY | Apenas fade simples (opacity 0→1, 250ms) |
| Ripple em botao | Obrigatorio no primario | Proibido |
| Hover com translateY | Obrigatorio em cards | Apenas mudanca de background-color permitida |

### 25.2 Microinteracoes permitidas em Modo Critico (unicas)

| Microinteracao | Trigger | Comportamento | Duracao | Easing |
|---|---|---|---|---|
| Focus ring | `focus` em qualquer interativo | 2px solid accent-500, offset 2px | 150ms | standard |
| Floating label | `focus` em input | label sobe: translateY(-20px), font-size sm, cor accent-500 | 250ms | standard |
| Shake de erro | `blur` com validacao falha | translateX shake (3 ciclos, 4px amplitude) + borda error | 400ms | spring |
| Indicador de step | Avanco de step | background-color + cor do texto | 250ms | standard |
| Loading no submit | `click` em botao de submit | Spinner 800ms linear + dimensoes preservadas | — | linear |

### 25.3 Proibicoes em Modo Critico

**Proibido:**
- Animacoes de entrada de pagina com `translateY` ou `scale`.
- Ripple em qualquer botao.
- Microinteracoes de favoritar, compartilhar ou outros elementos contextuais.
- Badges de urgencia, escassez ou "pessoas visualizando agora".
- Imagens de fundo, overlays atmosfericos, gradient mesh.
- Stagger em qualquer lista.
- Parallax e scroll reveal de qualquer tipo.
- Hover com `translateY` em cards ou botoes (apenas `background-color` permitida).
- Mais de 1 CTA primario por viewport.
- Qualquer elemento Z1 que nao seja o CTA ou headline principal do step atual.
- Efeitos de profundidade (blur, box-shadow escalada) em campos de formulario.
- Animacao de fundo ou textura animada.
- Notificacoes ou toasts nao relacionados ao fluxo atual.

---

## 26) Checklist de Revisao

Toda tela ou componente passa por este checklist antes de ser aceito:

**Visual e Estetico**
- [ ] Usa exclusivamente tokens oficiais da secao 6.
- [ ] Segue a direcao estetica definida na secao 4.
- [ ] Assinatura visual presente nas telas mapeadas.
- [ ] Intensidade visual correta para o contexto (secao 3.3).

**Sistema de Atencao**
- [ ] Exatamente 1 elemento Z1 por viewport em toda tela.
- [ ] Nenhum conflito de atencao nao resolvido (secao 10.1-A).
- [ ] Regras de nao-competicao da secao 10.4 verificadas.
- [ ] Maximo 1 elemento com cor accent de fundo por secao.
- [ ] Botao primario e secundario com variantes distintas na mesma area.

**Interacao e Motion**
- [ ] Todos os estados da secao 8 implementados com movimento + visual.
- [ ] Microinteracoes da secao 9 aplicadas onde mapeado.
- [ ] Animacoes usam tokens de motion da secao 6.4.
- [ ] Animacao de cada contexto confere com a tabela da secao 7.2.
- [ ] `prefers-reduced-motion` implementado com fallback de opacity only.
- [ ] Nenhum `transition: all` ou easing `linear` em UI visivel.
- [ ] Reversao de hover/focus usa mesma duracao e easing da entrada.

**Responsividade**
- [ ] Testado nos 3 breakpoints principais (mobile, tablet, desktop).
- [ ] Mudancas de experiencia da secao 14.2 aplicadas.
- [ ] Prioridades de dispositivo da secao 14.3 respeitadas.
- [ ] Parallax desabilitado em mobile.
- [ ] Scroll reveal em mobile usa apenas opacity (sem translateY).
- [ ] Hover effects ausentes em mobile.

**Acessibilidade**
- [ ] Contraste WCAG AA em todo texto.
- [ ] Focus ring visivel em todos os interativos.
- [ ] Labels em todos os inputs.
- [ ] Alt text em todas as imagens de conteudo.
- [ ] Touch targets minimo 44x44px em mobile.

**Performance**
- [ ] Dentro do budget da secao 19.
- [ ] Imagens com dimensoes explicitas (sem CLS).
- [ ] Animacoes fora do viewport pausadas.
- [ ] Maximo de 3 animacoes simultaneas por viewport.

**Scroll**
- [ ] Scroll reveal ausente em checkout e formularios.
- [ ] Scroll reveal ausente no hero e navbar.
- [ ] Parallax restrito aos contextos da secao 13.4.
- [ ] Sticky elements implementados conforme secao 13.2.

**Modo Critico**
- [ ] Verificar se a rota ativa o Modo Critico (secao 25).
- [ ] Se ativo: intensidade visual forcada para nivel 2 maximo.
- [ ] Se ativo: animacoes decorativas e scroll reveal removidos.
- [ ] Se ativo: apenas microinteracoes da secao 25.2 presentes.
- [ ] Se ativo: no maximo 1 CTA primario por viewport.
- [ ] Se ativo: backgrounds atmosfericos substituidos por neutro solido.

**Referencias**
- [ ] Cada referencia tem exatamente 1 tipo de extracao.
- [ ] Nenhum valor literal de CSS transferido de referencias externas.
- [ ] Nivel de influencia Alto em no maximo 2 referencias por pagina.
- [ ] Extracoes sem mapeamento para tokens registradas como TODO.

**Fallback**
- [ ] Nenhuma decisao de fallback silenciosa — todos os TODO registrados.
- [ ] Fallback usa apenas comportamentos da secao 24.
- [ ] Nenhum token inventado fora da secao 6.

**Campos AGUARDA-HUMANO**
- [ ] Sensacao primaria e secundaria (secao 3.1) preenchidas por humano — nao inferidas.
- [ ] Adjetivos de identidade (secao 4.1) preenchidos por humano.
- [ ] Assinatura visual (secao 4.2) definida por humano ou bloco ausente documentado.
- [ ] Todos os valores hex da paleta (secao 6.1) fornecidos por humano.
- [ ] Display font e body font (secao 6.2) escolhidas por humano.
- [ ] Nenhum campo `AGUARDA-HUMANO` preenchido por inferencia de codigo de referencia.

**Entrega**
- [ ] Formato de entrega da secao 21.3 preenchido.
- [ ] Nenhum `TODO` ou `AGUARDA-HUMANO` nao reportado.
- [ ] Referencias rastreadas conforme secao 20.2.
- [ ] Arvore de decisao da secao 20-A consultada para qualquer caso nao coberto.
