#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// Auto-lint state
let autoLintEnabled = false;
let autoLintAutoCorrect = false;

interface RubocopOffense {
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

interface RubocopFile {
  path: string;
  offenses: RubocopOffense[];
}

interface RubocopResult {
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

const TOOLS: Tool[] = [
  {
    name: "rubocop_lint",
    description:
      "Run RuboCop (with Rails cops) on Ruby files to check for style violations and potential issues. Returns detailed information about each offense including severity, location, and whether it's auto-correctable.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the Ruby file or directory to lint",
        },
        auto_correct: {
          type: "boolean",
          description:
            "Whether to automatically fix correctable offenses (default: false)",
          default: false,
        },
        only: {
          type: "string",
          description:
            "Run only the specified cop(s), e.g., 'Rails/ActiveRecordAliases' or 'Style,Lint'",
        },
        except: {
          type: "string",
          description: "Exclude the specified cop(s) from the run",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "rubocop_list_cops",
    description:
      "List RuboCop cops by department. Without department parameter, returns a summary of all departments. With department parameter (e.g., 'Style', 'Lint'), returns cops for that specific department with pagination support.",
    inputSchema: {
      type: "object",
      properties: {
        department: {
          type: "string",
          description:
            "Filter cops by department (e.g., 'Style', 'Lint', 'Layout', 'Metrics', 'Naming', 'Security'). Omit to see department summary.",
        },
        limit: {
          type: "number",
          description: "Maximum number of cops to return (default: 50, max: 100)",
          default: 50,
        },
        offset: {
          type: "number",
          description: "Number of cops to skip for pagination (default: 0)",
          default: 0,
        },
      },
    },
  },
  {
    name: "rubocop_show_cop",
    description:
      "Show detailed information about a specific RuboCop cop, including its description, default configuration, and examples.",
    inputSchema: {
      type: "object",
      properties: {
        cop_name: {
          type: "string",
          description: "The name of the cop to show details for (e.g., 'Rails/ActiveRecordAliases')",
        },
      },
      required: ["cop_name"],
    },
  },
  {
    name: "rubocop_auto_gen_config",
    description:
      "Generate a .rubocop_todo.yml file with all current offenses disabled. Useful for gradually adopting RuboCop in existing projects.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the directory to generate config for (default: current directory)",
          default: ".",
        },
      },
    },
  },
  {
    name: "rubocop_set_auto_lint",
    description:
      "Enable or disable automatic linting mode. When enabled, the AI assistant will be reminded to run RuboCop after generating or modifying Ruby files.",
    inputSchema: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
          description: "True to enable auto-lint, false to disable",
        },
        auto_correct: {
          type: "boolean",
          description: "Whether to automatically fix issues when auto-linting (default: false)",
          default: false,
        },
      },
      required: ["enabled"],
    },
  },
  {
    name: "rubocop_get_auto_lint_status",
    description:
      "Get the current auto-lint status and configuration.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

async function runRubocop(args: string[]): Promise<{ stdout: string; stderr: string }> {
  try {
    const result = await execFileAsync("rubocop", args, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    return result;
  } catch (error: any) {
    // RuboCop returns exit code 1 when offenses are found
    // We still want to process the output in this case
    if (error.code === 1 && error.stdout) {
      return { stdout: error.stdout, stderr: error.stderr || "" };
    }
    throw error;
  }
}

function formatOffenses(result: RubocopResult): string {
  if (result.summary.offense_count === 0) {
    return "✓ No offenses found!";
  }

  let output = `Found ${result.summary.offense_count} offense(s) in ${result.files.length} file(s):\n\n`;

  for (const file of result.files) {
    if (file.offenses.length === 0) continue;

    output += `📄 ${file.path}\n`;
    for (const offense of file.offenses) {
      const icon = offense.severity === "error" ? "❌" : offense.severity === "warning" ? "⚠️" : "ℹ️";
      const correctable = offense.correctable ? " [Auto-correctable]" : "";
      const corrected = offense.corrected ? " [Corrected]" : "";

      output += `  ${icon} Line ${offense.location.line}:${offense.location.column}: ${offense.message}\n`;
      output += `     Cop: ${offense.cop_name}${correctable}${corrected}\n`;
    }
    output += "\n";
  }

  return output;
}

function formatCopList(stdout: string, department: string, limit: number = 50, offset: number = 0): string {
  // Parse cop names from RuboCop output for the specified department
  // RuboCop output format has department headers like: "# Department 'Style' (281):"
  // followed by cop definitions like: "Style/AccessModifierDeclarations:"

  const lines = stdout.split("\n");
  const matchingCops: string[] = [];
  let inTargetDepartment = false;
  const deptPrefix = department + "/";

  for (const line of lines) {
    // Check if we're entering the target department
    const deptMatch = line.match(/^# Department '([^']+)'/);
    if (deptMatch) {
      inTargetDepartment = deptMatch[1] === department;
      continue;
    }

    // If we're in a different department's header, skip
    if (line.startsWith("# Department '") && !inTargetDepartment) {
      inTargetDepartment = false;
      continue;
    }

    // Extract cop names for the target department
    if (line.startsWith(deptPrefix)) {
      const copMatch = line.match(/^([A-Z][a-zA-Z]+\/[A-Za-z0-9]+):/);
      if (copMatch) {
        matchingCops.push(copMatch[1]);
      }
    }
  }

  const totalCops = matchingCops.length;

  if (totalCops === 0) {
    return `No cops found for department: ${department}\n\nAvailable departments can be seen by calling rubocop_list_cops without a department parameter.`;
  }

  // Apply pagination with conservative limits
  const maxLimit = Math.min(limit, 100);
  const paginatedCops = matchingCops.slice(offset, offset + maxLimit);
  const hasMore = offset + maxLimit < totalCops;

  let output = `RuboCop Cops (${department} department):\n`;
  output += `Showing ${offset + 1}-${offset + paginatedCops.length} of ${totalCops} total cops\n\n`;

  for (const cop of paginatedCops) {
    output += `• ${cop}\n`;
  }

  output += `\n`;

  if (hasMore) {
    const nextOffset = offset + maxLimit;
    output += `📄 More results available. To see the next page:\n`;
    output += `   Use limit: ${maxLimit}, offset: ${nextOffset}\n`;
    output += `   Remaining: ${totalCops - (offset + maxLimit)} cops\n`;
  } else {
    output += `✓ All cops displayed for ${department} department.\n`;
  }

  return output;
}

const server = new Server(
  {
    name: "rubocop-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "rubocop_lint": {
        const { path, auto_correct = false, only, except } = args as {
          path: string;
          auto_correct?: boolean;
          only?: string;
          except?: string;
        };

        // Use auto-lint settings if enabled and auto_correct not explicitly set
        const shouldAutoCorrect = auto_correct || (autoLintEnabled && autoLintAutoCorrect);

        const rubocopArgs = [
          "--format", "json",
        ];

        if (shouldAutoCorrect) {
          rubocopArgs.push("-A");
        }

        if (only) {
          rubocopArgs.push("--only", only);
        }

        if (except) {
          rubocopArgs.push("--except", except);
        }

        rubocopArgs.push(path);

        const { stdout } = await runRubocop(rubocopArgs);
        const result: RubocopResult = JSON.parse(stdout);

        let message = formatOffenses(result);

        // Add auto-lint reminder if enabled
        if (autoLintEnabled && result.summary.offense_count > 0) {
          message += `\n💡 Auto-lint is enabled. Consider running with auto_correct: true to fix issues automatically.`;
        }

        return {
          content: [
            {
              type: "text",
              text: message,
            },
          ],
        };
      }

      case "rubocop_list_cops": {
        const { department, limit = 50, offset = 0 } = args as {
          department?: string;
          limit?: number;
          offset?: number;
        };

        const rubocopArgs = ["--show-cops"];
        const { stdout } = await runRubocop(rubocopArgs);

        // If no department specified, return summary only
        if (!department) {
          // Extract just department info from header to avoid processing all cops
          const lines = stdout.split("\n");
          const departments = new Map<string, number>();
          let totalCops = 0;

          // Parse department headers only (format: "# Department 'Name' (count):")
          for (const line of lines) {
            const deptMatch = line.match(/^# Department '([^']+)' \((\d+)\):/);
            if (deptMatch) {
              const [, deptName, count] = deptMatch;
              departments.set(deptName, parseInt(count, 10));
              totalCops += parseInt(count, 10);
            }
          }

          let output = `RuboCop has ${totalCops} total cops across ${departments.size} departments:\n\n`;

          for (const [dept, count] of Array.from(departments.entries()).sort()) {
            output += `• ${dept}: ${count} cops\n`;
          }

          output += `\n💡 To see cops for a specific department, use the 'department' parameter.\n`;
          output += `   Example: { "department": "Style" }\n`;

          return {
            content: [
              {
                type: "text",
                text: output,
              },
            ],
          };
        }

        // With department filter, extract cops for that department
        return {
          content: [
            {
              type: "text",
              text: formatCopList(stdout, department, limit, offset),
            },
          ],
        };
      }

      case "rubocop_show_cop": {
        const { cop_name } = args as { cop_name: string };

        const rubocopArgs = [
          "--show-cops",
          cop_name,
        ];

        const { stdout } = await runRubocop(rubocopArgs);

        return {
          content: [
            {
              type: "text",
              text: `Details for ${cop_name}:\n\n${stdout}`,
            },
          ],
        };
      }

      case "rubocop_auto_gen_config": {
        const { path = "." } = args as { path?: string };

        const rubocopArgs = [
          "--auto-gen-config",
          path,
        ];

        const { stdout, stderr } = await runRubocop(rubocopArgs);

        return {
          content: [
            {
              type: "text",
              text: `Configuration generated successfully!\n\n${stdout}\n${stderr}`,
            },
          ],
        };
      }

      case "rubocop_set_auto_lint": {
        const { enabled, auto_correct = false } = args as {
          enabled: boolean;
          auto_correct?: boolean;
        };

        autoLintEnabled = enabled;
        autoLintAutoCorrect = auto_correct;

        const status = enabled ? "enabled" : "disabled";
        const autoCorrectMsg = enabled && auto_correct
          ? " with auto-correction"
          : "";

        return {
          content: [
            {
              type: "text",
              text: `✓ Auto-lint has been ${status}${autoCorrectMsg}.\n\n${
                enabled
                  ? "The AI assistant will now be reminded to run RuboCop after generating or modifying Ruby files."
                  : "Auto-lint reminders are now disabled."
              }`,
            },
          ],
        };
      }

      case "rubocop_get_auto_lint_status": {
        const status = autoLintEnabled ? "enabled" : "disabled";
        const autoCorrectStatus = autoLintAutoCorrect ? "enabled" : "disabled";

        return {
          content: [
            {
              type: "text",
              text: `Auto-lint Status:\n\n• Auto-lint: ${status}\n• Auto-correction: ${autoCorrectStatus}\n\n${
                autoLintEnabled
                  ? "📝 The AI assistant should run RuboCop after generating or modifying Ruby files."
                  : "Auto-lint is currently disabled."
              }`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error running RuboCop: ${error.message}\n\nMake sure RuboCop and rubocop-rails are installed:\n  gem install rubocop rubocop-rails`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("RuboCop MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
