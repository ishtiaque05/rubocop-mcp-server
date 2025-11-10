# Configuration Examples

Example configuration files for the RuboCop MCP server.

## Files

### claude-desktop-config.json

Example MCP server configuration for Claude Desktop.

**Usage:**

1. Locate your Claude Desktop config file:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux:** `~/.config/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the `mcpServers` section from the example
3. Update the path to your installation directory
4. Restart Claude Desktop

**Important:** Use absolute paths, not `~` shorthand.

### rails-rubocop.yml

Comprehensive RuboCop configuration for Rails projects.

**Usage:**

```bash
# Copy to your Rails project
cp examples/rails-rubocop.yml /path/to/your/rails-project/.rubocop.yml

# Customize for your needs
vim /path/to/your/rails-project/.rubocop.yml
```

**Features:**

- Rails-specific cops enabled
- Sensible defaults for Rails projects
- Common exclusions (migrations, schema, etc.)
- Relaxed metrics for Rails patterns
- Documentation cop disabled
- Line length: 120 characters

## For Different Environments

### Claude CLI

Use the `claude mcp add` command instead of config files:

```bash
# Global installation
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js

# Project-local installation
claude mcp add --transport stdio rubocop --scope local -- node /path/to/rubocop-mcp/build/index.js
```

See [Installation Guide](../docs/installation.md) for details.

### Cursor

Add to `~/.cursor/mcp_settings.json`:

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

**Important:** Use full absolute paths (expand `~`).

## Customization

### Basic Rails Setup

```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2

plugins:
  - rubocop-rails

Rails:
  Enabled: true
```

### With Additional Plugins

```yaml
plugins:
  - rubocop-rails
  - rubocop-rspec
  - rubocop-performance

Rails:
  Enabled: true

RSpec:
  Enabled: true
```

### Gradual Adoption

```yaml
inherit_from: .rubocop_todo.yml

AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2

plugins:
  - rubocop-rails
```

Generate `.rubocop_todo.yml` with:

```
Generate RuboCop todo configuration
```

## Additional Resources

- [Configuration Guide](../docs/configuration.md) - Detailed configuration instructions
- [RuboCop Documentation](https://docs.rubocop.org/rubocop/configuration.html)
- [rubocop-rails Guide](https://docs.rubocop.org/rubocop-rails/)
