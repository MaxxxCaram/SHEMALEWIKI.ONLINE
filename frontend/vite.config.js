import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        // Hash por contenido: cada build genera un nombre UNICO.
        // Esto ROMPE el cache del edge de Vercel (el POP debe buscar el archivo nuevo).
        entryFileNames: 'assets/index-[hash].js',
        chunkFileNames: 'assets/chunk-[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
