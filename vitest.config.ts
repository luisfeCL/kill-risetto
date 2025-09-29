import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // o 'happy-dom'
    setupFiles: './vitest.setup.ts',
  },
});