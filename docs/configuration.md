# Configuration Guide

Guide to configuring RuboCop for your Rails projects and customizing the MCP server.

## RuboCop Configuration

### Basic Rails Configuration

Create `.rubocop.yml` in your Rails project root:

```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2 # Match your Ruby version
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'node_modules/**/*'
    - 'vendor/**/*'
    - 'bin/**/*'

plugins:
  - rubocop-rails

Rails:
  Enabled: true
```

### Recommended Rails Configuration

For a more comprehensive setup:

```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2
  Exclude:
    - 'db/schema.rb'
    - 'db/migrate/*'
    - 'node_modules/**/*'
    - 'vendor/**/*'
    - 'bin/**/*'
    - 'tmp/**/*'
    - 'log/**/*'

plugins:
  - rubocop-rails
  # - rubocop-rspec  # Uncomment if using RSpec
  # - rubocop-performance  # Uncomment for performance cops

# Disable class documentation requirement
Style/Documentation:
  Enabled: false

# Allow longer line lengths for Rails
Layout/LineLength:
  Max: 120
  Exclude:
    - 'config/**/*'
    - 'db/**/*'

# Rails-specific settings
Rails:
  Enabled: true

Rails/FilePath:
  Enabled: false # Can be too strict with nested modules

# Metrics
Metrics/BlockLength:
  Exclude:
    - 'config/**/*'
    - 'spec/**/*'
    - 'test/**/*'

Metrics/MethodLength:
  Max: 15
  Exclude:
    - 'db/migrate/*'
```

### Copy Example Configuration

Use the provided example configuration:

```bash
cp examples/rails-rubocop.yml .rubocop.yml
```

Then customize it for your project's needs.

## Gradual Adoption

For existing projects with many violations, use the todo file approach:

### Generate Todo File

Ask your AI assistant:

```
Generate a RuboCop todo configuration
```

Or use the tool directly:

```
Use rubocop_auto_gen_config
```

This creates `.rubocop_todo.yml` with all current offenses disabled.

### Use Todo File

Update your `.rubocop.yml`:

```yaml
inherit_from: .rubocop_todo.yml

AllCops:
  NewCops: enable
  TargetRubyVersion: 3.2

plugins:
  - rubocop-rails
```

### Enable Cops Gradually

1. Pick a cop from `.rubocop_todo.yml`
2. Remove it from the todo file
3. Fix violations in your codebase
4. Repeat for the next cop

## Per-Environment Configuration

### Development Only

In `Gemfile`:

```ruby
group :development do
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
end
```

### CI/CD Integration

In your CI workflow:

```yaml
- name: Run RuboCop
  run: bundle exec rubocop --parallel
```

## Project-Specific MCP Configuration

### Claude CLI Local Config

Create `.claude.json` in your project:

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

### Directory-Specific Settings

For monorepos or multi-project setups, each directory can have its own `.rubocop.yml`:

```
monorepo/
├── .rubocop.yml           # Root config
├── app1/
│   └── .rubocop.yml       # App1-specific config
└── app2/
    └── .rubocop.yml       # App2-specific config
```

## Auto-Lint Configuration

Enable automatic linting reminders:

```
Enable RuboCop auto-lint with auto-correction
```

This configures the MCP server to remind your AI assistant to run RuboCop after modifying Ruby files.

See [Auto-Lint Feature](features/auto-lint.md) for details.

## Custom Cop Configuration

### Disable Specific Cops

```yaml
Style/StringLiterals:
  Enabled: false
```

### Configure Cop Behavior

```yaml
Style/StringLiterals:
  EnforcedStyle: single_quotes

Metrics/MethodLength:
  Max: 20
  CountComments: false
```

### Exclude Specific Files

```yaml
Style/Documentation:
  Exclude:
    - 'app/controllers/**/*'
    - 'app/helpers/**/*'
```

## Department-Specific Configuration

### Rails Department

```yaml
Rails:
  Enabled: true

Rails/HasManyOrHasOneDependent:
  Enabled: true

Rails/InverseOf:
  Enabled: false # Can be too strict
```

### Style Department

```yaml
Style/Documentation:
  Enabled: false

Style/FrozenStringLiteralComment:
  Enabled: true
  EnforcedStyle: always
```

### Lint Department

```yaml
Lint/UnusedMethodArgument:
  AllowUnusedKeywordArguments: true

Lint/AmbiguousBlockAssociation:
  Exclude:
    - 'spec/**/*'
```

## Version Managers

### Using asdf

Create `.tool-versions` in your project:

```
ruby 3.2.0
nodejs 20.17.0
```

### Using rbenv

Create `.ruby-version`:

```
3.2.0
```

The MCP server will use whatever Ruby version is active in your project.

## Team Configuration

### Shared Configuration

Commit `.rubocop.yml` to version control:

```bash
git add .rubocop.yml
git commit -m "Add RuboCop configuration"
```

### Todo File

You can choose to:

**Option 1:** Commit `.rubocop_todo.yml` (team shares the same baseline)

```bash
git add .rubocop_todo.yml
git commit -m "Add RuboCop todo baseline"
```

**Option 2:** Ignore it (each developer generates their own)

```bash
echo ".rubocop_todo.yml" >> .gitignore
```

## Advanced Configuration

### Custom Require Paths

```yaml
require:
  - ./lib/custom_cop.rb

AllCops:
  NewCops: enable
```

### Inherit from Remote Config

```yaml
inherit_from:
  - https://raw.githubusercontent.com/org/style-guide/main/.rubocop.yml

AllCops:
  TargetRubyVersion: 3.2
```

### Multiple Inheritance

```yaml
inherit_from:
  - .rubocop_todo.yml
  - .rubocop_custom.yml

AllCops:
  NewCops: enable
```

## Configuration Examples

See the [examples](../examples/) directory for:

- `rails-rubocop.yml` - Comprehensive Rails configuration
- `claude-desktop-config.json` - Claude Desktop MCP configuration

## Next Steps

- [Usage Guide](usage.md) - Learn how to use the tools
- [API Reference](api-reference.md) - Complete tool documentation
- [Auto-Lint Feature](features/auto-lint.md) - Automatic linting setup
