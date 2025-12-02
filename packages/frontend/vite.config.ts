import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc'; // Supondo que você usa este ou o plugin-react padrão
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    // Adicione o tsconfigPaths aqui
    plugins: [
      react(), 
      tsconfigPaths(),
      svgr({
        include: "**/*.svg?react"
      })
    ],
    
    root: 'src', 
    base: '/',

    // A seção 'resolve' foi removida pois o tsconfigPaths cuida disso agora

    server: {
      host: true,
      port: 5173,
      open: true,
      cors: true, 
    },

    preview: {
      port: 4173,
      open: true,
    },

    build: {
      // Como o root é 'src', precisamos subir um nível para gerar a dist na raiz do pacote
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            // CORREÇÃO: Usamos .names[0] em vez de .name
            const info = assetInfo.names ? assetInfo.names[0] : (assetInfo.name || '');
            let extType = info.split('.').at(1) || 'unknown';
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/css|scss|sass/i.test(extType)) {
                // Opcional: organizar CSS também
                extType = 'css';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
                // Opcional: organizar Fontes
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