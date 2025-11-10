# Installation Guide

Complete guide to installing and setting up the RuboCop MCP server.

## Prerequisites

### RuboCop Installation

The MCP server requires RuboCop to be installed on your system.

**Option 1: Global Installation**

```bash
gem install rubocop rubocop-rails
```

**Option 2: Rails Project (Recommended)**

Add to your `Gemfile`:

```ruby
group :development do
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  # Optional but recommended:
  # gem 'rubocop-rspec', require: false
  # gem 'rubocop-performance', require: false
end
```

Then run:

```bash
bundle install
```

### Node.js Requirement

- Node.js >= 20.17.0
- Yarn package manager

## Installation Methods

### Method 1: Global Installation (Recommended)

Install once and use across all Rails projects.

```bash
# 1. Clone to permanent location
mkdir -p ~/.local/share/mcp-servers
cd ~/.local/share/mcp-servers
git clone https://github.com/yourusername/rubocop-mcp.git rubocop
cd rubocop

# 2. Install dependencies and build
yarn install
yarn build
```

### Method 2: Per-Project Installation

Install in each Rails project for project-specific versions.

```bash
# In your Rails project root
mkdir -p .mcp
cd .mcp
git clone https://github.com/yourusername/rubocop-mcp.git rubocop
cd rubocop
yarn install
yarn build
```

### Method 3: Development Installation

For contributing or modifying the server.

```bash
# Clone the repository
git clone https://github.com/yourusername/rubocop-mcp.git
cd rubocop-mcp

# Install dependencies
yarn install

# Build the server
yarn build

# Run in watch mode during development
yarn watch
```

## AI Assistant Configuration

### Claude CLI

**For Global Installation:**

```bash
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js
```

**For Project-Local Installation:**

```bash
# Run from Rails project root
claude mcp add --transport stdio rubocop --scope local -- node .mcp/rubocop/build/index.js
```

**Verify Connection:**

```bash
claude mcp list
```

You should see:

```
rubocop: node /path/to/rubocop/build/index.js
```

### Claude Desktop

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

**Important:** Use the full absolute path. Restart Claude Desktop after saving.

### Cursor

Add to Cursor's MCP settings file:

**macOS/Linux:** `~/.cursor/mcp_settings.json`
**Windows:** `%USERPROFILE%\.cursor\mcp_settings.json`

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

**Important:**

- Use full absolute paths (expand `~` to your home directory)
- Example: `/home/username/.local/share/mcp-servers/rubocop/build/index.js`
- Restart Cursor after adding the configuration

## Verification

### Test the Installation

Start your AI assistant and ask:

```
List all available RuboCop tools
```

You should see the 6 RuboCop MCP tools available.

### Test with a File

Create a test Ruby file or use an existing one:

```
Lint app/models/user.rb
```

If RuboCop is properly configured, you'll get linting results.

## Updating

### Update Global Installation

```bash
cd ~/.local/share/mcp-servers/rubocop
git pull origin main
yarn install
yarn build
```

### Update Project Installation

```bash
cd .mcp/rubocop
git pull origin main
yarn install
yarn build
```

No need to reconfigure your AI assistant after updates.

## Multiple Projects

If using global installation, the MCP server automatically uses each project's RuboCop configuration.

```bash
# Project 1
cd ~/projects/rails-app-1
claude
# Uses rails-app-1/.rubocop.yml

# Project 2
cd ~/projects/rails-app-2
claude
# Uses rails-app-2/.rubocop.yml
```

## Uninstallation

### Remove from Claude CLI

```bash
# Global installation
claude mcp remove rubocop

# Project-local installation
claude mcp remove rubocop --scope local
```

### Remove from Claude Desktop

Remove the `rubocop` entry from your `claude_desktop_config.json` and restart.

### Remove from Cursor

Remove the `rubocop` entry from your `mcp_settings.json` and restart.

### Delete Files

```bash
# Global installation
rm -rf ~/.local/share/mcp-servers/rubocop

# Project installation
rm -rf .mcp/rubocop
```

## Next Steps

- [Configuration Guide](configuration.md) - Set up RuboCop for your project
- [Usage Guide](usage.md) - Learn how to use the tools
- [Troubleshooting](troubleshooting.md) - Fix common issues
