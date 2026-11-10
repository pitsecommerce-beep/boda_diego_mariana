import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// VITE_BASE lo calcula GitHub Actions (vacío con dominio propio, "/repo" sin él).
const base = (process.env.VITE_BASE ?? '').replace(/\/$/, '') + '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
})
