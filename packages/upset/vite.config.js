/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { join } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/react',
  plugins: [
    dts({
      tsConfigFilePath: join(__dirname, 'tsconfig.json'),
      // Faster builds by skipping tests. Set this to false to enable type checking.
      skipDiagnostics: true,
    }),
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    sourcemap: true,
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.tsx',
      fileName: 'index',

      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        '@trrack/vis-react',
        '@trrack/core',
        'd3',
        '@mui/icons-material',
        '@mui/material',
        '@mui/system',
        '@mui/x-data-grid',
        '@emotion/css',
        '@emotion/react',
        '@emotion/styled',
        '@ts-stack/markdown',
        'vega',
        'vega-lite',
      ],
    },
  },
});
