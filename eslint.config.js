import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  // Configs further down the array will override rules from earlier configs
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./packages/*/tsconfig.json'],
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn', // or "error"
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 90,
          semi: true,
          tabWidth: 2,
          useTabs: false,
        },
      ],
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      'dot-notation': 'off',
      'import/extensions': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
      'operator-linebreak': 'off',
      // needs to be duplicated because we have this rule in 2 plugins (=
      'no-unused-vars': [
        'warn', // or "error"
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'max-len': 'off',
      'no-param-reassign': 'off',
      'import/no-cycle': 'off',
      'no-underscore-dangle': 'off',
      'no-nested-ternary': 'off',
      'jsx-a11y/tabindex-no-positive': 'off',
      'no-bitwise': 'warn',
      'no-restricted-syntax': 'warn',
      'no-trailing-spaces': 'error',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'react/display-name': 'off',
    },
  },
];
