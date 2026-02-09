import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bluffline.org',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  server: {
    port: 3000
  },
  vite: {
    server: {
      hmr: {
        path: '/vite-hmr/'
      }
    }
  }
});
