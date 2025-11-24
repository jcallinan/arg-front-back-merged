/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'dist/',
        'build/',
      ],
    },
  },
  resolve: {
    alias: {
            "@": path.resolve(__dirname, "src"),
            "@shared-components": path.resolve(  __dirname,"src/shared-components"),
            "@modules": path.resolve(__dirname, "src/modules"),
            "@core": path.resolve(__dirname, "src/core"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@api": path.resolve(__dirname, "src/api"),
            "@constants": path.resolve(__dirname, "src/constants"),
            "@context": path.resolve(__dirname, "src/context"),
            "@services": path.resolve(__dirname, "src/services"),
            "@store": path.resolve(__dirname, "src/store"),
            "@type-definitions": path.resolve(__dirname, "src/types"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@widget-library": path.resolve(__dirname, "src/widget-library"),
         },
  },
});