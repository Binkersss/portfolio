import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// replace `portfolio` with your actual repo name
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/', 
})