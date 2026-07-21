// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const backendUrl = env.VITE_BACKEND_URL === '/api' 
    ? 'http://localhost:4000' 
    : env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  return {
    plugins: [react()],
    
    server: {
      port: 5173,
      host: true,
      
      // ✅ AJOUT : Désactiver complètement le HMR (solution de secours)
      // hmr: false,
      
      // Ou avec configuration complète
      hmr: {
        protocol: 'ws',
        host: '127.0.0.1',
        port: 5173,
      },
      
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('🔄 Proxy:', req.method, req.url, '→', proxyReq.path);
            });
            proxy.on('error', (err) => {
              console.log('❌ Proxy Error:', err);
            });
          }
        }
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          }
        }
      }
    },
    
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'ICERD'),
    }
  };
});