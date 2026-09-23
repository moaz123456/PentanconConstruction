import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// In development the browser calls "/api/..." and "/uploads/..." on the Vite server, and Vite forwards
// them to the real API. That avoids CORS problems while you work on the site locally.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET || 'https://pentacon-construction.runasp.net';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target, changeOrigin: true, secure: true },
        '/uploads': { target, changeOrigin: true, secure: true }
      }
    }
  };
});
