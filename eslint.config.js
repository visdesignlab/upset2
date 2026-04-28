import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typedFiles = ['**/*.{ts,tsx}'];
const userdocsAliases = [
  '@docusaurus/Link',
  '@docusaurus/useDocusaurusContext',
  '@site/src/components/HomepageFeatures',
  '@theme/Heading',
  '@theme/Layout',
];
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [{
  ignores: [
    '**/.docusaurus/**',
    '**/.turbo/**',
    '**/build/**',
    '**/dist/**',
    '**/*.{js,mjs,cjs,jsx}',
    '**/node_modules/**',
    '**/public/**',
    '**/src/public/**',
    '**/static/**',
  ],
}, ...fixupConfigRules(compat.extends(
  'airbnb-base',
  'airbnb/rules/react',
  'plugin:react/recommended',
  'eslint:recommended',
  'plugin:import/typescript',
  'plugin:@typescript-eslint/recommended',
  'plugin:react-hooks/recommended',
)).map((config) => ({
  ...config,
  files: typedFiles,
})), {
  files: typedFiles,
  plugins: {
    '@typescript-eslint': fixupPluginRules(typescriptEslint),
    react: fixupPluginRules(react),
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    ecmaVersion: 'latest',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    sourceType: 'module',
  },

  settings: {
    'import/core-modules': userdocsAliases,
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        noWarnOnMultipleProjects: true,
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
  },

  rules: {
    'class-methods-use-this': 'off',
    'linebreak-style': 'off',
    'no-restricted-exports': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
    'no-shadow': 'off',

    'no-console': ['error', {
      allow: ['warn', 'error'],
    }],

    'react/no-array-index-key': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-return-await': 'off',

    'max-classes-per-file': 'off',

    'no-param-reassign': ['error', {
      props: false,
    }],

    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/order': 'error',

    'prefer-destructuring': ['warn', {
      object: true,
      array: false,
    }],

    'prefer-promise-reject-errors': 'warn',
    'prefer-spread': 'warn',
    'react/react-in-jsx-scope': 0,
    'max-len': 0,
    'react/jsx-filename-extension': 0,
    'react/no-unknown-property': ['error', {
      ignore: ['css'],
    }],
    'import/extensions': ['error', 'never', {
      json: 'always',
    }],
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unused-class-component-methods': 'warn',
    'react/require-default-props': 'off',

    'react/static-property-placement': ['warn', 'property assignment', {
      childContextTypes: 'static getter',
      contextTypes: 'static public field',
      contextType: 'static public field',
      displayName: 'static public field',
    }],
  },
}, {
  files: typedFiles,
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unused-expressions': ['error', {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-shadow': 'error',
  },
}];
