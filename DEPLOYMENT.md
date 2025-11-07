# Deployment & Usage Guide

This guide covers how to push this MCP server to GitHub and use it in your Rails projects with Claude CLI.

## Step 1: Push to GitHub

### Initialize Git Repository

```bash
# In the rubocop-mcp directory
git init
git add .
git commit -m "Initial commit: RuboCop MCP server"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `rubocop-mcp-server`)
3. Don't initialize with README (we already have one)

### Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/rubocop-mcp-server.git
git branch -M main
git push -u origin main
```

## Step 2: Install in Your System

You have two options:

### Option A: Global Installation (Recommended)

Install once and use across all Rails projects.

```bash
# Clone to a permanent location
mkdir -p ~/.local/share/mcp-servers
cd ~/.local/share/mcp-servers
git clone https://github.com/YOUR_USERNAME/rubocop-mcp-server.git rubocop
cd rubocop

# Install and build
yarn install
yarn build
```

### Option B: Per-Project Installation

Install in each Rails project (useful if different projects need different versions).

```bash
# In your Rails project root
git clone https://github.com/YOUR_USERNAME/rubocop-mcp-server.git .mcp/rubocop
cd .mcp/rubocop
yarn install
yarn build
```

## Step 3: Configure Claude CLI

### For Global Installation

Add the MCP server globally (works in all projects):

```bash
# Add to your global Claude config
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js
```

Verify it's connected:
```bash
claude mcp list
```

### For Per-Project Installation

Add as a project-specific MCP server:

```bash
# In your Rails project root
claude mcp add --transport stdio rubocop --scope local -- node .mcp/rubocop/build/index.js
```

This creates a `.claude.json` file in your project.

## Step 4: Use in Your Rails Project

### Basic Usage

Start Claude CLI in your Rails project:

```bash
cd /path/to/your/rails/project
claude
```

Then ask Claude:

```
Lint app/models/user.rb with RuboCop
```

```
Check app/controllers for Rails cop violations
```

```
Auto-fix style issues in app/services/user_service.rb
```

### Example Commands

**Lint a single file:**
```
Use rubocop_lint to check app/models/user.rb
```

**Lint with auto-fix:**
```
Use rubocop_lint with auto_correct=true on app/controllers/users_controller.rb
```

**Lint only Rails cops:**
```
Use rubocop_lint on app/models with only='Rails'
```

**List all Rails cops:**
```
Use rubocop_list_cops with department='Rails'
```

**Check specific cop details:**
```
Use rubocop_show_cop for Rails/HasManyOrHasOneDependent
```

**Generate .rubocop_todo.yml:**
```
Use rubocop_auto_gen_config for gradual RuboCop adoption
```

## Step 5: Configure RuboCop in Your Rails Project

Make sure your Rails project has RuboCop configured:

### Add to Gemfile

```ruby
group :development do
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  # Optional but recommended:
  # gem 'rubocop-rspec', require: false
  # gem 'rubocop-performance', require: false
end
```

### Install gems

```bash
bundle install
```

### Create .rubocop.yml

**Option 1: Use the example config (recommended)**

```bash
# Copy the example Rails config from the MCP server repo
cp ~/.local/share/mcp-servers/rubocop/examples/rails-rubocop.yml .rubocop.yml
```

**Option 2: Create manually**

```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2  # Match your Ruby version
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'node_modules/**/*'
    - 'vendor/**/*'
    - 'bin/**/*'

plugins:
  - rubocop-rails
  # - rubocop-rspec  # If you have it

# Add any custom configurations here
Style/Documentation:
  Enabled: false  # Example: disable class documentation requirement

Rails:
  Enabled: true
```

See `examples/rails-rubocop.yml` in this repo for a more comprehensive Rails configuration.

## Updating the MCP Server

### For Global Installation

```bash
cd ~/.local/share/mcp-servers/rubocop
git pull origin main
yarn install
yarn build
```

### For Per-Project Installation

```bash
cd .mcp/rubocop
git pull origin main
yarn install
yarn build
```

## Troubleshooting

### MCP Server Not Connected

Check status:
```bash
claude mcp list
```

If not showing, re-add:
```bash
# For global
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js

# For project-local
claude mcp add --transport stdio rubocop --scope local -- node .mcp/rubocop/build/index.js
```

### RuboCop Not Found

Make sure RuboCop is installed in your Rails project:
```bash
bundle exec rubocop --version
```

If not installed, add to Gemfile and run `bundle install`.

### Path Issues

The MCP server needs to run in your project directory to find `.rubocop.yml` and `Gemfile`.

Make sure you're running Claude CLI from your Rails project root:
```bash
cd /path/to/rails/project
claude
```

### Wrong Ruby Version

If using asdf or rbenv, make sure the correct Ruby version is active:

```bash
# For asdf
asdf current ruby

# For rbenv
rbenv version
```

The MCP server uses whatever RuboCop is in your PATH, which should match your project's Ruby version.

## Advanced Configuration

### Project-Specific MCP Config

Create `.mcp.json` in your Rails project:

```json
{
  "mcpServers": {
    "rubocop": {
      "command": "node",
      "args": [".mcp/rubocop/build/index.js"]
    }
  }
}
```

This allows per-project MCP server configuration.

### Multiple Rails Projects

If you have multiple Rails projects, use the global installation method. The MCP server will automatically use each project's `.rubocop.yml` configuration when you run it from that project directory.

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

## Tips for Rails Development

### Common Workflows

**1. Before committing:**
```
Lint all files I changed with RuboCop and auto-fix what you can
```

**2. Working on a specific file:**
```
Check app/models/user.rb for any Rails-specific issues
```

**3. Refactoring:**
```
Run RuboCop on app/services/ and show me the most critical issues
```

**4. Code review:**
```
Lint this controller and explain any violations
```

### Integration with Git Hooks

You can also run RuboCop in git hooks, but Claude with the MCP server is great for:
- Interactive feedback
- Explaining why violations matter
- Suggesting fixes in context
- Learning RuboCop rules

## Next Steps

1. ✅ Push to GitHub
2. ✅ Install globally or per-project
3. ✅ Configure Claude CLI
4. ✅ Configure RuboCop in your Rails project
5. ✅ Start using in development

Enjoy using RuboCop with Claude! 🚀
