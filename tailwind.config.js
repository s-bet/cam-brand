/**
 * GoDados.cam — Tailwind config
 *
 * For the current delivery the site loads Tailwind via CDN with an inline
 * `tailwind.config` block in index.html. This file is the source of truth
 * for a production build with the Tailwind CLI standalone:
 *
 *   ./tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify
 *
 * Tokens mirror brand-identity.md and ux-spec.md.
 */
module.exports = {
  content: ['./index.html', './main.js'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0f1f35', deep: '#0f1f35', mid: '#1a3358' },
        cyan:    { DEFAULT: '#06b6d4', elec: '#06b6d4', light: '#22d3ee' },
        action:  { DEFAULT: '#3b82f6', blue: '#3b82f6' },
        status:  { ok: '#10b981', warn: '#f59e0b', alert: '#ef4444' },
        ink:     { 900: '#0f172a', 600: '#475569' },
        surface: { 50: '#f8fafc', 100: '#f1f5f9' },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter2: '-0.02em',
      },
      lineHeight: { body: '1.7' },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
