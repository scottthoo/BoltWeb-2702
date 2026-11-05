import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // The three.js hero is a deliberately lazy-loaded chunk (~135 kB gzip) that
    // loads after first paint; it cannot be split further, so allow its size.
    chunkSizeWarningLimit: 600,
  },
});