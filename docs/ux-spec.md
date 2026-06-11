# GoDados.cam — Especificação UX/UI do Brand Website

**Autor:** Uma (@ux-design-expert)
**Data:** 2026-06-11
**Status:** APROVADO PARA IMPLEMENTAÇÃO
**Escopo:** Single-page brand website estático (`app/brand/`)
**Stack:** HTML5 + TailwindCSS (CDN) + Vanilla JS — sem framework, sem backend
**Fonte de verdade visual:** `app/brand/brand-identity.md`

---

## 0. Decisões Autônomas (Elicitation Override)

> O agente decidiu autonomamente os pontos abaixo, conforme protocolo YOLO.

- `[AUTO-DECISION]` Fonte primária → **Geist via CDN do Google Fonts** com fallback `Inter`, depois `system-ui` (razão: Geist é OSS e disponível no Google Fonts; evita FOUT pesado e mantém o look Vercel descrito no brand).
- `[AUTO-DECISION]` CTA sem backend → **WhatsApp como canal primário + e-mail como secundário** (razão: Diretor de Operações B2B responde melhor a canal direto e rápido; reduz fricção vs. formulário que não tem para onde enviar).
- `[AUTO-DECISION]` Estrutura de seções → **8 seções** (Nav + Hero + Problema + Como Funciona + Casos de Uso + Prova/KPIs + FAQ-objeções + CTA Final + Footer). FAQ adicionado às sugeridas porque o comprador B2B chega com objeções concretas que precisam ser neutralizadas antes do CTA (razão: reduz abandono na decisão).
- `[AUTO-DECISION]` "Prova Social" → tratada como **Prova Operacional (KPIs + antes/depois)** ao invés de logos/depoimentos, pois a marca está em fase piloto (brand-identity: "VALIDAÇÃO: Crescendo") e não tem carteira de logos para exibir. Honestidade > inflar credibilidade falsa (alinha com brand voice "Direto, não evasivo").
- `[AUTO-DECISION]` Tema dominante → **dark-first** (navy) com seções claras alternadas (razão: o produto é "vigilância/inteligência"; navy transmite autoridade industrial descrita no brand; status colors brilham mais sobre dark).
- `[AUTO-DECISION]` Animações → **CSS-only + IntersectionObserver mínimo** (razão: meta < 2s load, mobile-first, sem libs de animação).

---

## 1. Princípios de Design

1. **Reconhecimento em 5 segundos** — O Diretor de Operações deve, no primeiro scroll, entender: "isso lê as câmeras que eu já tenho e me dá número operacional". Hero entrega isso textualmente e visualmente.
2. **Número antes de adjetivo** — Toda afirmação de valor vem ancorada em métrica concreta (brand voice).
3. **Sem venda de hardware** — A linguagem reforça "câmeras que você já tem" em pelo menos 3 pontos do scroll.
4. **Status como linguagem visual** — Verde/Âmbar/Vermelho são a gramática do produto. Usá-los como elementos de UI (badges, pills, dots) cria coerência produto↔marca.
5. **Densidade de informação respeitosa** — B2B sério: sem hype, sem stock photos genéricas, sem emoji decorativo. Espaço em branco generoso.

---

## 2. Design Tokens (mapa para Tailwind config inline)

```js
// <script> tailwind.config no <head>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy:    { deep: '#0f1f35', mid: '#1a3358' },
        cyan:    { elec: '#06b6d4' },
        action:  { blue: '#3b82f6' },
        status:  { ok: '#10b981', warn: '#f59e0b', alert: '#ef4444' },
        ink:     { 900: '#0f172a', 600: '#475569' },
        surface: { 50: '#f8fafc', 100: '#f1f5f9' },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.04em', tighter2: '-0.02em' },
      lineHeight:    { body: '1.7' },
      maxWidth:      { content: '1200px' },
    }
  }
}
```

### Escala tipográfica (responsiva)

