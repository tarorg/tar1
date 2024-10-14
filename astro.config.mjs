// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    ssr: {
      noExternal: ['tinybase'],
    },
  },
  output: 'server',
  server: {
    cors: true,
  },
});
