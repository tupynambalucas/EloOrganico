import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier'; // <--- O Mágico do Prettier
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // 1. Configuração Global de Ignores
  // Isso garante que o ESLint NUNCA tente ler ou validar arquivos CSS
  {
    ignores: [
      'dist',
      '**/*.d.ts',
      'src/vite-env.d.ts',
      '**/*.css', // <--- Adicionado: Ignora CSS puro
      '**/*.module.css', // <--- Adicionado: Ignora Modules
      '**/*.scss',
      '**/*.svg',
      '**/*.png',
    ],
  },

  // 2. Configurações Base JS/TS
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Regras Principais (React + TS)
  {
    files: ['**/*.{ts,tsx}'], // Aplica APENAS em arquivos TypeScript/React
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // Usa o tsconfig para entender os tipos, mas os ignores acima protegem o CSS
        project: [
          path.resolve(__dirname, 'tsconfig.json'),
          path.resolve(__dirname, 'tsconfig.node.json'),
        ],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, 'tsconfig.json'),
          alwaysTryTypes: true,
        },
        node: {
          // Mantemos .css aqui apenas para o plugin de 'import' saber que o arquivo existe
          // (resolve o caminho), mas ele não será "lintado" devido ao ignore global.
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off', // Desnecessário no Vite/React 18+

      // Garante que imports quebrados sejam avisados, mas ignora extensões de estilo se necessário
      'import/no-unresolved': 'error',
    },
  },

  // 4. Configuração do Prettier (SEMPRE POR ÚLTIMO)
  // Desativa todas as regras do ESLint que sejam puramente estéticas (indentação, ; etc)
  prettierConfig,
];
