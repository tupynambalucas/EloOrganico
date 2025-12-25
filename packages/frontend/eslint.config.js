import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // 1. Configuração Global de Ignores
  {
    ignores: [
      'dist',
      '**/*.d.ts',
      '**/*.css',
      '**/*.module.css',
      '**/*.scss',
      '**/*.svg',
      '**/*.png',
    ],
  },

  // 2. Configurações Base
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // [CORREÇÃO CRÍTICA] 2.1 Configuração Global do Parser
  // Define o diretório raiz para TODOS os arquivos (incluindo js e o próprio config),
  // resolvendo o erro "No tsconfigRootDir was set".
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },

  // 3. Regras Principais (React + TS)
  {
    files: ['**/*.{ts,tsx,mjs}'], // Aplica regras pesadas apenas em TS/TSX
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // Aqui definimos o projeto para análise de tipos (Type-Aware Linting)
      projectService: true, 
        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.css'],
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
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.module.css'],
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'import/no-unresolved': 'error',
    },
  },

  // 4. Configuração do Prettier (SEMPRE POR ÚLTIMO)
  prettierConfig,
];