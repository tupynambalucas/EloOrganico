import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier'; // <--- Integração Prettier
import importPlugin from 'eslint-plugin-import'; // <--- Validação de Imports
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ['dist', 'coverage', 'node_modules', '**/*.d.ts'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: path.resolve(__dirname, 'tsconfig.json'),
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__dirname, 'tsconfig.json'),
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.ts', '.json'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
    },
  },

  // 4. Configuração do Prettier (SEMPRE POR ÚLTIMO)
  prettierConfig,
];
