import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/vortex-api': {
        target: 'https://vortex.worldofwarships.eu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vortex-api/, '/api'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/*.{test,spec}.ts'],
  },
})
