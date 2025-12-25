// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default [
  // 1. Configuração de Ignores (Global)
  { 
    ignores: [
      '**/dist/**', 
      '**/node_modules/**', 
      'packages/**' 
    ] 
  },

  // 2. Configs Base (JS e TS)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Configuração do Parser e Project Service (Onde estava o erro anterior)
  {
    languageOptions: {
      parserOptions: {
        // O projectService resolve automaticamente o tsconfig.json mais próximo
        // e permite arquivos soltos como este config
        projectService: {
          allowDefaultProject: ['eslint.config.js']
        },
        tsconfigRootDir: __dirname,
      },
    },
  },

  // 4. Regras Específicas
  {
    files: ['*.json'],
    rules: {
      // Regras para JSON se necessário
    }
  }
];