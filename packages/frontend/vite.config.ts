import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(), 
      tsconfigPaths(),
      svgr({
        include: "**/*.svg?react"
      })
    ],
    
    optimizeDeps: {
      exclude: ['@elo-organico/shared'],
    },
    
    root: 'src', 
    base: '/',

    server: {
      host: true,
      port: 5173,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    },

    preview: {
      port: 4173,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    },

    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const info = assetInfo.names ? assetInfo.names[0] : (assetInfo.name || '');
            let extType = info.split('.').at(1) || 'unknown';
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/css|scss|sass/i.test(extType)) {
                extType = 'css';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
                extType = 'fonts';
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