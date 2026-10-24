import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward API calls to the Express server so the browser never needs
    // a hardcoded backend URL (and CORS isn't involved in development).
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
