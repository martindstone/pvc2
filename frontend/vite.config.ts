import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars for the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  // Backend base URL configured via dotenv (e.g., VITE_API_URL=http://localhost:8080)
  const target = env.VITE_API_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      // Proxy API requests in development to avoid CORS and keep a stable '/api' path in the app
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req) => {
              // Logs when proxying a request
              console.log(`[proxy] -> ${req.method} ${req.url} to ${target}`)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(`[proxy] <- ${req.method} ${req.url} ${proxyRes.statusCode}`)
            })
            proxy.on('error', (err, req) => {
              console.error(`[proxy] !! ${req.method} ${req.url}: ${err.message}`)
            })
          },
        },
        '/auth': {
          target,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req) => {
              console.log(`[proxy] -> ${req.method} ${req.url} to ${target}`)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(`[proxy] <- ${req.method} ${req.url} ${proxyRes.statusCode}`)
            })
            proxy.on('error', (err, req) => {
              console.error(`[proxy] !! ${req.method} ${req.url}: ${err.message}`)
            })
          },
        },
      },
    },
  }
})
