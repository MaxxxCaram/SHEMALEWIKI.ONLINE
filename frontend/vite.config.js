import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        // Hash fijo por contenido; cambia el nombre del archivo en cada build
        // para romper cualquier cache de navegador/CDN.
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
