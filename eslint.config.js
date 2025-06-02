import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylisticJS from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Configs further down the array will override rules from earlier configs
  importPlugin.flatConfigs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    plugins: {
      react: pluginReact,
      'jsx-a11y': jsxA11y,
      '@stylistic': stylisticJS,
      'eslint-plugin-react': pluginReact,
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
      '@typescript-eslint/no-unused-vars': [
        'warn', // or "error"
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
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
]);
