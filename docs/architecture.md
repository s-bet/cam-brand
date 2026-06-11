# Arquitetura Técnica — GoDados.cam Brand Website

**Autor:** Aria (@architect) — AIOX
**Data:** 2026-06-11
**Status:** APROVADO PARA IMPLEMENTAÇÃO
**Squad alvo:** @dev (Dex)
**Repositório de deploy:** https://github.com/s-bet/cam-brand.git (GitHub Pages)
**Pasta de desenvolvimento:** `c:\Projetos\godados.cam\app\brand\`

---

## 0. TL;DR (para o @dev começar agora)

> **Stack:** HTML5 semântico + TailwindCSS via **Tailwind CLI standalone (build local de CSS estático)**, com fallback de CDN documentado. JS vanilla mínimo. Zero framework.
>
> **Por quê:** o site é estático, B2B, performance-crítico. Não há estado de aplicação, nem roteamento, nem dados dinâmicos. Next.js/Astro adicionam toolchain, node_modules e build obrigatório sem entregar valor proporcional aqui. HTML + Tailwind entrega o visual da brand identity (que JÁ está em hex/escala Tailwind) com o menor custo de implementação e o maior controle de performance.
>
> **Deploy:** push da pasta buildada para `cam-brand` → GitHub Pages serve `index.html` na raiz. Sem CI obrigatório (mas há um workflow opcional recomendado).
>
> **Regra de ouro:** o `index.html` final precisa abrir direto no navegador (file://) e renderizar corretamente. O build apenas gera o CSS otimizado — nunca é pré-requisito para o HTML funcionar.

---

## 1. Decisão de Stack

### 1.1 Opções avaliadas (A/B/C com trade-offs explícitos)

| Critério | **A) HTML + Tailwind CLI** ⭐ | B) HTML + Tailwind CDN puro | C) Next.js static export | D) Astro |
|---|---|---|---|---|
| Deploy GitHub Pages | Trivial (arquivos prontos) | Trivial | Requer `output: export` + `basePath` + `.nojekyll` | Requer build + adapter static |
| Build step obrigatório | Não (CSS pré-gerado, HTML serve direto) | Não | **Sim** (`next build`) | **Sim** (`astro build`) |
| Performance (load) | **Excelente** — CSS purgado ~10-15KB | Ruim — runtime JIT ~3MB+ baixado no cliente | Boa, mas hidratação + chunks JS desnecessários | Excelente |
| Velocidade de implementação @dev | **Alta** — um HTML, um comando de build | Altíssima, mas penaliza perf | Média — estrutura React, componentização | Média — sintaxe Astro a aprender |
| Capacidade de evoluir | Boa (componentizar depois com includes/Astro) | Limitada | Alta | Alta |
| Dependências/node_modules | Mínimas (1 binário CLI) | Zero | Pesado | Médio |
| Risco de credibilidade B2B | Baixo | **Alto** (CDN JIT é lento + warning em console) | Baixo | Baixo |

### 1.2 Decisão

**Escolha: Opção A — HTML5 semântico + TailwindCSS via CLI standalone.**

**[AUTO-DECISION]** Stack do brand site → **HTML + Tailwind CLI** (reason: site 100% estático sem estado/roteamento; Next.js e Astro impõem build obrigatório e toolchain sem entregar valor proporcional; Tailwind CDN puro é proibido em produção pela penalidade de performance — o JIT runtime baixa ~3MB e degrada o load, fatal para credibilidade B2B. A brand identity já está expressa em tokens Tailwind, o que torna o Tailwind o ajuste de menor atrito).

### 1.3 Por que NÃO Tailwind CDN puro em produção

A tentação é usar `<script src="cdn.tailwindcss.com">` e zero build. **Rejeitado para produção** porque:
- O CDN do Tailwind é um compilador JIT que roda **no navegador do visitante** — baixa o engine inteiro (~3MB) e compila as classes em runtime. Isso adiciona centenas de ms a segundos no first paint.
- Emite um warning no console: *"cdn.tailwindcss.com should not be used in production"* — um Diretor de Operações técnico que abrir o DevTools verá isso. Risco direto de credibilidade.

**Onde o CDN É aceitável:** apenas durante prototipagem rápida local, antes de configurar o CLI. Documentado na seção 8 como fallback.

### 1.4 Por que NÃO Next.js / Astro (agora)

- Não há roteamento (página única ou poucas seções âncora).
- Não há componentes com estado, data fetching, nem ilhas interativas complexas.
- GitHub Pages com Next export exige `basePath`, `assetPrefix`, `.nojekyll` e cuidado com paths — atrito real para um site de 1 página.
- **Caminho de evolução preservado:** se o site crescer (blog, múltiplas páginas, i18n), migrar para **Astro** é o upgrade natural — ele consome HTML/Tailwind quase sem reescrita. Documentado na seção 11.

---

## 2. Estrutura de Arquivos Definitiva

```
app/brand/
├── index.html                  # Página única — ponto de entrada (abre direto via file://)
├── architecture.md             # ESTE documento
├── brand-identity.md           # Fonte da verdade visual (já existe)
├── README.md                   # Como rodar/buildar/deployar (@dev cria)
│
├── src/
│   └── input.css               # Entrada do Tailwind (@tailwind directives + @layer custom)
│
├── tailwind.config.js          # Tokens da brand (cores, fontes) mapeados aqui
├── package.json                # Scripts de build (opcional — só se usar npx tailwindcss)
├── .nojekyll                   # Impede GitHub Pages de processar com Jekyll
│
├── assets/
│   ├── css/
│   │   └── styles.css          # CSS BUILDADO (gerado pelo Tailwind — versionado p/ deploy)
│   ├── js/
│   │   └── main.js             # JS vanilla: smooth scroll, mobile menu, analytics init
│   ├── images/
│   │   ├── og-image.png        # Open Graph (1200x630) — gerar
│   │   ├── favicon.svg         # Favicon vetorial (reaproveita o ícone do logo)
│   │   └── favicon.ico         # Fallback favicon
│   └── fonts/                  # (opcional) Geist self-hosted — ver seção 4
│       ├── Geist-Regular.woff2
│       ├── Geist-SemiBold.woff2
│       └── Geist-Bold.woff2
│
└── .github/
    └── workflows/
        └── deploy.yml          # (opcional, recomendado) build + deploy automático
