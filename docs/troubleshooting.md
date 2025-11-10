# Troubleshooting Guide

Common issues and solutions when using the RuboCop MCP server.

## Connection Issues

### MCP Server Not Connected

**Symptoms:**

- AI assistant doesn't recognize RuboCop tools
- Tools list doesn't show rubocop tools

**Solutions:**

**Check connection status:**

```bash
claude mcp list
```

**If missing, re-add the server:**

```bash
# Global installation
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js

# Project-local installation
claude mcp add --transport stdio rubocop --scope local -- node .mcp/rubocop/build/index.js
```

**For Claude Desktop:**

- Check config file path is correct
- Use absolute paths (not `~`)
- Restart Claude Desktop after config changes

**For Cursor:**

- Expand `~` to full home directory path
- Restart Cursor after config changes

### Server Crashes on Startup

**Check Node.js version:**

```bash
node --version  # Should be >= 20.17.0
```

**Rebuild the server:**

```bash
cd ~/.local/share/mcp-servers/rubocop
yarn install
yarn build
```

**Check for errors:**

```bash
node build/index.js
```

## RuboCop Issues

### RuboCop Not Found

**Error:**

```
Error: RuboCop is not installed or not in PATH
```

**Solutions:**

**Check if RuboCop is installed:**

```bash
which rubocop
rubocop --version
```

**If not installed:**

```bash
# Global installation
gem install rubocop rubocop-rails

# Project installation
bundle install
```

**Check PATH:**

```bash
echo $PATH | grep .gem
```

Make sure your gem bin directory is in PATH.

**For rbenv users:**

```bash
rbenv rehash
```

**For asdf users:**

```bash
asdf reshim ruby
```

### Wrong Ruby Version

**Symptoms:**

- RuboCop runs but uses wrong Ruby version
- Gems not found

**Solutions:**

**Check active Ruby version:**

```bash
# For rbenv
rbenv version

# For asdf
asdf current ruby

# For rvm
rvm current
```

**Ensure correct version is active:**

```bash
cd /path/to/your/project

# For rbenv (reads .ruby-version)
rbenv local 3.2.0

# For asdf (reads .tool-versions)
asdf local ruby 3.2.0
```

**Restart your AI assistant after changing Ruby version.**

### RuboCop Rails Plugin Not Found

**Error:**

```
Error: Unable to load 'rubocop-rails'
```

**Solutions:**

**Install the plugin:**

```bash
gem install rubocop-rails

# Or in your Gemfile
# gem 'rubocop-rails', require: false
bundle install
```

**Check your `.rubocop.yml`:**

```yaml
plugins:
  - rubocop-rails # Not 'require:'
```

## Configuration Issues

### Invalid RuboCop Configuration

**Error:**

```
Error: Invalid configuration in .rubocop.yml
```

**Solutions:**

**Validate your configuration:**

```bash
rubocop --debug
```

**Common mistakes:**

```yaml
# Bad - 'require:' is deprecated
require:
  - rubocop-rails

# Good - use 'plugins:'
plugins:
  - rubocop-rails
```

**Test configuration:**

```bash
rubocop --show-cops
```

If this works, your configuration is valid.

### Configuration Not Found

**Symptoms:**

- RuboCop runs with default config
- Project-specific rules not applied

**Solutions:**

**Ensure you're in the project directory:**

```bash
pwd  # Should be your Rails project root
ls -la .rubocop.yml  # Should exist
```

**Start your AI assistant from project root:**

```bash
cd /path/to/project
claude
```

**Create `.rubocop.yml` if missing:**

```bash
cp examples/rails-rubocop.yml .rubocop.yml
```

## Path Issues

### Absolute vs Relative Paths

**Symptoms:**

- Server works in terminal but not in AI assistant
- "Path not found" errors

**Solutions:**

**Use absolute paths in config files:**

```json
{
  "mcpServers": {
    "rubocop": {
      "command": "node",
      "args": ["/home/username/.local/share/mcp-servers/rubocop/build/index.js"]
    }
  }
}
```

**Don't use `~` shorthand:**

```json
// Bad
"args": ["~/.local/share/mcp-servers/rubocop/build/index.js"]

// Good
"args": ["/home/username/.local/share/mcp-servers/rubocop/build/index.js"]
```

**Get absolute path:**

```bash
readlink -f ~/.local/share/mcp-servers/rubocop/build/index.js
```

### File Not Found Errors

**Error:**

```
Error: Path does not exist: app/models/user.rb
```

**Solutions:**

**Check current directory:**

```bash
pwd
```

**Use correct relative paths from project root:**

```
Lint app/models/user.rb  # From project root
```

**Or use absolute paths:**

```
Lint /full/path/to/app/models/user.rb
```

## Permission Issues

### EACCES Permission Denied

**Error:**

```
Error: EACCES: permission denied
```

**Solutions:**

**Check file permissions:**

```bash
ls -la ~/.local/share/mcp-servers/rubocop/build/index.js
```

**Fix permissions:**

```bash
chmod +x ~/.local/share/mcp-servers/rubocop/build/index.js
```

**Check directory permissions:**

