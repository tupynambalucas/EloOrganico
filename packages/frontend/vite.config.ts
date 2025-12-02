import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Em módulos ES (que o Vite usa), __dirname não existe globalmente.
// A implementação abaixo é a forma correta de recriá-lo em TS/ESM.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  const API_TARGET = env.VITE_API_URL || 'http://localhost:3000';

  console.log(`🚀 Vite Proxy target: ${API_TARGET}`);

  // --- Configuração do Proxy Centralizada ---
  // A tipagem é inferida automaticamente pelo defineConfig,
  // mas você pode ser explícito se quiser (ex: ProxyOptions)
  const proxyConfig = {
    '/api': {
      target: API_TARGET,
      changeOrigin: true,
      secure: false,
    },
  };

  return {
    root: 'src', 
    base: '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@js': path.resolve(__dirname, './src/js'),
        '@css': path.resolve(__dirname, './src/css'),
      },
    },

    // Servidor de Desenvolvimento
    server: {
      host: true, // Escuta em todos os IPs locais
      port: 5173,
      open: true,
      cors: true,
      proxy: proxyConfig, 
    },

    // Servidor de Preview da Build
    preview: {
      port: 4173,
      open: true,
      proxy: proxyConfig, 
    },

    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          // assetInfo é tipado automaticamente aqui
          assetFileNames: (assetInfo) => {
            // Verificação de segurança caso assetInfo.name seja undefined (raro, mas possível em TS estrito)
            const name = assetInfo.name || '';
            let extType = name.split('.').at(1) || 'unknown';
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },
  };
});