```

### 2.1 Notas sobre a estrutura

- **`index.html` na raiz** é obrigatório: GitHub Pages serve a raiz do repositório como root do site. Quando o conteúdo for empurrado para `cam-brand`, o `index.html` precisa estar na raiz do repo.
- **`assets/css/styles.css` é versionado** (não está em `.gitignore`). Esse é o coração da estratégia "sem build obrigatório": o CSS já vem pronto. O build só re-gera quando o HTML muda.
- **Paths relativos** em todo o HTML (`./assets/...`, não `/assets/...`). Isso garante que o site funcione tanto em `file://` quanto em `https://s-bet.github.io/cam-brand/` (subpath de Pages) quanto em domínio custom `godados.cam`.
- **`.nojekyll`** evita que o GitHub Pages (que usa Jekyll por padrão) ignore arquivos/pastas que começam com `_` e adicione latência de processamento.

---

## 3. Estratégia de Build & Deploy

### 3.1 Filosofia: build opcional, HTML soberano

O `index.html` **referencia um CSS estático já buildado** (`assets/css/styles.css`). Consequências:
- Abrir `index.html` direto no navegador → funciona 100%.
- Não há passo de build entre "editar HTML" e "ver no navegador" — só há build quando você quer **re-otimizar/purgar** o CSS após adicionar classes Tailwind novas.

### 3.2 Build do CSS (quando necessário)

**Opção 1 — Tailwind CLI standalone (recomendado, zero node_modules):**
Baixar o binário standalone do Tailwind (release do GitHub `tailwindlabs/tailwindcss`) e rodar:
```bash
# Watch durante desenvolvimento
./tailwindcss -i ./src/input.css -o ./assets/css/styles.css --watch

# Build de produção (minificado + purgado)
./tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify
```

**Opção 2 — via npx (se o @dev preferir Node):**
```json
// package.json
{
  "scripts": {
    "dev": "tailwindcss -i ./src/input.css -o ./assets/css/styles.css --watch",
    "build": "tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify"
  }
}
```
```bash
npm install -D tailwindcss && npm run build
```

