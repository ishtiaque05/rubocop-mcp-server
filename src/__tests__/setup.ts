/**
 * Global test setup
 * Configures environment and utilities for all tests
 */

import { beforeEach, vi } from 'vitest';

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Suppress console output during tests unless explicitly needed
if (process.env.VITEST_LOG !== 'true') {
  global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}
