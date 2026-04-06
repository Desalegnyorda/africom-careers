import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps the '@' symbol to your 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Optional: useful if you want to open the browser automatically
    open: true, 
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});