# Test Files

Test files and scripts for the RuboCop MCP server.

## Files

### Ruby Test Fixtures

- **style_violations.rb** - Style violations (string concatenation, spacing, conditionals, etc.)
- **rails_violations.rb** - Rails-specific violations (deprecated methods, anti-patterns)
- **test_example.rb** - Legacy sample file with mixed violations

### Test Scripts

- **test-mcp.js** - Direct MCP server test script
- **test-auto-lint.js** - Auto-lint functionality test
- **test-pagination.js** - Pagination test for cop listings

### Configuration

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
rubocop test/style_violations.rb
rubocop test/rails_violations.rb

# With JSON output
rubocop --format json test/style_violations.rb
```

### Via AI Assistant

Ask your AI assistant:

```
Use rubocop_lint to check test/style_violations.rb
Use rubocop_lint to check test/rails_violations.rb
```

## Expected Results

**style_violations.rb** contains:

- String concatenation with `+`
- Missing spaces around operators
- Redundant `return` statements
- Using `or`/`and` instead of `||`/`&&`
- CamelCase method names
- `for` loops instead of `each`

**rails_violations.rb** contains:

- Deprecated `update_attributes` method
- Using `select.first` instead of `find`
- Rails-specific anti-patterns

## Test Scenarios

**Auto-correction:**

```
Use rubocop_lint with auto_correct=true on test/style_violations.rb
```

**Specific cops:**

```
Use rubocop_lint on test/style_violations.rb with only='Style'
Use rubocop_lint on test/rails_violations.rb with only='Rails'
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
