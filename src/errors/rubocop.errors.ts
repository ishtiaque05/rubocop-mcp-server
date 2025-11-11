/**
 * Custom Error Classes for RuboCop MCP Server
 */

/**
 * Base error class for all RuboCop-related errors
 */
export class RubocopError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when RuboCop is not installed or not found in PATH
 */
export class RubocopNotInstalledError extends RubocopError {
  constructor() {
    super(
      'RuboCop is not installed or not found in PATH.\n\n' +
        'To install RuboCop:\n' +
        '  gem install rubocop rubocop-rails'
    );
  }
}

/**
 * Error thrown when RuboCop command execution fails
 */
export class RubocopExecutionError extends RubocopError {
  public readonly exitCode?: number;
  public readonly stderr?: string;

  constructor(message: string, exitCode?: number, stderr?: string) {
    super(message);
    this.exitCode = exitCode;
    this.stderr = stderr;
  }
}

/**
 * Error thrown when RuboCop output cannot be parsed
 */
export class RubocopParseError extends RubocopError {
  public readonly rawOutput: string;

  constructor(rawOutput: string) {
    super('Failed to parse RuboCop JSON output. The output may be malformed.');
    this.rawOutput = rawOutput;
  }
}

/**
 * Error thrown when an invalid tool name is requested
 */
export class UnknownToolError extends Error {
  public readonly toolName: string;

  constructor(toolName: string) {
    super(`Unknown tool: ${toolName}`);
    this.name = 'UnknownToolError';
    this.toolName = toolName;
  }
}

/**
 * Formats an error for user-friendly display
 */
export function formatError(error: unknown): string {
  if (error instanceof RubocopNotInstalledError) {
    return error.message;
  }

  if (error instanceof RubocopExecutionError) {
    let msg = `Error running RuboCop: ${error.message}`;
    if (error.stderr) {
      msg += `\n\nStderr:\n${error.stderr}`;
    }
    return msg;
  }

  if (error instanceof RubocopParseError) {
    return `${error.message}\n\n` + `If this persists, please file an issue with the raw output.`;
  }

  if (error instanceof UnknownToolError) {
    return error.message;
  }

  // Generic error handling
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return 'An unknown error occurred';
}
