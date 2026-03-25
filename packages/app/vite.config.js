import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],
    optimizeDeps: {
      include: ['@trrack/vis-react', '@trrack/core', '@reduxjs/toolkit'],
    },
    server: { hmr: process.env.NODE_TESTING !== 'true' },
  };
});
