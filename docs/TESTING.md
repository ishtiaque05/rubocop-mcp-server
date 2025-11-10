# Testing the RuboCop MCP Server

## Setup Complete! ✓

Your RuboCop MCP server is now installed and connected to Claude Code.

## What We Did

1. **Switched to yarn**: Removed npm artifacts and installed with yarn
2. **Created .tool-versions**: Set Node.js 24.4.1 via asdf
3. **Added MCP server**: Registered with Claude Code using `claude mcp add`
4. **Updated RuboCop config**: Changed from `require:` to `plugins:` for rubocop-rails
5. **Created test file**: `test_example.rb` with intentional style violations

## MCP Server Status

```bash
$ claude mcp list
rubocop: node /path/to/rubocop-mcp/build/index.js - ✓ Connected
```

## How to Test

### Test 1: Lint the Example File

Ask Claude in this conversation:

> "Use the rubocop_lint tool to check test_example.rb for style violations"

**Expected output**: Should find 7 offenses including:

- Missing frozen string literal comment
- `update_attributes` should be `update`
- Missing spaces around operators
- Useless variable assignments
- Double quotes should be single quotes

### Test 2: Auto-fix Issues

Ask Claude:

> "Use rubocop_lint to auto-fix the issues in test_example.rb"

**Expected**: Claude will run with `auto_correct: true` and fix correctable offenses

### Test 3: List Rails Cops

Ask Claude:

> "Use rubocop_list_cops to show all Rails-specific cops"

**Expected**: List of all Rails cops like:

- Rails/ActiveRecordAliases
- Rails/HasManyOrHasOneDependent
- Rails/SkipsModelValidations
- etc.

### Test 4: Show Cop Details

Ask Claude:

> "Use rubocop_show_cop to get details about Rails/ActiveRecordAliases"

**Expected**: Detailed info about that specific cop

### Test 5: Generate Todo Config

Ask Claude:

> "Use rubocop_auto_gen_config to generate a .rubocop_todo.yml file"

**Expected**: Creates a config file with all current offenses disabled

## Available MCP Tools

Your Claude instance now has access to these tools:

1. **rubocop_lint** - Lint Ruby/Rails files
   - Parameters: `path`, `auto_correct`, `only`, `except`

2. **rubocop_list_cops** - List available cops
   - Parameters: `department` (optional)

3. **rubocop_show_cop** - Show cop details
   - Parameters: `cop_name`

4. **rubocop_auto_gen_config** - Generate .rubocop_todo.yml
   - Parameters: `path` (optional)

## Test File Location

`test/test_example.rb`

## Manual Testing (without Claude)

You can also test RuboCop directly:

```bash
# Lint the test file
rubocop test_example.rb

# Lint with JSON output
rubocop --format json test_example.rb

# Auto-fix issues
rubocop -A test_example.rb

# List all cops
rubocop --show-cops

# Show specific cop
rubocop --show-cops Rails/ActiveRecordAliases
```

## Troubleshooting

### MCP server not connected

```bash
# Rebuild the server
yarn build

# Check status
claude mcp list

# Remove and re-add if needed
claude mcp remove rubocop -s local
claude mcp add --transport stdio rubocop -- node /path/to/rubocop-mcp/build/index.js
```

### RuboCop errors

```bash
# Check RuboCop is installed
which rubocop
rubocop --version

# Check rubocop-rails is installed
gem list | grep rubocop
```

## Next Steps

1. Try all the test cases above by asking Claude
2. Create your own Ruby files with issues and test them
3. Try filtering cops: "Lint only the Rails cops in this file"
4. Experiment with auto-correction on real projects

## What's Happening Behind the Scenes

When you ask Claude to use a tool:

```
You: "Lint test_example.rb"
  ↓
Claude: Calls rubocop_lint tool via MCP
  ↓
MCP Server: Executes `rubocop --format json test_example.rb`
  ↓
RuboCop: Analyzes the file, outputs JSON
  ↓
MCP Server: Parses JSON, formats it nicely
  ↓
Claude: Shows you the results
```

Have fun testing! 🚀