| Token | Mobile | Desktop | Weight | Tracking |
|-------|--------|---------|--------|----------|
| Display/H1 | 40px | 72px | 800 | -0.04em |
| H2 | 32px | 48px | 700 | -0.02em |
| H3 | 24px | 32px | 600 | -0.01em |
| Body Large | 18px | 20px | 400 | — / 1.6 |
| Body | 16px | 16px | 400 | — / 1.7 |
| Label | 12px | 12px | 600 | 0.08em UPPERCASE |

Tailwind classes-base: `text-4xl md:text-7xl font-extrabold tracking-tightest` (H1) etc.

### Tokens de espaçamento de seção
- Padding vertical de seção: `py-20 md:py-28` (80px / 112px)
- Container: `mx-auto max-w-content px-6 md:px-8`
- Gap entre cards: `gap-6 md:gap-8`

---

## 3. Mapa de Seções (single-page scroll)

```
┌─────────────────────────────────────────────┐
│ [0] NAV (sticky, dark, blur)                  │
│ [1] HERO  ── navy deep, full viewport          │  ← reconhecimento em 5s
│ [2] PROBLEMA ── navy mid, perguntas-objeção    │  ← "ele entende minha dor"
│ [3] COMO FUNCIONA ── branco, 3 passos          │  ← desmistifica
│ [4] CASOS DE USO ── surface-50, tabs H3/H5/CD  │  ← "isso é pra mim"
│ [5] PROVA OPERACIONAL ── navy deep, KPIs +     │  ← antes/depois concreto
│      timeline antes/depois                     │
│ [6] OBJEÇÕES (FAQ) ── branco, accordion        │  ← neutraliza fricção
│ [7] CTA FINAL ── gradiente navy→cyan, WhatsApp │  ← conversão
│ [8] FOOTER ── navy deep                         │
└─────────────────────────────────────────────┘
```

Âncoras de navegação: `#problema`, `#como-funciona`, `#casos`, `#resultados`, `#contato`.

---

## 4. Wireframes Textuais + Copywriting

### [0] NAV — sticky top

```
┌──────────────────────────────────────────────────────────────┐
│  ◉ GoDados.cam        Problema  Como Funciona  Casos  ┌──────┐ │
│  (logo SVG dark)                                       │Falar │ │
│                                                        │c/ time│ │
│                                                        └──────┘ │
└──────────────────────────────────────────────────────────────┘
```
- Fundo: `bg-navy-deep/80 backdrop-blur-md`, border-bottom `border-white/10`.
- Logo: variante **dark** (wordmark branco, ".cam" cyan, ícone cyan).
- Links: `text-slate-300 hover:text-white`. Underline cyan animado no hover.
- CTA nav: botão cyan pequeno `Falar com o time`.
- Mobile: links colapsam em menu hambúrguer (drawer full-screen navy).

---

### [1] HERO — navy deep, ~90vh

```
┌──────────────────────────────────────────────────────────────┐
│  ▸ INTELIGÊNCIA OPERACIONAL DO MUNDO FÍSICO   (label cyan)      │
│                                                                 │
│  Suas câmeras já gravam.                                        │
│  A GoDados lê.                              [visual: grid de    │
│                                              feeds de câmera     │
│  Transformamos as câmeras de segurança       com pills de       │
│  que você já tem em sensores de              status ✓ ! ✗ ]     │
│  inteligência operacional — KPIs de                             │
│  conformidade em tempo real, sem                                │
│  instalar uma única câmera nova.                                │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐                      │
│  │ Ver como funciona│  │ Falar com o time │                      │
│  └─────────────────┘  └──────────────────┘                      │
│                                                                 │
│  ─ Zero hardware novo ─ Leitura contínua ─ KPI em tempo real ─  │
└──────────────────────────────────────────────────────────────┘
```

