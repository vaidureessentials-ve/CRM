import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 🌏 Enable access via local IP: 192.168.1.27
    port: 5173,
  },
})
