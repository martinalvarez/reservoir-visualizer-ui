/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // Cambia jsdom por happy-dom
    setupFiles: './src/setupTests.tsx',
  },
});
