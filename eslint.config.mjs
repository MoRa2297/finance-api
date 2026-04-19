// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  // ──────────────────────────────────────────────────────────────────────────
  // Test files — relaxed rules.
  // Covers unit specs (`src/**/*.spec.ts`), shared test helpers (`src/test/**`),
  // and e2e specs in the root `test/` directory.
  // `unbound-method` is a false positive with Jest's jest.fn() mocks.
  // `unsafe-assignment` / `unsafe-member-access` are acceptable on response
  // bodies and inline mock data where full typing would add noise.
  // ──────────────────────────────────────────────────────────────────────────
  {
    files: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.e2e-spec.ts',
      'src/test/**/*.ts',
      'test/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
);
