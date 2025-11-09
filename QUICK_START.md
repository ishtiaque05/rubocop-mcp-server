# Quick Start Guide

Ultra-condensed guide to get up and running fast.

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: RuboCop MCP server"
git remote add origin https://github.com/YOUR_USERNAME/rubocop-mcp-server.git
git branch -M main
git push -u origin main
```

## 2. Install Globally

```bash
mkdir -p ~/.local/share/mcp-servers
cd ~/.local/share/mcp-servers
git clone https://github.com/YOUR_USERNAME/rubocop-mcp-server.git rubocop
cd rubocop
yarn install
yarn build
```

## 3. Add to Your AI Assistant

### Option A: Claude CLI

```bash
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js
```

Verify:
```bash
claude mcp list
```

### Option B: Cursor

Add to Cursor's MCP settings:

```json
{
  "mcpServers": {
    "rubocop": {
      "command": "node",
      "args": ["~/.local/share/mcp-servers/rubocop/build/index.js"]
    }
  }
}
```

**Note**: Use the absolute path (expand `~` to your home directory, e.g., `/home/username/.local/share/mcp-servers/rubocop/build/index.js`)

Restart Cursor after adding the configuration.

### Option C: Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `~/.config/Claude/claude_desktop_config.json` (Linux):

```json
{
  "mcpServers": {
    "rubocop": {
      "command": "node",
      "args": ["/absolute/path/to/.local/share/mcp-servers/rubocop/build/index.js"]
    }
  }
}
```

Restart Claude Desktop after adding the configuration.

## 4. Configure Your Rails Project

Add to `Gemfile`:
```ruby
group :development do
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
end
```

Install:
```bash
bundle install
```

Create `.rubocop.yml`:
```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2

plugins:
  - rubocop-rails
```

## 5. Use It!

```bash
cd /path/to/your/rails/project
claude
```

Ask Claude:
- "Lint app/models/user.rb"
- "Check app/controllers for Rails violations"
- "Auto-fix style issues in this file"
- "List all Rails cops"

## Updating

```bash
cd ~/.local/share/mcp-servers/rubocop
git pull
yarn install
yarn build
```

## Common Issues

**MCP server not connected?**
```bash
claude mcp list
# If missing, re-add with the command from step 3
```

**RuboCop not found?**
```bash
cd your-rails-project
bundle install
```

That's it! See [DEPLOYMENT.md](DEPLOYMENT.md) for full details.