```bash
ls -la ~/.local/share/mcp-servers/
chmod 755 ~/.local/share/mcp-servers/rubocop
```

## Performance Issues

### Slow Linting

**Symptoms:**

- RuboCop takes a long time to run
- Timeout errors

**Solutions:**

**Lint specific files instead of directories:**

```
Lint app/models/user.rb  # Fast
```

Instead of:

```
Lint app/models/  # Slower
```

**Exclude unnecessary files in `.rubocop.yml`:**

```yaml
AllCops:
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'node_modules/**/*'
    - 'vendor/**/*'
```

**Use gradual adoption for large projects:**

```
Generate RuboCop todo configuration
```

### Memory Issues

**Error:**

```
JavaScript heap out of memory
```

**Solutions:**

**Increase Node.js memory:**

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
claude mcp add --transport stdio rubocop -- node ~/.local/share/mcp-servers/rubocop/build/index.js
```

**Or lint smaller sections:**

```
Lint app/models/*.rb  # Instead of entire app/
```

## Auto-Lint Issues

### Auto-Lint Not Working

**Symptoms:**

- AI doesn't automatically lint files
- No linting reminders

**Solutions:**

**Check auto-lint status:**

```
What's the RuboCop auto-lint status?
```

**Enable if disabled:**

```
Enable RuboCop auto-lint
```

**Remember:**

- Auto-lint provides _reminders_, not forced execution
- AI decides when to run based on context
- You can always explicitly ask: "Lint this file"

### Auto-Fix Breaking Code

**Symptoms:**

- Auto-fixed code doesn't work
- Tests fail after auto-fix

**Solutions:**

**Disable auto-correction for logic-related cops:**

```yaml
# In .rubocop.yml
Lint:
  AutoCorrect: false

Rails:
  AutoCorrect: false
```

**Use auto-fix only for style:**

```
Auto-fix only Style violations
```

**Review changes before committing:**

```bash
git diff
```

## Pagination Issues

### Not Seeing All Cops

**Symptoms:**

- Cop list seems incomplete
- Can't find a specific cop

**Solutions:**

**Request more results:**

```
Show more Rails cops (next page)
```

**Or increase limit:**

```
List Rails cops with limit 100
```

**See all departments first:**

```
List all RuboCop departments
```

Then drill into specific department.

See [Pagination Guide](features/pagination.md) for details.

## Gem Conflicts

### Bundler Version Conflicts

**Error:**

```
Error: Bundler version mismatch
```

**Solutions:**

**Use bundle exec:**

```bash
# The MCP server should use:
bundle exec rubocop
```

**Update Bundler:**

```bash
gem update bundler
bundle install
```

### RuboCop Version Conflicts

**Error:**

```
Error: RuboCop version X required, but Y installed
```

**Solutions:**

**Check installed version:**

```bash
rubocop --version
```

**Update RuboCop:**

```bash
gem update rubocop rubocop-rails
```

**Or in your project:**

```bash
bundle update rubocop rubocop-rails
```

## Debugging

### Enable Debug Output

**For RuboCop:**

```bash
rubocop --debug app/models/user.rb
```

**For Node.js:**

```bash
NODE_DEBUG=* node build/index.js
```

### Check MCP Communication

**Test server directly:**

```bash
node build/index.js
```

Should start without errors.

**Check Claude CLI logs:**

```bash
# Location varies by platform
~/.claude/logs/
```

## Platform-Specific Issues

### macOS Issues

**Command not found: rubocop**

```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="$HOME/.gem/ruby/X.X.X/bin:$PATH"
```

**Permission denied on /usr/local**

```bash
# Use user gem directory
gem install --user-install rubocop rubocop-rails
```

### Linux Issues

**Snap or system Ruby conflicts**

```bash
# Use rbenv or asdf for Ruby version management
# Avoid system Ruby for development
```

### Windows Issues

**Path separators**

Use forward slashes in configs:

```json
"args": ["C:/Users/username/.local/share/mcp-servers/rubocop/build/index.js"]
```

**Git Bash vs PowerShell**

Commands may differ. Use Git Bash for consistency with Unix-like commands.

## Still Having Issues?

### Collect Debug Information

```bash
# System info
node --version
ruby --version
gem list | grep rubocop

# MCP status
claude mcp list

# RuboCop test
rubocop --version
rubocop --show-cops | head

# Server test
cd ~/.local/share/mcp-servers/rubocop
node build/index.js
```

### Get Help

1. Check [GitHub Issues](https://github.com/yourusername/rubocop-mcp/issues)
2. Search existing issues
3. Create new issue with debug information
4. Include error messages and steps to reproduce

### Workarounds

**If MCP server fails, use RuboCop directly:**

```bash
rubocop app/models/user.rb --format json
```

**Or ask your AI assistant to run shell commands:**

```
Run: rubocop app/models/user.rb
```

## Next Steps

- [Installation Guide](installation.md) - Reinstall if needed
- [Configuration Guide](configuration.md) - Fix configuration issues
- [Usage Guide](usage.md) - Learn proper usage patterns
- [Development Guide](development.md) - Report bugs or contribute fixes
