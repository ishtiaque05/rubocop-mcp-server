/**
 * Unit tests for RubocopService
 * Tests buildLintArgs method and service structure
 */

import { describe, it, expect } from 'vitest';

import { rubocopService, RubocopService } from '../../services/rubocop.service.js';

describe('RubocopService', () => {
  describe('constructor', () => {
    it('should create instance with default config', () => {
      const service = new RubocopService();
      expect(service).toBeInstanceOf(RubocopService);
    });

    it('should create instance with custom config', () => {
      const service = new RubocopService({ maxBuffer: 20 * 1024 * 1024 });
      expect(service).toBeInstanceOf(RubocopService);
    });
  });

  describe('buildLintArgs', () => {
    it('should build basic lint arguments with only path', () => {
      const args = rubocopService.buildLintArgs({ path: 'app.rb' });

      expect(args).toEqual(['--format', 'json', 'app.rb']);
    });

    it('should include auto-correct flag when enabled', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app.rb',
        autoCorrect: true,
      });

      expect(args).toEqual(['--format', 'json', '-A', 'app.rb']);
    });

    it('should not include auto-correct flag when disabled', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app.rb',
        autoCorrect: false,
      });

      expect(args).toEqual(['--format', 'json', 'app.rb']);
    });

    it('should include --only flag with cop names', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app.rb',
        only: 'Style/StringLiterals',
      });

      expect(args).toEqual(['--format', 'json', '--only', 'Style/StringLiterals', 'app.rb']);
    });

    it('should include --except flag with cop names', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app.rb',
        except: 'Metrics/MethodLength',
      });

      expect(args).toEqual(['--format', 'json', '--except', 'Metrics/MethodLength', 'app.rb']);
    });

    it('should include all flags when all options are provided', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app.rb',
        autoCorrect: true,
        only: 'Style',
        except: 'Style/Documentation',
      });

      expect(args).toEqual([
        '--format',
        'json',
        '-A',
        '--only',
        'Style',
        '--except',
        'Style/Documentation',
        'app.rb',
      ]);
    });

    it('should handle directory paths', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app/',
      });

      expect(args).toEqual(['--format', 'json', 'app/']);
    });

    it('should handle glob patterns in path', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app/**/*.rb',
      });

      expect(args).toEqual(['--format', 'json', 'app/**/*.rb']);
    });

    it('should handle multiple cops in only', () => {
      const args = rubocopService.buildLintArgs({
        path: 'app.rb',
        only: 'Style/StringLiterals,Layout/LineLength',
      });

      expect(args).toEqual([
        '--format',
        'json',
        '--only',
        'Style/StringLiterals,Layout/LineLength',
        'app.rb',
      ]);
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(rubocopService).toBeInstanceOf(RubocopService);
    });

    it('should use the same instance across imports', async () => {
      const { rubocopService: importedService } = await import('../../services/rubocop.service.js');
      expect(importedService).toBe(rubocopService);
    });
  });
});
