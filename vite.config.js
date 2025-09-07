import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    host: true,
    // Add this to handle React Router routes in development
    historyApiFallback: true,
  },
  // Add this for production builds
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Ensure proper asset handling
    assetsDir: 'assets',
  },
  // Add preview configuration for production testing
  preview: {
    port: 3000,
    host: true,
    historyApiFallback: true,
  },
})
