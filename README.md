# RuboCop MCP Server

A Model Context Protocol (MCP) server that provides RuboCop Rails linting capabilities to AI assistants like Claude.

## Features

This MCP server exposes the following tools:

- **rubocop_lint** - Run RuboCop on Ruby files with Rails-specific cops
  - Auto-correction support
  - Filter by specific cops
  - Detailed offense reporting

- **rubocop_list_cops** - List all available RuboCop cops
  - Filter by department (Rails, Style, Lint, etc.)

- **rubocop_show_cop** - Show detailed information about a specific cop
  - Description and examples
  - Configuration options

- **rubocop_auto_gen_config** - Generate .rubocop_todo.yml for gradual adoption

## Prerequisites

You need to have RuboCop and rubocop-rails installed:

```bash
gem install rubocop rubocop-rails
```

Or add to your Gemfile:

```ruby
gem 'rubocop', require: false
gem 'rubocop-rails', require: false
```

## Project Structure

```
rubocop-mcp/
├── src/              # TypeScript source code
│   └── index.ts      # Main MCP server implementation
├── build/            # Compiled JavaScript (generated)
│   └── index.js      # Built server
├── test/             # Test files and scripts
│   ├── .rubocop.yml       # RuboCop config for test fixtures
│   ├── test_example.rb    # Sample Ruby file for testing
│   └── test-mcp.js        # Direct MCP server test script
├── examples/         # Configuration examples
│   ├── claude-desktop-config.json # Claude Desktop MCP config
│   └── rails-rubocop.yml          # Example Rails RuboCop config
├── docs/             # Documentation
│   └── TESTING.md    # Testing guide
├── package.json      # Project configuration
├── yarn.lock         # Dependency lockfile
├── .tool-versions    # asdf Node.js version
└── README.md         # This file
```

**Note:** This is a **Node.js/TypeScript project**. The `.rubocop.yml` in `test/` is only for testing the MCP server functionality. For your Rails projects, see `examples/rails-rubocop.yml`.

## Installation

```bash
# Install dependencies
yarn install

# Build the server
yarn build
```

## Usage

### With Claude Code (CLI)

Add the server:
```bash
claude mcp add --transport stdio rubocop -- node /path/to/rubocop-mcp/build/index.js
```

Verify it's connected:
```bash
claude mcp list
```

### With Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "rubocop": {
      "command": "node",
      "args": ["/absolute/path/to/rubocop-mcp/build/index.js"]
    }
  }
}
```

Restart Claude Desktop after saving the configuration.

### With Cursor

Add to Cursor's MCP settings:

```json
{
  "mcpServers": {
    "rubocop": {
      "command": "node",
      "args": ["/absolute/path/to/rubocop-mcp/build/index.js"]
    }
  }
}
```

**Important**: Use the full absolute path. The `~` shorthand may not work in Cursor, so expand it to your actual home directory (e.g., `/home/username/.local/share/mcp-servers/rubocop/build/index.js`).

Restart Cursor after adding the configuration.

See `examples/` directory for sample configurations.

## Example Usage with Claude

Once configured, you can ask Claude to:

- "Lint this Rails controller with RuboCop"
- "What Rails cops are available?"
- "Show me details about the Rails/ActiveRecordAliases cop"
- "Generate a RuboCop todo config for gradual adoption"
- "Auto-fix all Style violations in this file"
- "Enable RuboCop auto-lint" - Turn on automatic linting reminders
- "Disable RuboCop auto-lint" - Turn off automatic linting reminders

## Development

### Watch mode (auto-recompile on changes)

```bash
yarn watch
```

### Build

```bash
yarn build
```

### Run server directly (for debugging)

```bash
yarn dev
```

### Run tests

```bash
# Test the MCP server directly
node test/test-mcp.js

# Test with RuboCop CLI
rubocop test/test_example.rb
```

## Auto-Lint Feature

The MCP server includes an auto-lint mode that reminds Claude/Cursor to run RuboCop after modifying Ruby files.

**Enable:**
```
Enable RuboCop auto-lint
```

**Enable with auto-correction:**
```
Enable RuboCop auto-lint with auto-correction
```

**Check status:**
```
What's the RuboCop auto-lint status?
```

**Disable:**
```
Disable RuboCop auto-lint
```

See [AUTO_LINT.md](AUTO_LINT.md) for detailed documentation.

## Pagination Support

The `rubocop_list_cops` tool supports pagination to handle large result sets efficiently. When listing cops by department, results are paginated with a default limit of 50 cops per page.

**Example:**
```
List Rails RuboCop cops
```

Returns the first 50 cops and guidance for fetching more.

See [PAGINATION_GUIDE.md](PAGINATION_GUIDE.md) for detailed usage.

## Tools Reference

### rubocop_lint

Runs RuboCop on specified files or directories.

**Parameters:**
- `path` (required): Path to Ruby file or directory
- `auto_correct` (optional): Auto-fix correctable offenses
- `only` (optional): Run only specific cops
- `except` (optional): Exclude specific cops

**Example:**
```json
{
  "path": "app/controllers/users_controller.rb",
  "auto_correct": true,
  "only": "Rails"
}
```

### rubocop_list_cops

Lists available RuboCop cops with pagination support.

**Parameters:**
- `department` (optional): Filter by department (Rails, Style, Lint, etc.)
- `limit` (optional): Maximum number of cops to return (default: 50, max: 200)
- `offset` (optional): Number of cops to skip for pagination (default: 0)

**Examples:**
```json
// Get summary of all departments
{}

// Get first 50 Rails cops
{"department": "Rails"}

// Get next 50 Rails cops
{"department": "Rails", "limit": 50, "offset": 50}

// Get 100 Style cops at a time
{"department": "Style", "limit": 100}
```

### rubocop_show_cop

Shows detailed information about a specific cop.

**Parameters:**
- `cop_name` (required): Name of the cop (e.g., "Rails/ActiveRecordAliases")

### rubocop_auto_gen_config

Generates .rubocop_todo.yml configuration file.

**Parameters:**
- `path` (optional): Directory path (default: current directory)

### rubocop_set_auto_lint

Enable or disable automatic linting reminders.

**Parameters:**
- `enabled` (required): `true` to enable, `false` to disable
- `auto_correct` (optional): Whether to auto-fix issues when linting (default: false)

**Example:**
```json
{
  "enabled": true,
  "auto_correct": true
}
```

### rubocop_get_auto_lint_status

Get the current auto-lint status and configuration.

**Parameters:** None

## Using in Rails Projects

After pushing to GitHub, you can use this MCP server in your Rails projects. See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete instructions.

### Quick Start

```bash
# 1. Install globally
mkdir -p ~/.local/share/mcp-servers
cd ~/.local/share/mcp-servers
git clone https://github.com/YOUR_USERNAME/rubocop-mcp-server.git rubocop
cd rubocop
yarn install && yarn build

# 2. Add to Claude CLI
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js

# 3. Use in your Rails project
cd /path/to/your/rails/project
claude
# Ask: "Lint app/models/user.rb with RuboCop"
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup, troubleshooting, and Rails integration tips.

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## License

MIT
