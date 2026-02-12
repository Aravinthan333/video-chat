import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    coverage: {
      provider: 'v8',

      reporter: ['text', 'json', 'html'],

      reportsDirectory: './coverage',

      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/config/**'
      ],

      thresholds: {
        lines: 98,
        functions: 98,
        branches: 98,
        statements: 98
      }
    }
  }
});
