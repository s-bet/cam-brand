# GoDados.cam — Brand Website

Single-page brand website estático. Categoria: **Inteligência Operacional do Mundo Físico**.

> Suas câmeras já gravam. A GoDados lê.

## Stack

- **HTML5 semântico** — `index.html` (single-page, 8 seções).
- **TailwindCSS** — via CDN com `tailwind.config` inline (entrega atual). Produção migra para Tailwind CLI standalone (ver abaixo).
- **JS vanilla** — `main.js` (~4KB): tabs, accordion, drawer mobile, IntersectionObserver, eventos GA4. Zero dependências.
- **CSS custom** — `styles.css`: keyframes, status pills, mock de câmera, accordion, `prefers-reduced-motion`.
- **Fontes** — Geist + Inter via Google Fonts (`display=swap`).

## Arquivos

```
app/brand/
├── index.html          # Página principal (abre direto via file://)
├── main.js             # Comportamento (defer)
├── styles.css          # Keyframes + overrides
├── tailwind.config.js  # Tokens da brand (fonte p/ build CLI de produção)
├── .nojekyll           # GitHub Pages sem processamento Jekyll
├── robots.txt          # Permite tudo + sitemap
├── sitemap.xml         # Sitemap single-page
└── README.md           # Este arquivo
```

## Rodar localmente

Abra `index.html` direto no navegador (`file://`). Funciona sem servidor.
Opcional, para servir via HTTP local:

```bash
# Python
python -m http.server 8000
# Node
npx serve .
```

Acesse `http://localhost:8000`.

## Configuração (valores mutáveis)

Centralizados no topo de `main.js` (objeto `CONFIG`):

| Chave | Descrição | Placeholder atual |
|-------|-----------|-------------------|
| `GA4_ID` | ID do Google Analytics 4 | `G-XXXXXXXXXX` |
| `WHATSAPP` | Número internacional, só dígitos | `5511999999999` |
| `EMAIL` | E-mail de contato | `contato@godados.cam` |

> **Antes do go-live:** substituir os 3 placeholders pelos canais reais. O GA4 (`gtag.js`) ainda não está incluído no `index.html` — adicionar o snippet quando o ID real existir (ver `architecture.md §6`). Os eventos `generate_lead` já estão instrumentados em `main.js` e disparam automaticamente quando `gtag` estiver presente.

## Build de produção (Tailwind CLI standalone)

A entrega atual usa o CDN do Tailwind (JIT no cliente). Para produção, gerar CSS purgado e trocar o `<script src="cdn.tailwindcss.com">` por um `<link rel="stylesheet">`:

```bash
# 1. Baixar o binário standalone (tailwindlabs/tailwindcss releases)
# 2. Criar src/input.css com:  @tailwind base; @tailwind components; @tailwind utilities;
# 3. Buildar minificado:
./tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify
```

`tailwind.config.js` já tem `content` e tokens configurados. Depois trocar no `<head>`:

```html
<!-- remover -->
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config = { ... }</script>
<!-- adicionar -->
<link rel="stylesheet" href="./assets/css/styles.css">
```

E manter o `<link rel="stylesheet" href="./styles.css">` (keyframes custom).

## Deploy (GitHub Pages)

Repositório de publicação: `https://github.com/s-bet/cam-brand.git`

1. `index.html` deve estar na **raiz** do repo de publicação.
2. Manter `.nojekyll` na raiz.
3. Settings → Pages → Deploy from branch → `main` / root.
4. Domínio custom: adicionar `CNAME` com `godados.cam` + DNS.

> **AIOX boundary:** `git push`, `gh pr create` e configuração de Pages/DNS são exclusivos do `@devops` (Gage). `@dev` implementa e faz commits locais.

## Acessibilidade

- `lang="pt-BR"`, skip link, landmarks semânticos, `<h1>` único.
- Tabs (`role="tablist"`, navegação por setas), accordion (`aria-expanded`), drawer (`aria-expanded` + `Esc` fecha).
- Status pills comunicam por ícone + texto + cor (nunca cor isolada).
- `focus-visible:ring` global; `prefers-reduced-motion` desliga animações.

## Checklist pré-go-live

- [ ] Substituir `GA4_ID`, `WHATSAPP`, `EMAIL` reais em `main.js`.
- [ ] Adicionar snippet `gtag.js` no `<head>` com o ID real.
- [ ] Gerar `assets/images/og-image.png` (1200×630) e favicon.
- [ ] Build de CSS purgado via Tailwind CLI; remover CDN.
- [ ] Rodar Lighthouse (Performance ≥ 90, Acessibilidade ≥ 95).