**`tailwind.config.js`** deve declarar `content: ['./index.html', './assets/js/**/*.js']` para o purge funcionar e o CSS final ficar ~10-15KB.

### 3.3 Deploy no GitHub Pages

**Repositório de produção:** `https://github.com/s-bet/cam-brand.git`

**Fluxo manual (mais simples — recomendado para v1):**
1. Buildar o CSS de produção (`--minify`).
2. Copiar o conteúdo de `app/brand/` para o repo `cam-brand` (ou usar `cam-brand` como remote dessa pasta).
3. `git add . && git commit -m "feat: brand site v1"` → **push é exclusivo do @devops (Gage)**.
4. No GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
5. Garantir `.nojekyll` presente na raiz.
6. (Domínio custom) Adicionar arquivo `CNAME` com `godados.cam` e configurar DNS (CNAME → `s-bet.github.io`).

**Fluxo automático (opcional, recomendado pós-v1) — `.github/workflows/deploy.yml`:**
- Trigger em push para `main`.
- Step: baixar Tailwind CLI → buildar CSS → publicar artifact via `actions/deploy-pages`.
- Vantagem: ninguém esquece de buildar o CSS; o source não precisa versionar o CSS gerado.

> **Trade-off de versionar o CSS:** versionar `styles.css` permite "sem build obrigatório" e deploy manual trivial, ao custo de um arquivo gerado no git. O workflow automático elimina esse arquivo do source mas adiciona dependência de CI. **Recomendação:** v1 versiona o CSS (simplicidade); migrar para CI quando o time estabilizar.

> **Boundary AIOX:** operações de `git push`, `gh pr create` e configuração de Pages/CI são **exclusivas do @devops (Gage)**. @dev implementa e faz commits locais; @architect (eu) apenas projeta. A configuração de Settings → Pages e DNS deve ser delegada ao @devops.

---

## 4. Estratégia de Performance (< 2s load sem CDN pago)

Meta: **First Contentful Paint < 1.5s, Total Load < 2s** em 4G, sem CDN pago (GitHub Pages já serve via Fastly com HTTP/2 + cache global — suficiente).

### 4.1 Fontes (maior risco de performance)

A brand pede **Geist** (ou Inter como fallback). Estratégia:

**[AUTO-DECISION]** Carregamento de fontes → **self-host Geist em WOFF2 + `font-display: swap` + preload das 2-3 pesos usados** (reason: Google Fonts via CDN adiciona conexão a terceiro e uma requisição bloqueante de CSS; self-hosting WOFF2 elimina o handshake externo, dá controle de cache e evita FOIT. Inter fica como fallback de sistema na font stack).

- Subset: incluir apenas Latin (suficiente para PT-BR).
- Pesos: limitar a **3 arquivos** (Regular 400, SemiBold 600, Bold 700/800). Headings usam 700/800.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` para os pesos above-the-fold (Bold do H1).
- Font stack CSS: `'Geist', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` — o `system-ui` garante texto instantâneo mesmo se a fonte falhar.
- **Fallback aceitável:** se self-hosting atrasar a entrega, usar Google Fonts para Inter com `&display=swap` e `preconnect`. Documentar a dívida.

### 4.2 CSS

- Tailwind purgado → **~10-15KB minificado**. Inline crítico não é necessário nesse tamanho, mas pode-se inline o CSS above-the-fold se o budget apertar.
- Um único `styles.css`, sem frameworks CSS adicionais.

### 4.3 Imagens

- **Logo e ícones: SVG inline** (a brand identity já fornece o SVG do logo) — zero requisição, escala perfeita, sem layout shift.
- Fotos/mockups (se houver): formato **WebP** (ou AVIF com fallback), `loading="lazy"` em tudo below-the-fold, `width`/`height` explícitos para evitar CLS.
- OG image (`og-image.png`) é só para compartilhamento — não bloqueia render.

### 4.4 JavaScript

- **Vanilla JS, sem framework.** Funções: smooth scroll para âncoras, toggle de menu mobile, inicialização de analytics.
- `<script defer>` (não bloqueia parsing).
- Total esperado: < 5KB.

### 4.5 Entrega / Cache

- GitHub Pages serve com HTTP/2 e CDN Fastly embutido — sem custo.
- Assets versionados se beneficiam do cache do Pages.

### 4.6 Checklist de Performance

- [ ] CSS Tailwind buildado com `--minify` e `content` configurado (purge ativo)
- [ ] CSS final < 20KB
- [ ] Fontes self-hosted WOFF2, máximo 3 pesos, subset Latin
- [ ] `font-display: swap` em todas as @font-face
- [ ] `<link rel="preload">` para a fonte do H1
- [ ] Logo e ícones como SVG inline (zero requests)
- [ ] Imagens em WebP/AVIF com `loading="lazy"` below-the-fold
- [ ] `width`/`height` explícitos em toda `<img>` (evita CLS)
- [ ] `<script defer>` em todo JS
- [ ] Paths relativos (`./assets/...`) para funcionar em subpath e domínio custom
- [ ] Lighthouse: Performance >= 95, sem CLS, sem render-blocking de terceiros
- [ ] Testar load real em throttle 4G (DevTools)

---

## 5. SEO Básico (B2B)

O público é Diretor de Operações — busca provavelmente vem de pesquisa direta de marca, LinkedIn e referência. SEO foca em **credibilidade e compartilhamento social**, não em ranking de cauda longa.

### 5.1 Meta tags essenciais (`<head>`)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GoDados.cam — Inteligência Operacional do Mundo Físico</title>
<meta name="description" content="A GoDados.cam transforma as câmeras de segurança que você já tem em sensores de inteligência operacional. KPIs de conformidade em tempo real, sem hardware novo.">
<link rel="canonical" href="https://godados.cam/">
<meta name="robots" content="index, follow">
<html lang="pt-BR">
```

