import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kuhakstudio.com',
  output: 'static',
  integrations: [react()],
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
});
