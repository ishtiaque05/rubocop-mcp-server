/**
 * Unit tests for tool handlers
 * Tests type guards and handler structure
 */

import { describe, it, expect } from 'vitest';

import { isValidToolName, toolHandlers } from '../../handlers/tool.handlers.js';

describe('tool.handlers', () => {
  describe('isValidToolName', () => {
    it('should return true for valid tool names', () => {
      expect(isValidToolName('rubocop_lint')).toBe(true);
      expect(isValidToolName('rubocop_list_cops')).toBe(true);
      expect(isValidToolName('rubocop_show_cop')).toBe(true);
      expect(isValidToolName('rubocop_auto_gen_config')).toBe(true);
      expect(isValidToolName('rubocop_set_auto_lint')).toBe(true);
      expect(isValidToolName('rubocop_get_auto_lint_status')).toBe(true);
    });

    it('should return false for invalid tool names', () => {
      expect(isValidToolName('invalid_tool')).toBe(false);
      expect(isValidToolName('rubocop_invalid')).toBe(false);
      expect(isValidToolName('')).toBe(false);
      expect(isValidToolName('rubocop')).toBe(false);
    });

    it('should be case-sensitive', () => {
      expect(isValidToolName('RUBOCOP_LINT')).toBe(false);
      expect(isValidToolName('Rubocop_Lint')).toBe(false);
    });
  });

  describe('toolHandlers', () => {
    it('should export all required handlers', () => {
      expect(toolHandlers).toHaveProperty('rubocop_lint');
      expect(toolHandlers).toHaveProperty('rubocop_list_cops');
      expect(toolHandlers).toHaveProperty('rubocop_show_cop');
      expect(toolHandlers).toHaveProperty('rubocop_auto_gen_config');
      expect(toolHandlers).toHaveProperty('rubocop_set_auto_lint');
      expect(toolHandlers).toHaveProperty('rubocop_get_auto_lint_status');
    });

    it('should have function handlers', () => {
      expect(typeof toolHandlers.rubocop_lint).toBe('function');
      expect(typeof toolHandlers.rubocop_list_cops).toBe('function');
      expect(typeof toolHandlers.rubocop_show_cop).toBe('function');
      expect(typeof toolHandlers.rubocop_auto_gen_config).toBe('function');
      expect(typeof toolHandlers.rubocop_set_auto_lint).toBe('function');
      expect(typeof toolHandlers.rubocop_get_auto_lint_status).toBe('function');
    });
  });
});