> **Copy SEO segue o brand voice:** números específicos antes de adjetivos, "câmeras que você já tem", zero buzzwords ("disruptivo", "IA avançada" — proibidos pela brand identity §5).

### 5.2 Open Graph (compartilhamento LinkedIn/WhatsApp — crítico para B2B)

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://godados.cam/">
<meta property="og:title" content="GoDados.cam — Inteligência Operacional do Mundo Físico">
<meta property="og:description" content="Suas câmeras já gravam. A GoDados lê. KPIs de conformidade operacional em tempo real, sem hardware novo.">
<meta property="og:image" content="https://godados.cam/assets/images/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="GoDados.cam">
```

### 5.3 Twitter/X Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="GoDados.cam — Inteligência Operacional do Mundo Físico">
<meta name="twitter:description" content="Suas câmeras já gravam. A GoDados lê.">
<meta name="twitter:image" content="https://godados.cam/assets/images/og-image.png">
```

### 5.4 Schema.org (JSON-LD) — autoridade B2B

Usar `Organization` + `Product`/`SoftwareApplication`. Vai num `<script type="application/ld+json">`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GoDados.cam",
  "url": "https://godados.cam",
  "logo": "https://godados.cam/assets/images/favicon.svg",
  "description": "Camada de software que lê as câmeras de segurança existentes para entregar KPIs de conformidade operacional em tempo real.",
  "sameAs": ["https://www.linkedin.com/company/godados"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "contato@godados.cam",
    "availableLanguage": ["Portuguese"]
  }
}
```

Opcionalmente adicionar um bloco `SoftwareApplication` com `applicationCategory: "BusinessApplication"`.

### 5.5 Infra de SEO

- `robots.txt` na raiz (permitir tudo + apontar sitemap).
- `sitemap.xml` simples (página única, mas sinaliza profissionalismo).
- `lang="pt-BR"` no `<html>`.
- Estrutura semântica: um único `<h1>` (o onliness/tagline), hierarquia correta de `<h2>`/`<h3>`, landmarks `<header>`/`<main>`/`<section>`/`<footer>`.

### 5.6 Checklist de SEO

- [ ] `<title>` único e descritivo (< 60 chars)
- [ ] `<meta name="description">` (~155 chars, com brand voice)
- [ ] `lang="pt-BR"` no `<html>`
- [ ] `<link rel="canonical">`
- [ ] Open Graph completo (title, description, image 1200x630, url, locale)
- [ ] Twitter Card
- [ ] JSON-LD Organization (+ SoftwareApplication opcional)
- [ ] `robots.txt` + `sitemap.xml`
- [ ] Um único `<h1>`, hierarquia de headings correta
- [ ] Landmarks HTML5 semânticos
- [ ] `alt` descritivo em todas as imagens
- [ ] og-image gerada (1200x630) com logo + tagline

---

## 6. Analytics (sem backend)

**[AUTO-DECISION]** Analytics → **Google Analytics 4 via gtag.js (CDN do Google), carregado `defer` e inicializado no `main.js`** (reason: sem backend, GA4 client-side é o padrão; é gratuito, cobre o funil B2B de leads, e o público corporativo aceita. Carregar com `defer`/após interação para não penalizar o load. Considerar consent banner se houver tráfego UE).

### 6.1 Implementação

```html
<!-- GA4 — carregado defer para não bloquear o First Paint -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { 'anonymize_ip': true });
</script>
```

- `G-XXXXXXXXXX` → placeholder; o ID real entra na implementação (idealmente externalizado, ver 6.3).
- `anonymize_ip: true` por privacidade.

### 6.2 Eventos de conversão (geração de leads)

Como o objetivo é **lead via email/WhatsApp**, instrumentar:
- `click` no botão/link de **email** → `gtag('event', 'generate_lead', {method: 'email'})`
- `click` no botão/link de **WhatsApp** → `gtag('event', 'generate_lead', {method: 'whatsapp'})`
- Scroll depth (25/50/75/100%) opcional para medir engajamento da página.

Esses listeners vivem no `main.js`.

### 6.3 Externalização de config (princípio Architect-First)

O `G-XXXXXXXXXX`, o número de WhatsApp e o email de contato são **valores mutáveis** — não hardcodar espalhado. Centralizar no topo do `main.js`:

```js
// assets/js/main.js
const CONFIG = {
  GA4_ID: 'G-XXXXXXXXXX',
  CONTACT_EMAIL: 'contato@godados.cam',
  WHATSAPP_NUMBER: '5511999999999', // formato internacional, sem símbolos
};
```

### 6.4 Privacidade

- GA4 já é menos invasivo que UA. Com `anonymize_ip`, atende a maioria dos casos BR.
- **Se houver tráfego UE/LGPD rígida:** adicionar consent banner leve (vanilla, sem CDN pesado) que só dispara o `gtag config` após aceite. Documentado como item de evolução, não bloqueante para v1 BR.

---

## 7. Dependências Externas (resumo)

| Dependência | Como entra | Bloqueante? | Mitigação |
|---|---|---|---|
| TailwindCSS | CLI standalone (build) — **não** no runtime do cliente | Não (CSS já buildado) | Binário standalone, sem node_modules |
| Geist (fonte) | **Self-hosted** WOFF2 em `assets/fonts/` | Não (`font-display: swap`) | Fallback Inter → system-ui |
| Inter (fallback) | system-ui ou Google Fonts (último recurso) | Não | É fallback |
| Google Analytics 4 | `gtag.js` via CDN Google, `async`/`defer` | Não | Carrega após paint |
| GitHub Pages | Hospedagem (Fastly CDN embutido) | — | Gratuito, HTTP/2 |

**Princípio:** nenhuma dependência de terceiro pode bloquear o First Paint. Tudo crítico (CSS, fontes above-the-fold, logo SVG) é self-contained.

---

## 8. Fallback de Prototipagem (Tailwind CDN — só local)

Para o @dev validar o layout **antes** de configurar o CLI, é aceitável usar temporariamente:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = { theme: { extend: { /* tokens da brand */ } } }</script>
```
**Regra:** isso é **proibido no commit de produção**. Substituir pelo `<link rel="stylesheet" href="./assets/css/styles.css">` antes do deploy. Documentar no README.

