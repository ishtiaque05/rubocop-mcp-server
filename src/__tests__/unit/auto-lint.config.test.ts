/**
 * Unit tests for AutoLintConfigManager
 * Tests configuration state management
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { AutoLintConfigManager } from '../../config/auto-lint.config.js';

describe('AutoLintConfigManager', () => {
  let config: AutoLintConfigManager;

  beforeEach(() => {
    config = new AutoLintConfigManager();
  });

  describe('initialization', () => {
    it('should initialize with auto-lint disabled by default', () => {
      expect(config.isEnabled()).toBe(false);
    });

    it('should initialize with auto-correct disabled by default', () => {
      expect(config.isAutoCorrectEnabled()).toBe(false);
    });

    it('should create instance successfully', () => {
      expect(config).toBeInstanceOf(AutoLintConfigManager);
    });
  });

  describe('enable/disable', () => {
    it('should enable auto-lint', () => {
      config.enable();
      expect(config.isEnabled()).toBe(true);
    });

    it('should disable auto-lint', () => {
      config.enable();
      config.disable();
      expect(config.isEnabled()).toBe(false);
    });

    it('should handle multiple enable calls', () => {
      config.enable();
      config.enable();
      expect(config.isEnabled()).toBe(true);
    });

    it('should handle multiple disable calls', () => {
      config.disable();
      config.disable();
      expect(config.isEnabled()).toBe(false);
    });

    it('should toggle state correctly', () => {
      expect(config.isEnabled()).toBe(false);
      config.enable();
      expect(config.isEnabled()).toBe(true);
      config.disable();
      expect(config.isEnabled()).toBe(false);
    });

    it('should enable with auto-correct when specified', () => {
      config.enable(true);
      expect(config.isEnabled()).toBe(true);
      expect(config.isAutoCorrectEnabled()).toBe(true);
    });

    it('should disable auto-correct when disabling', () => {
      config.enable(true);
      config.disable();
      expect(config.isEnabled()).toBe(false);
      expect(config.isAutoCorrectEnabled()).toBe(false);
    });
  });

  describe('setConfig', () => {
    it('should set both enabled and autoCorrect', () => {
      config.setConfig(true, true);
      expect(config.isEnabled()).toBe(true);
      expect(config.isAutoCorrectEnabled()).toBe(true);
    });

    it('should set enabled without autoCorrect', () => {
      config.setConfig(true, false);
      expect(config.isEnabled()).toBe(true);
      expect(config.isAutoCorrectEnabled()).toBe(false);
    });

    it('should disable both when set to false', () => {
      config.setConfig(true, true);
      config.setConfig(false, false);
      expect(config.isEnabled()).toBe(false);
      expect(config.isAutoCorrectEnabled()).toBe(false);
    });
  });

  describe('getConfig', () => {
    it('should return current config with both disabled', () => {
      const result = config.getConfig();

      expect(result).toEqual({
        enabled: false,
        autoCorrect: false,
      });
    });

    it('should return config with auto-lint enabled', () => {
      config.enable();
      const result = config.getConfig();

      expect(result).toEqual({
        enabled: true,
        autoCorrect: false,
      });
    });

    it('should return config with both enabled', () => {
      config.enable(true);
      const result = config.getConfig();

      expect(result).toEqual({
        enabled: true,
        autoCorrect: true,
      });
    });

    it('should return immutable config object', () => {
      const config1 = config.getConfig();
      const config2 = config.getConfig();

      expect(config1).toEqual(config2);
      expect(config1).not.toBe(config2); // Different object references
    });
  });

  describe('formatStatus', () => {
    it('should format status with both disabled', () => {
      const status = config.formatStatus();

      expect(status).toContain('Auto-lint: disabled');
      expect(status).toContain('Auto-correction: disabled');
      expect(status).toContain('Auto-lint is currently disabled');
    });

    it('should format status with auto-lint enabled', () => {
      config.enable();
      const status = config.formatStatus();

      expect(status).toContain('Auto-lint: enabled');
      expect(status).toContain('Auto-correction: disabled');
      expect(status).toContain('should run RuboCop');
    });

    it('should format status with both enabled', () => {
      config.enable(true);
      const status = config.formatStatus();

      expect(status).toContain('Auto-lint: enabled');
      expect(status).toContain('Auto-correction: enabled');
    });
  });

  describe('reset', () => {
    it('should reset to default state', () => {
      config.enable(true);
      config.reset();

      expect(config.isEnabled()).toBe(false);
      expect(config.isAutoCorrectEnabled()).toBe(false);
    });

    it('should reset from any state', () => {
      config.setConfig(true, true);
      config.reset();

      const result = config.getConfig();
      expect(result).toEqual({
        enabled: false,
        autoCorrect: false,
      });
    });
  });

  describe('complex state transitions', () => {
    it('should handle complex enable/disable sequence', () => {
      config.enable();
      expect(config.isEnabled()).toBe(true);

      config.setConfig(true, true);
      expect(config.isAutoCorrectEnabled()).toBe(true);

      config.disable();
      expect(config.isEnabled()).toBe(false);
      expect(config.isAutoCorrectEnabled()).toBe(false);

      config.enable(true);
      expect(config.isEnabled()).toBe(true);
      expect(config.isAutoCorrectEnabled()).toBe(true);
    });
  });
});
