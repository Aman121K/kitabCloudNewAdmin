import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Add this to handle React Router routes
    historyApiFallback: true,
  },
  // Add this for production builds
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