**Copy (texto real):**
- Eyebrow/label: `INTELIGÊNCIA OPERACIONAL DO MUNDO FÍSICO`
- H1: **Suas câmeras já gravam.** *(quebra)* **A GoDados lê.**
- Subhead: *"Transformamos as câmeras de segurança que você já tem em sensores de inteligência operacional — KPIs de conformidade em tempo real, sem instalar uma única câmera nova."*
- CTA primário: `Ver como funciona →` (scroll suave para #como-funciona)
- CTA secundário: `Falar com o time` (abre WhatsApp)
- Trust strip (3 pílulas): `Zero hardware novo` · `Leitura contínua 24/7` · `KPI em tempo real`

**Visual à direita:** mock de "painel GoDados" — grid 2x2 de placeholders de feed de câmera (não fotos reais; retângulos navy-mid com cantos de mira e timestamp), cada um com um **status pill** (verde "Conforme", âmbar "Atenção", vermelho "Fora do padrão"). Reforça o produto em si.

---

### [2] PROBLEMA — navy mid

Estratégia (brand voice): *"Perguntas que o comprador não consegue responder com confiança."*

```
┌──────────────────────────────────────────────────────────────┐
│  O PROBLEMA                                                     │
│                                                                 │
│  Você dirige a operação. Mas consegue responder isso           │
│  agora, sem ligar para ninguém?                                │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │ ?          │  │ ?          │  │ ?          │                 │
│  │ A loja da  │  │ O EPI está │  │ A doca foi │                 │
│  │ zona sul   │  │ sendo usado│  │ liberada   │                 │
│  │ abriu no   │  │ na linha   │  │ dentro do  │                 │
│  │ horário?   │  │ agora?     │  │ SLA hoje?  │                 │
│  └────────────┘  └────────────┘  └────────────┘                 │
│                                                                 │
│  Hoje a resposta vem de checklist autodeclarado, visita        │
│  presencial ou "achismo". Tarde demais e sem prova.            │
└──────────────────────────────────────────────────────────────┘
```

**Copy:**
- Label: `O PROBLEMA`
- H2: **"Você dirige a operação. Mas consegue responder isso agora, sem ligar para ninguém?"**
- 3 cards de pergunta (ícone "?" cyan no topo, texto branco):
  1. *"A loja da zona sul abriu no horário hoje?"*
  2. *"O EPI está sendo usado na linha de produção agora?"*
  3. *"A doca foi liberada dentro do SLA neste turno?"*
- Fechamento: *"Hoje essa resposta vem de checklist autodeclarado, visita presencial ou achismo. Tarde demais — e sem prova."*

---

### [3] COMO FUNCIONA — branco

```
┌──────────────────────────────────────────────────────────────┐
│  COMO FUNCIONA                                                 │
│  Três passos. Nenhuma câmera nova.                             │
│                                                                 │
│   ①─────────────②─────────────③                                │
│   Conecta        Lê             Entrega                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ 🔌 ícone │  │ 👁 ícone │  │ 📊 ícone │                       │
│  │ Conecta  │  │ Lê o que │  │ Entrega  │                       │
│  │ ao seu   │  │ acontece │  │ KPIs de  │                       │
│  │ sistema  │  │ no vídeo │  │conformida│                       │
│  │ de CFTV  │  │ em tempo │  │ de no seu│                       │
│  │ atual    │  │ real     │  │ painel   │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└──────────────────────────────────────────────────────────────┘
```

**Copy:**
- Label: `COMO FUNCIONA`
- H2: **Três passos. Nenhuma câmera nova.**
- Passo 1 — **Conecta**: *"A GoDados se integra ao seu sistema de CFTV atual. Sem trocar equipamento, sem obra, sem novo cabeamento."*
- Passo 2 — **Lê**: *"O software interpreta o que acontece em cada câmera continuamente — presença, fluxo, conformidade, eventos — e classifica em tempo real."*
- Passo 3 — **Entrega**: *"Você recebe KPIs operacionais num painel: o que está dentro do padrão, o que precisa de atenção e o que está fora — com prova em vídeo."*

> Linha conectora entre os 3 passos (cyan) com nós numerados ①②③. No mobile vira vertical.

---

### [4] CASOS DE USO — surface-50, com tabs

Os segmentos do brand (H3 franquias, H5/CDs). Tabs interativas (vanilla JS).

```
┌──────────────────────────────────────────────────────────────┐
│  CASOS DE USO                                                  │
│  Onde a GoDados já faz diferença                              │
│                                                                 │
│  [ Franquias & Varejo ]  [ CDs & Logística ]  [ Indústria ]   │
│  ──────────────────────                                        │
│                                                                 │
│  Seus olhos em cada loja. O tempo todo.                       │
│                                                                 │
│  • Abertura e fechamento no horário        ✓ Conforme         │
│  • Fila e tempo de espera no caixa         ! Atenção          │
│  • Padrão de vitrine e reposição           ✓ Conforme         │
│  • Presença de equipe por turno            ✗ Fora do padrão   │
└──────────────────────────────────────────────────────────────┘
```

**Copy por aba:**

**Aba 1 — Franquias & Varejo** (tagline brand H3):
- Headline: **"Seus olhos em cada loja. O tempo todo."**
- Lista (item + status pill):
  - Abertura e fechamento no horário — `✓ Conforme`
  - Tempo de fila no caixa — `! Atenção`
  - Padrão de vitrine e reposição — `✓ Conforme`
  - Presença de equipe por turno — `✗ Fora do padrão`

**Aba 2 — CDs & Logística** (tagline brand H5):
- Headline: **"O que acontece no seu CD enquanto você não está lá."**
- Lista:
  - Liberação de doca dentro do SLA — `! Atenção`
  - Uso de EPI na operação — `✗ Fora do padrão`
  - Ocupação de área de picking — `✓ Conforme`
  - Movimentação fora de horário — `✓ Conforme`

**Aba 3 — Indústria**:
- Headline: **"Conformidade de chão de fábrica, medida — não declarada."**
- Lista:
  - Uso de EPI na linha — `! Atenção`
  - Áreas restritas sem acesso indevido — `✓ Conforme`
  - Postos ocupados por turno — `✓ Conforme`
  - Paradas não programadas detectadas — `✗ Fora do padrão`

---

### [5] PROVA OPERACIONAL — navy deep (KPIs + Antes/Depois)

```
┌──────────────────────────────────────────────────────────────┐
│  RESULTADOS                                                    │
│  O que muda quando a operação vira dado                       │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │  24/7   │ │  100%   │ │  0      │ │ tempo   │               │
│  │ leitura │ │ das     │ │ câmeras │ │ real    │               │
│  │contínua │ │ câmeras │ │ novas   │ │ alerta  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│   ANTES                    │   DEPOIS                           │
│  ─────────────────────────────────────────────────             │
│  ✗ Visita presencial p/    │  ✓ KPI no painel, sem sair        │
│    saber o que houve       │    da cadeira                     │
│  ✗ Checklist autodeclarado │  ✓ Conformidade medida c/ prova   │
│  ✗ Problema descoberto     │  ✓ Alerta no momento que acontece │
│    dias depois             │                                   │
│  ✗ "Achismo" na decisão    │  ✓ Decisão sobre dado real        │
└──────────────────────────────────────────────────────────────┘
```

**Copy:**
- Label: `RESULTADOS`
- H2: **"O que muda quando a operação vira dado."**
- 4 KPI cards (número grande cyan + label):
  - **24/7** — leitura contínua de cada câmera
  - **100%** — das suas câmeras atuais aproveitadas
  - **0** — câmeras novas instaladas
  - **Tempo real** — do evento ao alerta

- **Timeline Antes/Depois** (2 colunas, ANTES em ink-600/vermelho, DEPOIS em verde):

| ANTES (sem GoDados) | DEPOIS (com GoDados) |
|---|---|
| `✗` Visita presencial para saber o que aconteceu | `✓` KPI no painel, sem sair da cadeira |
| `✗` Checklist autodeclarado pela própria equipe | `✓` Conformidade medida, com prova em vídeo |
| `✗` Problema descoberto dias depois | `✓` Alerta no momento em que acontece |
| `✗` Decisão baseada em "achismo" | `✓` Decisão sobre dado real e auditável |

> Nota de honestidade (brand voice "direto/não evasivo"): números marcados como capacidade do produto, **não** como métricas de cliente infladas. Quando houver dados de piloto reais, substituir KPIs por resultados nominais.

---

### [6] OBJEÇÕES (FAQ) — branco, accordion

```
┌──────────────────────────────────────────────────────────────┐
│  ANTES DE FALAR COM A GENTE                                    │
│                                                                 │
│  ▸ Preciso trocar minhas câmeras?                    [+]        │
│  ▸ E a privacidade / LGPD?                           [+]        │
│  ▸ Funciona com o meu sistema de CFTV?               [+]        │
│  ▸ Quanto tempo até estar rodando?                   [+]        │
│  ▸ Os dados ficam onde?                              [+]        │
└──────────────────────────────────────────────────────────────┘
```

**Copy (perguntas + respostas reais):**

- **Preciso trocar minhas câmeras?**
  *"Não. A GoDados é uma camada de software que se conecta às câmeras que você já tem. Se elas gravam hoje, a gente lê."*

- **E a privacidade e a LGPD?**
  *"A GoDados lê eventos operacionais — presença, fluxo, conformidade — não cria perfis de pessoas. O processamento segue as bases legais da LGPD para legítimo interesse operacional, e você controla o que é monitorado."*

- **Funciona com o meu sistema de CFTV?**
  *"Trabalhamos com os principais sistemas e protocolos de mercado (RTSP/ONVIF e DVRs/NVRs comuns). Na conversa inicial validamos a compatibilidade do seu parque em poucos minutos."*

- **Quanto tempo até estar rodando?**
  *"Por ser software sobre a infraestrutura existente, não há obra. A ativação é em dias, não em meses."*

- **Onde os dados ficam?**
  *"Os KPIs e eventos ficam no seu painel. Definimos junto com você a política de retenção e o nível de acesso por usuário."*

---

### [7] CTA FINAL — gradiente navy-deep → cyan

```
┌──────────────────────────────────────────────────────────────┐
│                                                                 │
│           Pare de descobrir os problemas tarde demais.         │
│                                                                 │
│      Suas câmeras já estão lá. Vamos fazer elas falarem.       │
│                                                                 │
│        ┌────────────────────────┐  ┌───────────────────┐       │
│        │  Falar no WhatsApp  →  │  │  Enviar e-mail    │       │
│        └────────────────────────┘  └───────────────────┘       │
│                                                                 │
│        Resposta em horário comercial · Sem compromisso         │
└──────────────────────────────────────────────────────────────┘
```

**Copy:**
- H2: **"Pare de descobrir os problemas tarde demais."**
- Subhead: *"Suas câmeras já estão lá. Vamos fazer elas falarem."*
- CTA primário: `Falar no WhatsApp →` → `https://wa.me/55XXXXXXXXXXX?text=Olá,%20quero%20entender%20como%20a%20GoDados%20lê%20minhas%20câmeras`
- CTA secundário: `Enviar e-mail` → `mailto:contato@godados.cam?subject=Quero%20conhecer%20a%20GoDados`
- Microcopy: *"Resposta em horário comercial · Sem compromisso"*

> Placeholders `55XXXXXXXXXXX` e `contato@godados.cam` devem ser substituídos pelos canais reais antes do go-live.

---

### [8] FOOTER — navy deep

```
┌──────────────────────────────────────────────────────────────┐
│  ◉ GoDados.cam                                                 │
│  Inteligência Operacional do Mundo Físico                     │
│                                                                 │
│  Produto        Empresa        Contato                         │
│  Como funciona  Sobre          WhatsApp                        │
│  Casos de uso   LGPD           contato@godados.cam            │
│  Resultados     Privacidade                                    │
│                                                                 │
│  ──────────────────────────────────────────────               │
│  © 2026 GoDados.cam · Suas câmeras já gravam. A GoDados lê.    │
└──────────────────────────────────────────────────────────────┘
```

- Logo dark + tagline.
- 3 colunas de links (âncoras internas + contato).
- Linha legal com copyright e tagline de assinatura.

---

## 5. Inventário de Componentes a Construir

| # | Componente | Descrição | Onde usa |
|---|-----------|-----------|----------|
| C1 | `Navbar` | Sticky, blur, dark, drawer mobile | [0] |
| C2 | `HeroSection` | Headline 2-linhas + subhead + duplo CTA + trust strip | [1] |
| C3 | `CameraGridMock` | Grid 2x2 de feeds simulados com mira/timestamp + status pill | [1] |
| C4 | `StatusPill` | Badge verde/âmbar/vermelho com ícone (✓ ! ✗) | [1][4][5] |
| C5 | `QuestionCard` | Card escuro com "?" cyan + pergunta-objeção | [2] |
| C6 | `StepFlow` | 3 passos numerados com linha conectora (horizontal→vertical) | [3] |
| C7 | `IconBadge` | Círculo cyan/15% opacidade com ícone de linha | [3] |
| C8 | `UseCaseTabs` | Tabs com troca de painel (vanilla JS) | [4] |
| C9 | `ChecklistRow` | Linha "item + StatusPill" | [4] |
| C10 | `KpiCard` | Número grande cyan + label uppercase | [5] |
| C11 | `BeforeAfter` | 2 colunas comparativas (✗ vermelho / ✓ verde) | [5] |
| C12 | `Accordion` | FAQ expansível, 1 aberto por vez (vanilla JS) | [6] |
| C13 | `CtaBanner` | Faixa com gradiente + duplo CTA + microcopy | [7] |
| C14 | `Footer` | Logo + colunas de links + linha legal | [8] |
| C15 | `Logo` (SVG inline) | Variantes dark/full (do brand-identity) | [0][8] |

### Especificação de tokens dos componentes-chave

**C4 — StatusPill**
```
Conforme:      bg-status-ok/15   text-status-ok    ícone ✓  "Conforme"
Atenção:       bg-status-warn/15 text-status-warn  ícone !  "Atenção"
Fora do padrão:bg-status-alert/15 text-status-alert ícone ✗  "Fora do padrão"
formato: inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
```

**C10 — KpiCard**
```
número:  text-5xl md:text-6xl font-extrabold text-cyan-elec tracking-tightest
label:   text-xs font-semibold uppercase tracking-[0.08em] text-slate-400
card:    rounded-2xl border border-white/10 bg-navy-mid/40 p-6
```

**C13 — CtaBanner**
```
fundo:   bg-gradient-to-br from-navy-deep via-navy-mid to-cyan-elec
botão 1: bg-white text-navy-deep (alto contraste sobre gradiente)
botão 2: border border-white/40 text-white (ghost)
```

---

## 6. Responsividade — Breakpoints

| Breakpoint | Largura | Estratégia (mobile-first) |
|------------|---------|---------------------------|
| Base (mobile) | < 640px | 1 coluna, H1 40px, nav vira hambúrguer, StepFlow vertical, KPIs 2x2, CameraGridMock 1 col |
| `sm` | ≥ 640px | KPIs 2x2 mantém, cards de problema 1→2 col |
| `md` (tablet) | ≥ 768px | Hero 2 colunas (texto+mock), QuestionCards 3 col, StepFlow horizontal |
| `lg` (desktop) | ≥ 1024px | H1 72px, container max 1200px, BeforeAfter 2 col lado a lado, tabs em linha |
| `xl` | ≥ 1280px | Espaçamentos `py-28`, respiro máximo |

**Regras mobile-first específicas:**
- Hero: no mobile, texto **acima** do CameraGridMock (não lado a lado).
- CTAs no mobile: empilhados full-width (`w-full`), com no mínimo 44x44px de alvo de toque.
- Nav drawer: full-screen overlay navy, links grandes (`text-2xl`), fecha ao clicar âncora.
- UseCaseTabs: no mobile viram scroll horizontal de chips, ou stacked accordion como fallback.
- Tipografia fluida opcional: `clamp(2.5rem, 6vw, 4.5rem)` para o H1.

---

## 7. Micro-interações & Animações (CSS-only + IO mínimo)

| Elemento | Interação | Implementação |
|----------|-----------|---------------|
| Links nav | Underline cyan cresce da esquerda no hover | `::after` width 0→100% `transition` 200ms |
| Botões CTA | Lift sutil + sombra cyan | `hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-elec/30 transition` |
| KpiCard | Borda cyan acende no hover | `hover:border-cyan-elec/40 transition-colors` |
| CameraGridMock | Status pills "piscam" alternando (sensação de live) | `@keyframes pulse-status` em loop lento (3s), `prefers-reduced-motion` desliga |
| StepFlow linha | Linha conectora "desenha" ao entrar na viewport | IntersectionObserver adiciona classe → `scaleX` 0→1 |
| Seções | Fade-up suave ao entrar (opacity+translateY) | IO adiciona `.in-view`; `transition` 500ms; só 1x |
| Accordion | Expand/collapse suave | `grid-template-rows: 0fr → 1fr` transition (técnica sem JS de altura) |
| Tabs | Indicador cyan desliza para a aba ativa | `transition transform` na barra inferior |
| Hero entrada | Stagger: label → H1 → subhead → CTAs (delays escalonados) | classes com `animation-delay` 0/100/200/300ms |

**Regra de acessibilidade de movimento:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## 8. Acessibilidade (WCAG 2.1 AA — baseline)

### Contraste verificado (sobre os fundos do brand)
| Combinação | Ratio aprox. | Status |
|------------|--------------|--------|
| Branco `#fff` sobre Navy Deep `#0f1f35` | ~16:1 | ✅ AAA |
| Slate-300 sobre Navy Deep | ~9:1 | ✅ AAA |
| Cyan `#06b6d4` sobre Navy Deep (texto link) | ~5.4:1 | ✅ AA (≥18px / não-corpo) — para corpo, usar cyan claro `#22d3ee` |
| Ink-600 `#475569` sobre Branco | ~7.5:1 | ✅ AAA |
| Verde `#10b981` sobre Navy Deep | ~5.1:1 | ✅ AA |
| Âmbar `#f59e0b` sobre Branco | ~2.1:1 | ⚠️ **NÃO** usar âmbar como texto sobre branco; usar como ícone/borda + texto ink |
| Vermelho `#ef4444` sobre Navy Deep | ~4.3:1 | ⚠️ Limítrofe — usar `#f87171` (red-400) para texto sobre dark |

> **Regra:** status colors comunicam por **ícone + texto + cor** (nunca cor sozinha — daltonismo). Os ícones ✓ ! ✗ são portadores semânticos primários.

### Semântica HTML
- Estrutura: um único `<h1>` (Hero). H2 por seção, H3 dentro. Sem pular níveis.
- `<header>`, `<nav>`, `<main>`, `<section aria-labelledby="...">`, `<footer>`.
- Skip link: `<a href="#conteudo" class="sr-only focus:not-sr-only">Pular para o conteúdo</a>`.
- Cada `<section>` com `id` (âncora) e `aria-labelledby` apontando ao seu heading.

### Interatividade acessível
- Tabs (C8): `role="tablist"` / `role="tab"` / `aria-selected` / `role="tabpanel"`; navegável por setas do teclado.
- Accordion (C12): `<button aria-expanded>` controlando `aria-controls`; expansível por Enter/Espaço.
- Nav drawer: `aria-expanded` no botão hambúrguer; foco preso no drawer aberto; `Esc` fecha.
- CTAs: links/botões reais (`<a>`/`<button>`), nunca `<div onclick>`. Alvo ≥ 44px.
- Foco visível: `focus-visible:ring-2 ring-cyan-elec ring-offset-2 ring-offset-navy-deep` global.

### Imagens / SVG
- Logo SVG: `role="img"` + `<title>GoDados.cam</title>`.
- CameraGridMock decorativo: `aria-hidden="true"` (não é conteúdo real).
- Ícones funcionais: `aria-label` ou texto adjacente (os StatusPill já têm texto).

### Idioma & metadados
- `<html lang="pt-BR">`.
- `<title>GoDados.cam — Inteligência Operacional do Mundo Físico</title>`.
- Meta description, Open Graph (og:title, og:description, og:image) para compartilhamento B2B.
- `<meta name="viewport" content="width=device-width, initial-scale=1">`.

---

## 9. Performance (< 2s load)

- **Tailwind via CDN Play** é aceitável para o brand site estático; para produção real, recomenda-se build CSS purgado (nota de tech-debt — não bloqueante para v1).
- Fonte: `Geist`/`Inter` via Google Fonts com `&display=swap` + `<link rel="preconnect">`. Carregar **apenas** os pesos usados (400/600/700/800).
- Sem imagens pesadas: CameraGridMock é **SVG/CSS puro**, não fotos. Logo é SVG inline (zero request).
- JS: < 3KB, vanilla, no final do `<body>`, sem libs. Só tabs, accordion, drawer e IntersectionObserver.
- `loading="lazy"` em qualquer mídia abaixo da dobra (se vier a existir).
- Sem web fonts bloqueantes: usar `font-display: swap` e fallback `system-ui`.

---

## 10. Estrutura de Arquivos sugerida (`app/brand/`)

```
app/brand/
├── index.html          # single-page completa (semântica + Tailwind classes)
├── styles.css          # @keyframes + overrides que o CDN não cobre
├── main.js             # tabs, accordion, drawer, IntersectionObserver (< 3KB)
├── assets/
│   └── og-image.png    # 1200x630 para social share (a produzir)
├── brand-identity.md   # (existente — fonte de verdade visual)
└── ux-spec.md          # este documento
```

---

## 11. Checklist de Aceite (Definition of Done do site)

- [ ] Reconhecimento em 5s: Hero comunica "lê câmeras existentes → vira KPI" sem rolar.
- [ ] "Câmeras que você já tem" aparece em ≥ 3 pontos do scroll.
- [ ] Todas as 8 seções implementadas com a copy real deste doc.
- [ ] Status colors usam ícone+texto+cor (nunca cor isolada).
- [ ] Responsivo validado em 360px / 768px / 1280px.
- [ ] Contraste AA conferido (atenção às exceções âmbar/vermelho da seção 8).
- [ ] Teclado: tabs, accordion e drawer 100% navegáveis; foco visível.
- [ ] `prefers-reduced-motion` desliga animações.
- [ ] CTAs apontam para WhatsApp e e-mail reais (substituir placeholders).
- [ ] Lighthouse: Performance ≥ 90, Acessibilidade ≥ 95, load < 2s.
- [ ] Sem buzzword da lista anti-padrão do brand voice.

---

*Especificação UX/UI GoDados.cam | @ux-design-expert (Uma) | 2026-06-11 | Pronta para handoff a @dev*
