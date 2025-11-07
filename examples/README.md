# Example Configurations

This directory contains example configuration files.

## Files

- **claude-desktop-config.json** - Example MCP config for Claude Desktop
- **rails-rubocop.yml** - Example RuboCop config for Rails projects

## Usage

### For Claude Desktop

Add the configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Copy the `mcpServers` section from `claude-desktop-config.json` and update the path to your installation directory.

### For Claude Code (CLI)

Claude Code users should use the `claude mcp add` command instead:

```bash
# Global installation
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js

# Project-local installation
claude mcp add --transport stdio rubocop --scope local -- node /path/to/rubocop-mcp/build/index.js
```

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete setup instructions.

### For Rails Projects

Copy the example RuboCop config to your Rails project:

```bash
cp examples/rails-rubocop.yml /path/to/your/rails-project/.rubocop.yml
```

Then customize it for your project's needs.
