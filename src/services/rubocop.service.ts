/**
 * RuboCop Service Layer
 */

import { execFile } from 'child_process';
import { promisify } from 'util';

import type { RubocopExecutionResult } from '../types.js';

const execFileAsync = promisify(execFile);

/**
 * Configuration for RuboCop execution
 */
export interface RubocopConfig {
  maxBuffer?: number;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<RubocopConfig> = {
  maxBuffer: 10 * 1024 * 1024, // 10MB buffer
};

/**
 * Service for executing RuboCop commands
 */
export class RubocopService {
  private config: Required<RubocopConfig>;

  constructor(config: RubocopConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Executes RuboCop with given arguments
   *
   * @param args - Command line arguments for RuboCop
   * @returns stdout and stderr from execution
   * @throws Error if RuboCop fails with non-offense error
   *
   * Note: RuboCop returns exit code 1 when offenses are found.
   * This is a normal case and we return the output, not throw.
   */
  async execute(args: string[]): Promise<RubocopExecutionResult> {
    try {
      const result = await execFileAsync('rubocop', args, {
        maxBuffer: this.config.maxBuffer,
      });
      return result;
    } catch (error: unknown) {
      // RuboCop returns exit code 1 when offenses are found
      // We still want to process the output in this case
      if (this.isRubocopOffenseError(error)) {
        return {
          stdout: error.stdout as string,
          stderr: (error.stderr as string | undefined) ?? '',
        };
      }

      // Re-throw for actual errors (missing RuboCop, invalid args, etc.)
      throw error;
    }
  }

  /**
   * Type guard to check if error is RuboCop offense error (exit code 1)
   *
   * Teaching moment: Type guards improve type safety and make intent clear
   */
  private isRubocopOffenseError(error: unknown): error is {
    code: number;
    stdout: string;
    stderr?: string;
  } {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      'stdout' in error &&
      'stderr' in error &&
      error.code === 1 &&
      Boolean(error.stdout)
    );
  }

  /**
   * Builds RuboCop arguments for linting operation
   */
  buildLintArgs(params: {
    path: string;
    autoCorrect?: boolean;
    only?: string;
    except?: string;
  }): string[] {
    const args = ['--format', 'json'];

    if (params.autoCorrect) {
      args.push('-A');
    }

    if (params.only) {
      args.push('--only', params.only);
    }

    if (params.except) {
      args.push('--except', params.except);
    }

    args.push(params.path);

    return args;
  }
}

export const rubocopService = new RubocopService();
