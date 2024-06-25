import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      // ...
    },
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {}, // Available only when reactDocgen is set to 'react-docgen-typescript'
    skipCompiler: true,
  },
};

export default config;
