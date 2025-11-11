#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { formatError, UnknownToolError } from './errors/rubocop.errors.js';
import { isValidToolName, toolHandlers } from './handlers/tool.handlers.js';
import { TOOLS } from './tools.js';

const SERVER_INFO = {
  name: 'rubocop-mcp-server',
  version: '0.1.0',
};

/**
 * Initialize MCP Server
 */
const server = new Server(SERVER_INFO, {
  capabilities: {
    tools: {},
  },
});

/**
 * Handler: List Available Tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (!isValidToolName(name)) {
      throw new UnknownToolError(name);
    }

    const handler = toolHandlers[name];

    return await handler(args as never);
  } catch (error: unknown) {
    return {
      content: [
        {
          type: 'text',
          text: formatError(error),
        },
      ],
      isError: true,
    };
  }
});

async function startServer(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('RuboCop MCP Server running on stdio');
}

/**
 * Application Entry Point
 */
startServer().catch((error) => {
  console.error('Fatal error during server startup:', error);
  process.exit(1);
});
