#!/usr/bin/env node

// Quick test script to verify MCP server works
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

async function test() {
  const transport = new StdioClientTransport({
    command: "node",
    args: [resolve(projectRoot, "build/index.js")],
  });

  const client = new Client({
    name: "test-client",
    version: "1.0.0",
  }, {
    capabilities: {},
  });

  await client.connect(transport);

  // List available tools
  const tools = await client.listTools();
  console.log("Available tools:", JSON.stringify(tools, null, 2));

  // Test rubocop_lint
  console.log("\nTesting rubocop_lint on test/test_example.rb...\n");
  const result = await client.callTool({
    name: "rubocop_lint",
    arguments: {
      path: "test/test_example.rb",
    },
  });

  console.log("Result:", JSON.stringify(result, null, 2));

  await client.close();
}

test().catch(console.error);