---

## 9. Mapeamento da Brand Identity → Tailwind Config

A brand identity já entrega tokens prontos. O `tailwind.config.js` deve mapeá-los (extend):

```js
// tailwind.config.js (extrato — @dev completa)
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0f1f35', medium: '#1a3358' },
        cyan: { DEFAULT: '#06b6d4' },
        action: '#3b82f6',
        status: { ok: '#10b981', warn: '#f59e0b', alert: '#ef4444' },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.04em' },
    },
  },
};
```

> A escala de cinzas (`gray-50/100/600/900`) e os azuis já coincidem com o Tailwind default — reaproveitar, não redefinir.

---

## 10. Acessibilidade (mínimo B2B profissional)

- Contraste WCAG AA: navy `#0f1f35` sobre branco e branco sobre navy passam folgado; validar texto cyan sobre branco (pode falhar em corpo pequeno — usar cyan só em destaques grandes/links sublinhados).
- Foco visível em links e botões (não remover outline sem substituto).
- `alt` em imagens, `aria-label` no toggle de menu mobile e nos CTAs de ícone.
- Navegação por teclado funcional.
- `prefers-reduced-motion` respeitado em qualquer animação de scroll.

---

## 11. Caminho de Evolução (preservação de capacidade)

Decisões tomadas para **não fechar portas**:

