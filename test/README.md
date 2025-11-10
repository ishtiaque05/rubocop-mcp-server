# Test Files

Test files and scripts for the RuboCop MCP server.

## Files

- **test_example.rb** - Sample Ruby file with intentional violations for testing
- **test-mcp.js** - Direct MCP server test script
- **.rubocop.yml** - RuboCop configuration for test fixtures

## Purpose

These files test the MCP server functionality. The MCP server itself is a Node.js/TypeScript project.

## Running Tests

### Direct MCP Test

```bash
node test/test-mcp.js
```

### RuboCop CLI Test

```bash
# From project root
rubocop test/test_example.rb

# With JSON output
rubocop --format json test/test_example.rb
```

### Via AI Assistant

Ask your AI assistant:

```
Use rubocop_lint to check test/test_example.rb
```

## Expected Results

The test file contains intentional violations:

- Missing frozen string literal comment
- Deprecated `update_attributes` method
- Missing spaces around operators
- Useless variable assignments
- String literal style issues

You should see approximately 7 offenses when linting this file.

## Test Scenarios

**Auto-correction:**

```
Use rubocop_lint with auto_correct=true on test/test_example.rb
```

**Specific cops:**

```
Use rubocop_lint on test/test_example.rb with only='Style'
```

**List cops:**

```
Use rubocop_list_cops with department='Rails'
```

**Show cop details:**

```
Use rubocop_show_cop for Rails/ActiveRecordAliases
```

See [Development Guide](../docs/development.md) for more testing information.
