/**
 * Type definitions for RuboCop MCP Server
 *
 * Centralizing types promotes:
 * - Reusability across modules
 * - Single source of truth for data structures
 * - Better IDE autocomplete and type checking
 */

/**
 * Represents a single offense found by RuboCop
 */
export interface RubocopOffense {
  severity: string;
  message: string;
  cop_name: string;
  correctable: boolean;
  corrected: boolean;
  location: {
    start_line: number;
    start_column: number;
    last_line: number;
    last_column: number;
    length: number;
    line: number;
    column: number;
  };
}

/**
 * Represents a file analyzed by RuboCop
 */
export interface RubocopFile {
  path: string;
  offenses: RubocopOffense[];
}

/**
 * Complete RuboCop analysis result
 */
export interface RubocopResult {
  metadata: {
    rubocop_version: string;
    ruby_engine: string;
    ruby_version: string;
    ruby_patchlevel: string;
    ruby_platform: string;
  };
  files: RubocopFile[];
  summary: {
    offense_count: number;
    target_file_count: number;
    inspected_file_count: number;
  };
}

/**
 * Arguments for rubocop_lint tool
 */
export interface RubocopLintArgs {
  path: string;
  auto_correct?: boolean;
  only?: string;
  except?: string;
}

/**
 * Arguments for rubocop_list_cops tool
 */
export interface RubocopListCopsArgs {
  department?: string;
  limit?: number;
  offset?: number;
}

/**
 * Arguments for rubocop_show_cop tool
 */
export interface RubocopShowCopArgs {
  cop_name: string;
}

/**
 * Arguments for rubocop_auto_gen_config tool
 */
export interface RubocopAutoGenConfigArgs {
  path?: string;
}

/**
 * Arguments for rubocop_set_auto_lint tool
 */
export interface RubocopSetAutoLintArgs {
  enabled: boolean;
  auto_correct?: boolean;
}

/**
 * Result from executing a RuboCop command
 */
export interface RubocopExecutionResult {
  stdout: string;
  stderr: string;
}
