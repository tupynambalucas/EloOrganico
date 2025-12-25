import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier'; // <--- Integração Prettier
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ['dist', 'coverage', 'node_modules', '**/*.d.ts', '**/*.spec.ts'],
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
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: [path.resolve(__dirname, 'tsconfig.json')],
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
      'no-console': 'warn',
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  prettierConfig,
];
