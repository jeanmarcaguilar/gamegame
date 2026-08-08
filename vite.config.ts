import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['react-icons'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          email: ['@emailjs/browser'],
        },
      },
    },
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    open: true,
  },
});
