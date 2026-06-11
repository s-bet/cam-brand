# GoDados.cam — Brand Book

Guia oficial de identidade visual da GoDados.cam, publicado como site estático.

> "A GoDados.cam é a ÚNICA plataforma que transforma câmeras de segurança já instaladas em sensores de inteligência operacional."

## O que é este repositório

Brand book interativo — referência de identidade visual para designers, agências e parceiros. Documenta e demonstra os elementos da marca:

| Seção | Conteúdo |
|-------|----------|
| **Essência** | Onliness Statement, Brand Ladder, taglines, posicionamento |
| **Logo** | 3 variantes (full color / dark / mono), regras de uso, don'ts |
| **Cores** | 12 swatches clicáveis (copiam o hex), 4 grupos de paleta |
| **Tipografia** | Specimens em tamanho real, escala H1→Label |
| **Voz da Marca** | 5 adjetivos, tabela DOS vs. DON'TS |
| **Componentes** | StatusPills, botões, KPI card, mini-dashboard |
| **Aplicações** | Slide, business card, assinatura de email (CSS puro) |

## Site publicado

`https://brand.godados.cam/`

## Stack

- **HTML5 semântico** — `index.html`, autocontido, abre via `file://`
- **TailwindCSS** — CDN com `tailwind.config` inline
- **CSS custom** — `styles.css`: keyframes, swatches, animações de câmera
- **JS vanilla inline** — clipboard copy-to-clipboard nos hex codes
- **Fontes** — Geist + Inter via Google Fonts (`display=swap`)
- **Zero dependências** de backend ou build obrigatório

## Arquivos

```
app/brand/
├── index.html          # Brand book completo (853 linhas, 8 seções)
├── styles.css          # Keyframes + overrides (cam-scan, copied flash, etc.)
├── main.js             # JS auxiliar (tabs, accordion, drawer — legado landing)
├── tailwind.config.js  # Tokens da brand (fonte p/ build CLI futuro)
├── .nojekyll           # GitHub Pages sem Jekyll
├── robots.txt
├── sitemap.xml
├── brand-identity.md   # Fonte de verdade da identidade (input do brand book)
├── architecture.md     # Decisões técnicas
└── ux-spec.md          # Especificação UX/UI
```

## Rodar localmente

Abra `index.html` direto no navegador — funciona sem servidor.

```bash
# Opcional: servidor HTTP local
python -m http.server 8000
# ou
npx serve .
```

## Deploy (GitHub Pages)

Repositório: `https://github.com/s-bet/cam-brand.git`

1. `index.html` na raiz do repo
2. `.nojekyll` presente na raiz
3. Settings → Pages → Deploy from branch → `main` / root
4. Domínio custom: `CNAME` → `brand.godados.cam` ✅ (já configurado)

## Build de produção (opcional)

A entrega usa CDN do Tailwind. Para CSS purgado em produção:

```bash
./tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify
```

Trocar o `<script src="cdn.tailwindcss.com">` por `<link rel="stylesheet" href="./assets/css/styles.css">`.

## Checklist pré-distribuição

- [ ] Ativar GitHub Pages (Settings → Pages → `main` / root)
- [ ] Gerar `og-image.png` (1200×630) para compartilhamento social
- [ ] Atualizar `sitemap.xml` com URL real do domínio custom
- [ ] Alterar `<meta robots>` de `noindex` para `index, follow` se o brand book for público
- [ ] Build CSS purgado via Tailwind CLI; remover CDN
