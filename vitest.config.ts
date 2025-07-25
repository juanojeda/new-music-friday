import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: ['legacy/**', 'node_modules/**'],
  },
});
