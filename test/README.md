# Test Files

This directory contains test files and scripts for the RuboCop MCP server.

## Files

- **test_example.rb** - Sample Ruby file with intentional style violations for testing
- **test-mcp.js** - Node.js script to test the MCP server directly
- **.rubocop.yml** - RuboCop config for testing (applies to test_example.rb only)

## Purpose

These files exist to **test the MCP server functionality**, not as part of the main project.
The MCP server itself is a Node.js/TypeScript project.

## Running Tests

### Test the MCP server directly

```bash
# From project root
node test/test-mcp.js
```

### Test with RuboCop CLI

```bash
# From project root
rubocop test/test_example.rb

# Or from test directory
cd test
rubocop test_example.rb
```

### Test via Claude Code

Ask Claude to lint the test file:

```
Use rubocop_lint to check test/test_example.rb
```
