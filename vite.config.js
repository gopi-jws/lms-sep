import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/lms-sep1/',
  plugins: [react()],
  css: {
    devSourcemap: true,
  },
})
