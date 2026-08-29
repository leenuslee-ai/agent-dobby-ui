import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/login': 'http://localhost:8800',
      '/whatnext': 'http://localhost:8800',
    },
  },
})
