/**
 * Tool Request Handlers for RuboCop MCP Server
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { autoLintConfig } from '../config/auto-lint.config.js';
import { rubocopService } from '../services/rubocop.service.js';
import type {
  RubocopAutoGenConfigArgs,
  RubocopLintArgs,
  RubocopListCopsArgs,
  RubocopResult,
  RubocopSetAutoLintArgs,
  RubocopShowCopArgs,
} from '../types.js';
import { formatCopList, formatDepartmentSummary, formatOffenses } from '../utils/formatters.js';

function createSuccessResponse(text: string): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

/**
 * Handles rubocop_lint tool requests
 */
export async function handleLint(args: RubocopLintArgs): Promise<CallToolResult> {
  const { path, auto_correct = false, only, except } = args;

  // Use auto-lint settings if enabled and auto_correct not explicitly set
  const shouldAutoCorrect =
    auto_correct || (autoLintConfig.isEnabled() && autoLintConfig.isAutoCorrectEnabled());

  // Build arguments using service
  const rubocopArgs = rubocopService.buildLintArgs({
    path,
    autoCorrect: shouldAutoCorrect,
    only,
    except,
  });

  const { stdout } = await rubocopService.execute(rubocopArgs);
  const result: RubocopResult = JSON.parse(stdout);

  let message = formatOffenses(result);

  if (autoLintConfig.isEnabled() && result.summary.offense_count > 0) {
    message += `\n💡 Auto-lint is enabled. Consider running with auto_correct: true to fix issues automatically.`;
  }

  return createSuccessResponse(message);
}

/**
 * Handles rubocop_list_cops tool requests
 */
export async function handleListCops(args: RubocopListCopsArgs): Promise<CallToolResult> {
  const { department, limit = 50, offset = 0 } = args;

  // Execute RuboCop with --show-cops
  const rubocopArgs = ['--show-cops'];
  const { stdout } = await rubocopService.execute(rubocopArgs);

  let message: string;

  if (!department) {
    message = formatDepartmentSummary(stdout);
  } else {
    // Show cops for specific department
    message = formatCopList(stdout, department, limit, offset);
  }

  return createSuccessResponse(message);
}

/**
 * Handles rubocop_show_cop tool requests
 *
 * Shows detailed information about a specific cop
 */
export async function handleShowCop(args: RubocopShowCopArgs): Promise<CallToolResult> {
  const { cop_name } = args;

  const rubocopArgs = ['--show-cops', cop_name];
  const { stdout } = await rubocopService.execute(rubocopArgs);

  const message = `Details for ${cop_name}:\n\n${stdout}`;
  return createSuccessResponse(message);
}

/**
 * Handles rubocop_auto_gen_config tool requests
 *
 * Generates .rubocop_todo.yml file for gradual adoption
 */
export async function handleAutoGenConfig(args: RubocopAutoGenConfigArgs): Promise<CallToolResult> {
  const { path = '.' } = args;

  const rubocopArgs = ['--auto-gen-config', path];
  const { stdout, stderr } = await rubocopService.execute(rubocopArgs);

  const message = `Configuration generated successfully!\n\n${stdout}\n${stderr}`;
  return createSuccessResponse(message);
}

/**
 * Handles rubocop_set_auto_lint tool requests
 *
 * Updates auto-lint configuration
 */
export async function handleSetAutoLint(args: RubocopSetAutoLintArgs): Promise<CallToolResult> {
  const { enabled, auto_correct = false } = args;

  // Update configuration
  autoLintConfig.setConfig(enabled, auto_correct);

  // Format response
  const status = enabled ? 'enabled' : 'disabled';
  const autoCorrectMsg = enabled && auto_correct ? ' with auto-correction' : '';

  const message = `✓ Auto-lint has been ${status}${autoCorrectMsg}.\n\n${
    enabled
      ? 'The AI assistant will now be reminded to run RuboCop after generating or modifying Ruby files.'
      : 'Auto-lint reminders are now disabled.'
  }`;

  return createSuccessResponse(message);
}

/**
 * Handles rubocop_get_auto_lint_status tool requests
 *
 * Returns current auto-lint configuration
 */
export async function handleGetAutoLintStatus(): Promise<CallToolResult> {
  const message = autoLintConfig.formatStatus();
  return createSuccessResponse(message);
}

export const toolHandlers = {
  rubocop_lint: handleLint,
  rubocop_list_cops: handleListCops,
  rubocop_show_cop: handleShowCop,
  rubocop_auto_gen_config: handleAutoGenConfig,
  rubocop_set_auto_lint: handleSetAutoLint,
  rubocop_get_auto_lint_status: handleGetAutoLintStatus,
} as const;

export type ToolName = keyof typeof toolHandlers;

export function isValidToolName(name: string): name is ToolName {
  return name in toolHandlers;
}
