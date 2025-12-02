import react from '@vitejs/plugin-react-swc';
import { join } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/react',
  plugins: [
    dts({
      tsConfigFilePath: join(__dirname, 'tsconfig.json'),
      // Faster builds by skipping tests. Set this to false to enable type checking.
      skipDiagnostics: true,
    }),
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  server: { hmr: process.env.NODE_TESTING !== 'true' },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    sourcemap: true,
    emptyOutDir: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.tsx',
      fileName: 'index',

      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        '@mui/system',
        '@mui/icons-material',
        '@mui/x-data-grid',
        'recoil',
        '@trrack/core',
        '@trrack/vis-react',
        'vega',
        'vega-lite',
        'react-vega'
      ],
      treeshake: true,
    },
  },
});
