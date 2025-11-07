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
      "List all available RuboCop cops (including Rails-specific cops) with their descriptions. Optionally filter by department (e.g., 'Rails', 'Style', 'Lint').",
    inputSchema: {
      type: "object",
      properties: {
        department: {
          type: "string",
          description:
            "Filter cops by department (e.g., 'Rails', 'Style', 'Lint', 'Metrics')",
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

function formatCopList(stdout: string, department?: string): string {
  const lines = stdout.trim().split("\n");
  const filter = department ? department.toLowerCase() : null;

  let output = department
    ? `RuboCop Cops (${department} department):\n\n`
    : "RuboCop Cops:\n\n";

  for (const line of lines) {
    if (!line.trim()) continue;

    if (filter) {
      const copDept = line.split("/")[0];
      if (copDept.toLowerCase() !== filter) continue;
    }

    output += `• ${line}\n`;
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

        const rubocopArgs = [
          "--format", "json",
        ];

        if (auto_correct) {
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

        return {
          content: [
            {
              type: "text",
              text: formatOffenses(result),
            },
          ],
        };
      }

      case "rubocop_list_cops": {
        const { department } = args as { department?: string };

        const rubocopArgs = [
          "--show-cops",
        ];

        if (department) {
          rubocopArgs.push(department);
        }

        const { stdout } = await runRubocop(rubocopArgs);

        return {
          content: [
            {
              type: "text",
              text: formatCopList(stdout, department),
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
