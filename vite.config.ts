import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Polyfill Node.js globals required by some Web3 packages
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Some Web3 libs need the 'process' global
      'process': 'process/browser',
    },
  },
  optimizeDeps: {
    include: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
  },
})
