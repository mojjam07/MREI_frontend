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
    include: ['pdfjs-dist']
  },
  define: {
    global: 'globalThis',
    __PDF_WORKER_CDN__: JSON.stringify(`https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    },
    // Improve PDF worker handling
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  }
});
