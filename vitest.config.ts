import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'build/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts', // Entry point, tested via integration
        'src/tools.ts', // Tool definitions, tested via handlers
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'build'],
  },
});
