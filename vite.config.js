import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['react-pdf']
  },
  define: {
    global: 'globalThis'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['react-pdf']
        }
      }
    },
    // Improve PDF worker handling
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  }
})