| Necessidade futura | Caminho de upgrade |
|---|---|
| Múltiplas páginas / blog | Migrar para **Astro** — consome o HTML+Tailwind atual com reescrita mínima |
| Formulário de lead com backend | Adicionar endpoint serverless (Cloudflare Workers / Vercel Functions) ou form service (Formspree) — o front não muda |
| i18n (EN/ES) | Astro i18n, ou duplicar HTML por locale na fase estática |
| CMS para a equipe editar | Astro + headless CMS, ou Markdown + build |
| A/B testing | GA4 + Google Optimize sucessor, ou flags no `main.js` |

A escolha de HTML+Tailwind **não cria dívida arquitetural** — é o substrato que Astro consome nativamente.

---

## 12. Handoff para @dev (Dex)

**Ordem de implementação sugerida:**
1. Criar `tailwind.config.js` + `src/input.css` com os tokens da brand (seção 9).
2. Montar `index.html` com estrutura semântica + `<head>` completo (SEO seção 5).
3. Prototipar layout (pode usar CDN local temporário — seção 8).
4. Configurar Tailwind CLI e buildar `assets/css/styles.css` (seção 3.2).
5. Self-host fontes Geist WOFF2 + preload (seção 4.1).
6. Implementar `main.js` (CONFIG, smooth scroll, menu mobile, GA4 + eventos de lead).
7. Gerar `og-image.png` (1200x630), favicon SVG, `robots.txt`, `sitemap.xml`, `.nojekyll`.
8. Rodar Lighthouse, validar checklists de performance (4.6) e SEO (5.6).
9. Escrever `README.md` (como buildar/deployar).
10. **Delegar a @devops:** push para `cam-brand`, configuração de GitHub Pages, DNS do domínio custom.

**Restrições inegociáveis (Architect-First):**
- O `index.html` DEVE abrir e renderizar via `file://` (CSS buildado, não CDN runtime).
- Valores mutáveis (GA4 ID, WhatsApp, email) externalizados no `CONFIG` do `main.js` — nada hardcodado espalhado.
- Paths relativos sempre (`./assets/...`).
- Nenhuma dependência de terceiro bloqueia o First Paint.
- Brand voice obedecida na copy (sem buzzwords, números antes de adjetivos).

---

## 13. Resumo de Decisões (AUTO-DECISIONS)

| # | Decisão | Escolha | Razão |
|---|---|---|---|
| 1 | Stack | HTML + Tailwind CLI | Estático sem estado; perf-crítico; brand já em tokens Tailwind; build não-obrigatório |
| 2 | Tailwind delivery | CLI standalone (CSS pré-buildado) | CDN JIT runtime degrada load e emite warning em prod (risco de credibilidade B2B) |
| 3 | Fontes | Geist self-hosted WOFF2 + swap + preload | Elimina terceiro bloqueante; controle de cache; sem FOIT |
| 4 | Analytics | GA4 gtag.js `defer` + eventos `generate_lead` | Sem backend; gratuito; mede funil de lead; não bloqueia paint |
| 5 | Deploy | GitHub Pages, CSS versionado (v1), CI opcional depois | Simplicidade no v1; migrar para CI ao estabilizar |
| 6 | Evolução | Astro como upgrade natural | Consome HTML+Tailwind sem reescrita — zero dívida arquitetural |

---

*Arquitetura GoDados.cam Brand Website | @architect (Aria) | 2026-06-11*
*"Arquitetura perfeita, execução pragmática, qualidade garantida por testes."*

— Aria, arquitetando o futuro 🏗️
