import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Linter } from 'eslint';

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Linter.Config[] = [
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    name: 'monorepo/global-typescript-config',
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/ignore': [
        '.css$',
        '.scss$',
        '.sass$',
        '.less$',
        '.styl$',
        '.module.(css|scss|sass|less|styl)$',
      ],
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: [
            '.css$',
            '.scss$',
            '.sass$',
            '.less$',
            '.styl$',
            '.module.(css|scss|sass|less|styl)$',
          ],
        },
      ],
      'import/no-duplicates': 'warn',
    },
  },

  {
    name: 'monorepo/ignores',
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.eslintcache',
      '**/*.json',
      '**/*.css',
      '**/*.scss',
      '**/*.sass',
      '**/*.less',
      '**/*.styl',
      'mongo-keyfile',
      'docker-compose*.yml',
      '**/types/**/*.d.ts',
      '**/*.d.ts',
      '**/vite-env.d.ts',
    ],
  },

  {
    name: 'monorepo/root-config-files',
    files: ['*.{js,mjs,ts}', '*.config.{js,mjs,ts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  {
    name: 'monorepo/packages-shared',
    files: ['packages/shared/**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(__dirname, 'packages/shared'),
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  {
    name: 'monorepo/packages-backend',
    files: ['packages/backend/**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(__dirname, 'packages/backend'),
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  {
    name: 'monorepo/packages-frontend',
    files: ['packages/frontend/**/*.{js,mjs,ts,tsx}'],
    ignores: [
      'packages/frontend/src/types/**/*.d.ts',
      'packages/frontend/**/*.d.ts',
      'packages/frontend/src/vite-env.d.ts',
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(__dirname, 'packages/frontend'),
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: path.join(__dirname, 'packages/frontend/tsconfig.json'),
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/ignore': [
        '.css$',
        '.scss$',
        '.sass$',
        '.less$',
        '.styl$',
        '.module.(css|scss|sass|less|styl)$',
      ],
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/no-unresolved': [
        'error',
        {
          ignore: [
            '.css$',
            '.scss$',
            '.sass$',
            '.less$',
            '.styl$',
            '.module.(css|scss|sass|less|styl)$',
          ],
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },

  {
    name: 'monorepo/test-files',
    files: ['**/*.{test,spec}.{js,mjs,ts,tsx}', '**/__tests__/**/*.{js,mjs,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
];

export default config;
