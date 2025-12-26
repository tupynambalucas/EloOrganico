import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//  JSDoc solução erro ts(2742) de portabilidade de tipos.
/** @type {import('typescript-eslint').ConfigWithExtends[]} */

const config = [
  {
    ignores: ['**/dist/**', '**/node_modules/**', 'packages/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['*.json'],
    rules: {
    },
  },
];

export default config;