// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.avantiperformance.com.br',
  devToolbar: { enabled: false },
  integrations: [react()],
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
