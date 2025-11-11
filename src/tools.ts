import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * All available RuboCop MCP tools
 */
export const TOOLS: Tool[] = [
  {
    name: 'rubocop_lint',
    description:
      "Run RuboCop (with Rails cops) on Ruby files to check for style violations and potential \
       issues. Returns detailed information about each offense including severity, location, \
       and whether it's auto-correctable.",
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to the Ruby file or directory to lint',
        },
        auto_correct: {
          type: 'boolean',
          description: 'Whether to automatically fix correctable offenses (default: false)',
          default: false,
        },
        only: {
          type: 'string',
          description:
            "Run only the specified cop(s), e.g., 'Rails/ActiveRecordAliases' or 'Style,Lint'",
        },
        except: {
          type: 'string',
          description: 'Exclude the specified cop(s) from the run',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'rubocop_list_cops',
    description:
      "List RuboCop cops by department. Without department parameter, returns a summary of all \
      departments. With department parameter (e.g., 'Style', 'Lint'), returns cops for that \
      specific department with pagination support.",
    inputSchema: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          description:
            "Filter cops by department (e.g., 'Style', 'Lint', 'Layout', 'Metrics', \
            'Naming', 'Security'). Omit to see department summary.",
        },
        limit: {
          type: 'number',
          description: 'Maximum number of cops to return (default: 50, max: 100)',
          default: 50,
        },
        offset: {
          type: 'number',
          description: 'Number of cops to skip for pagination (default: 0)',
          default: 0,
        },
      },
    },
  },
  {
    name: 'rubocop_show_cop',
    description:
      'Show detailed information about a specific RuboCop cop, including its \
      description, default configuration, and examples.',
    inputSchema: {
      type: 'object',
      properties: {
        cop_name: {
          type: 'string',
          description:
            "The name of the cop to show details for (e.g., 'Rails/ActiveRecordAliases')",
        },
      },
      required: ['cop_name'],
    },
  },
  {
    name: 'rubocop_auto_gen_config',
    description:
      'Generate a .rubocop_todo.yml file with all current offenses disabled.\
       Useful for gradually adopting RuboCop in existing projects.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to the directory to generate config for (default: current directory)',
          default: '.',
        },
      },
    },
  },
  {
    name: 'rubocop_set_auto_lint',
    description:
      'Enable or disable automatic linting mode. When enabled, the AI assistant will be\
       reminded to run RuboCop after generating or modifying Ruby files.',
    inputSchema: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'True to enable auto-lint, false to disable',
        },
        auto_correct: {
          type: 'boolean',
          description: 'Whether to automatically fix issues when auto-linting (default: false)',
          default: false,
        },
      },
      required: ['enabled'],
    },
  },
  {
    name: 'rubocop_get_auto_lint_status',
    description: 'Get the current auto-lint status and configuration.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];
