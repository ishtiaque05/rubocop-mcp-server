/**
 * Unit tests for formatter utilities
 * Tests all formatting functions with various edge cases
 */

import { describe, expect, it } from 'vitest';

import type { RubocopResult } from '../../types.js';
import { formatCopList, formatDepartmentSummary, formatOffenses } from '../../utils/formatters.js';
import { RUBOCOP_SHOW_COPS_OUTPUT } from '../fixtures/rubocop-output.js';

describe('formatters', () => {
  describe('formatOffenses', () => {
    it('should format result with no offenses', () => {
      const result: RubocopResult = {
        metadata: {
          rubocop_version: '1.50.0',
          ruby_engine: 'ruby',
          ruby_version: '3.2.0',
          ruby_patchlevel: '0',
          ruby_platform: 'x86_64-linux',
        },
        files: [{ path: 'app.rb', offenses: [] }],
        summary: { offense_count: 0, target_file_count: 1, inspected_file_count: 1 },
      };

      const output = formatOffenses(result);

      expect(output).toContain('No offenses found');
      expect(output).toBe('✓ No offenses found!');
    });

    it('should format result with offenses in single file', () => {
      const result: RubocopResult = {
        metadata: {
          rubocop_version: '1.50.0',
          ruby_engine: 'ruby',
          ruby_version: '3.2.0',
          ruby_patchlevel: '0',
          ruby_platform: 'x86_64-linux',
        },
        files: [
          {
            path: 'app.rb',
            offenses: [
              {
                severity: 'convention',
                message: 'Prefer single-quoted strings',
                cop_name: 'Style/StringLiterals',
                correctable: true,
                corrected: false,
                location: {
                  start_line: 10,
                  start_column: 5,
                  last_line: 10,
                  last_column: 10,
                  length: 5,
                  line: 10,
                  column: 5,
                },
              },
            ],
          },
        ],
        summary: { offense_count: 1, target_file_count: 1, inspected_file_count: 1 },
      };

      const output = formatOffenses(result);

      expect(output).toContain('offense');
      expect(output).toContain('app.rb');
      expect(output).toContain('Style/StringLiterals');
    });

    it('should handle files with no offenses in multi-file results', () => {
      const result: RubocopResult = {
        metadata: {
          rubocop_version: '1.50.0',
          ruby_engine: 'ruby',
          ruby_version: '3.2.0',
          ruby_patchlevel: '0',
          ruby_platform: 'x86_64-linux',
        },
        files: [
          {
            path: 'app.rb',
            offenses: [
              {
                severity: 'convention',
                message: 'Issue',
                cop_name: 'Style/StringLiterals',
                correctable: true,
                corrected: false,
                location: {
                  start_line: 10,
                  start_column: 5,
                  last_line: 10,
                  last_column: 10,
                  length: 5,
                  line: 10,
                  column: 5,
                },
              },
            ],
          },
          {
            path: 'clean.rb',
            offenses: [],
          },
        ],
        summary: { offense_count: 1, target_file_count: 2, inspected_file_count: 2 },
      };

      const output = formatOffenses(result);

      expect(output).toContain('app.rb');
      expect(output).not.toContain('clean.rb');
    });
  });

  describe('formatDepartmentSummary', () => {
    it('should parse and format department summary', () => {
      const output = formatDepartmentSummary(RUBOCOP_SHOW_COPS_OUTPUT);

      expect(output).toContain('RuboCop has');
      expect(output).toContain('total cops');
      expect(output).toContain('departments');
      expect(output).toContain('Style:');
      expect(output).toContain('Layout:');
      expect(output).toContain('Lint:');
      expect(output).toContain('Metrics:');
      expect(output).toContain('Naming:');
    });

    it('should sort departments alphabetically', () => {
      const output = formatDepartmentSummary(RUBOCOP_SHOW_COPS_OUTPUT);
      const lines = output.split('\n');
      const deptLines = lines.filter((line) => line.startsWith('•'));

      // Extract department names
      const depts = deptLines.map((line) => line.match(/• ([^:]+):/)?.[1] ?? '');

      // Verify alphabetical order
      const sorted = [...depts].sort();
      expect(depts).toEqual(sorted);
    });

    it('should include helpful hint', () => {
      const output = formatDepartmentSummary(RUBOCOP_SHOW_COPS_OUTPUT);

      expect(output).toContain('department');
    });

    it('should handle empty output', () => {
      const output = formatDepartmentSummary('');

      expect(output).toContain('0 total cops');
      expect(output).toContain('0 departments');
    });

    it('should count cops correctly', () => {
      const output = formatDepartmentSummary(RUBOCOP_SHOW_COPS_OUTPUT);

      // Should have 143 + 67 + 92 + 12 + 23 = 337 total cops
      expect(output).toContain('337 total cops');
    });
  });

  describe('formatCopList', () => {
    it('should format cop list with pagination', () => {
      const output = formatCopList(RUBOCOP_SHOW_COPS_OUTPUT, 'Style', 2, 0);

      expect(output).toContain('RuboCop Cops (Style department)');
      expect(output).toContain('Showing 1-2 of 3 total cops');
      expect(output).toContain('Style/AccessorGrouping');
      expect(output).toContain('Style/Alias');
      expect(output).not.toContain('Style/AndOr');
    });

    it('should handle offset in pagination', () => {
      const output = formatCopList(RUBOCOP_SHOW_COPS_OUTPUT, 'Style', 2, 1);

      expect(output).toContain('Showing 2-3 of 3 total cops');
      expect(output).not.toContain('Style/AccessorGrouping');
      expect(output).toContain('Style/Alias');
      expect(output).toContain('Style/AndOr');
    });

    it('should cap limit at 100', () => {
      const output = formatCopList(RUBOCOP_SHOW_COPS_OUTPUT, 'Style', 500, 0);

      // Should only show 3 cops (all available), not crash
      expect(output).toContain('Showing 1-3 of 3 total cops');
    });

    it('should handle non-existent department', () => {
      const output = formatCopList(RUBOCOP_SHOW_COPS_OUTPUT, 'NonExistent', 10, 0);

      expect(output).toContain('No cops found for department: NonExistent');
      expect(output).toContain('Available departments can be seen');
    });

    it('should show all cops when limit exceeds total', () => {
      const output = formatCopList(RUBOCOP_SHOW_COPS_OUTPUT, 'Style', 100, 0);

      expect(output).toContain('Showing 1-3 of 3 total cops');
      expect(output).toContain('Style/AccessorGrouping');
      expect(output).toContain('Style/Alias');
      expect(output).toContain('Style/AndOr');
    });

    it('should include pagination footer when has more results', () => {
      const output = formatCopList(RUBOCOP_SHOW_COPS_OUTPUT, 'Style', 1, 0);

      expect(output).toContain('offset');
    });
  });
});
