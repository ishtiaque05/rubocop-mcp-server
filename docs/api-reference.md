# API Reference

Complete reference for all RuboCop MCP server tools.

## Overview

The RuboCop MCP server exposes 6 tools through the Model Context Protocol:

| Tool                                                          | Purpose                             |
| ------------------------------------------------------------- | ----------------------------------- |
| [rubocop_lint](#rubocop_lint)                                 | Run RuboCop on files or directories |
| [rubocop_list_cops](#rubocop_list_cops)                       | List available RuboCop cops         |
| [rubocop_show_cop](#rubocop_show_cop)                         | Show detailed cop information       |
| [rubocop_auto_gen_config](#rubocop_auto_gen_config)           | Generate `.rubocop_todo.yml`        |
| [rubocop_set_auto_lint](#rubocop_set_auto_lint)               | Configure auto-lint mode            |
| [rubocop_get_auto_lint_status](#rubocop_get_auto_lint_status) | Check auto-lint status              |

## rubocop_lint

Run RuboCop on specified files or directories with Rails-specific cops.

### Parameters

| Parameter      | Type    | Required | Description                                              |
| -------------- | ------- | -------- | -------------------------------------------------------- |
| `path`         | string  | Yes      | Path to Ruby file or directory to lint                   |
| `auto_correct` | boolean | No       | Auto-fix correctable offenses (default: `false`)         |
| `only`         | string  | No       | Run only specific cops (e.g., `"Rails"`, `"Style,Lint"`) |
| `except`       | string  | No       | Exclude specific cops                                    |

### Examples

**Basic lint:**

```json
{
  "path": "app/models/user.rb"
}
```

**With auto-correction:**

```json
{
  "path": "app/controllers/users_controller.rb",
  "auto_correct": true
}
```

**Rails cops only:**

```json
{
  "path": "app/models",
  "only": "Rails"
}
```

**Multiple departments:**

```json
{
  "path": "app/services",
  "only": "Rails,Security,Lint"
}
```

**Exclude specific cop:**

```json
{
  "path": "app/helpers/application_helper.rb",
  "except": "Style/Documentation"
}
```

### Response Format

```json
{
  "summary": "7 files inspected, 12 offenses detected, 8 offenses auto-correctable",
  "offenses": [
    {
      "severity": "convention",
      "message": "Use `update` instead of `update_attributes`.",
      "cop_name": "Rails/ActiveRecordAliases",
      "corrected": false,
      "correctable": true,
      "location": {
        "path": "app/models/user.rb",
        "line": 45,
        "column": 5
      }
    }
  ]
}
```

### Severity Levels

- `fatal` - Syntax errors
- `error` - Runtime errors
- `warning` - Potential bugs
- `convention` - Style violations
- `refactor` - Code improvements

## rubocop_list_cops

List available RuboCop cops with pagination support.

### Parameters

| Parameter    | Type   | Required | Description                                     |
| ------------ | ------ | -------- | ----------------------------------------------- |
| `department` | string | No       | Filter by department (Rails, Style, Lint, etc.) |
| `limit`      | number | No       | Max cops to return (default: 50, max: 200)      |
| `offset`     | number | No       | Number of cops to skip (default: 0)             |

### Examples

**Summary of all departments:**

```json
{}
```

**First page of Rails cops:**

```json
{
  "department": "Rails"
}
```

**Second page:**

```json
{
  "department": "Rails",
  "limit": 50,
  "offset": 50
}
```

**Large page size:**

```json
{
  "department": "Style",
  "limit": 100
}
```

### Available Departments

- `Gemspec` - Gemspec file conventions
- `Layout` - Code layout and formatting
- `Lint` - Potential errors and bugs
- `Metrics` - Code complexity metrics
- `Migration` - Database migration best practices
- `Naming` - Naming conventions
- `Performance` - Performance optimizations
- `Rails` - Rails-specific best practices
- `RSpec` - RSpec testing conventions (if plugin installed)
- `Security` - Security vulnerabilities
- `Style` - Code style conventions

### Response Format

**Without department (summary):**

```
RuboCop has 500+ total cops across 15 departments:

• Gemspec: 10 cops
• Layout: 45 cops
• Lint: 120 cops
• Metrics: 15 cops
• Rails: 80 cops
• Style: 150 cops
...
```

**With department (paginated):**

```
RuboCop Cops (Rails department):
Showing 1-50 of 80 total cops

• Rails/ActionControllerFlashBeforeRender
• Rails/ActionControllerTestCase
• Rails/ActiveRecordAliases
...

More results available. To see the next page:
Use limit: 50, offset: 50
Remaining: 30 cops
```

See [Pagination Guide](features/pagination.md) for detailed usage.

## rubocop_show_cop

Show detailed information about a specific RuboCop cop.

### Parameters

| Parameter  | Type   | Required | Description                                         |
| ---------- | ------ | -------- | --------------------------------------------------- |
| `cop_name` | string | Yes      | Full cop name (e.g., `"Rails/ActiveRecordAliases"`) |

### Examples

**Get cop details:**

```json
{
  "cop_name": "Rails/ActiveRecordAliases"
}
```

**Check Style cop:**

```json
{
  "cop_name": "Style/StringLiterals"
}
```

### Response Format

```
Rails/ActiveRecordAliases:
  Description: Checks for the use of old-style ActiveRecord aliases.
  Enabled: true
  Safe: true
  VersionAdded: '0.47'
  VersionChanged: '2.0'

  Details:
  Prefer the modern method names over the old aliases:
  - update_attributes → update
  - update_attributes! → update!

  Examples:
  # bad
  user.update_attributes(name: 'John')

  # good
  user.update(name: 'John')

  Configurable attributes:
  - AllowedMethods: []
```

## rubocop_auto_gen_config

Generate `.rubocop_todo.yml` configuration file for gradual adoption.

### Parameters

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| `path`    | string | No       | Directory path (default: current directory) |

### Examples

**Generate for current directory:**

```json
{}
```

**Generate for specific directory:**

```json
{
  "path": "app/services"
}
```

### What It Does

1. Runs RuboCop on the specified path
2. Identifies all current violations
3. Creates `.rubocop_todo.yml` with all offenses disabled
4. Allows gradual cop enablement

### Response Format

```
Generated .rubocop_todo.yml with 247 disabled offenses:

• Style: 120 offenses
• Layout: 45 offenses
• Lint: 32 offenses
• Rails: 28 offenses
• Metrics: 22 offenses

To use this file, add to your .rubocop.yml:
  inherit_from: .rubocop_todo.yml

Enable cops gradually by removing them from the todo file.
```

### Usage Pattern

1. Generate todo file
2. Inherit it in `.rubocop.yml`
3. Enable cops one by one
4. Fix violations
5. Remove cop from todo file
6. Repeat

See [Configuration Guide](configuration.md#gradual-adoption) for details.

## rubocop_set_auto_lint

Enable or disable automatic linting reminders for AI assistants.

### Parameters

| Parameter      | Type    | Required | Description                                     |
| -------------- | ------- | -------- | ----------------------------------------------- |
| `enabled`      | boolean | Yes      | `true` to enable, `false` to disable            |
| `auto_correct` | boolean | No       | Auto-fix issues when linting (default: `false`) |

### Examples

**Enable auto-lint:**

```json
{
  "enabled": true
}
```

**Enable with auto-correction:**

```json
{
  "enabled": true,
  "auto_correct": true
}
```

**Disable:**

```json
{
  "enabled": false
}
```

### What It Does

When enabled, the MCP server reminds the AI assistant to run RuboCop after:

- Creating new Ruby files
- Modifying existing Ruby files
- Generating Rails code (controllers, models, etc.)

### Response Format

**When enabling:**

```
Auto-lint has been enabled.

The AI assistant will be reminded to run RuboCop after generating or modifying Ruby files.
```

**When enabling with auto-correction:**

```
Auto-lint has been enabled with auto-correction.

The AI assistant will automatically run RuboCop and fix correctable issues after modifying Ruby files.
```

**When disabling:**

```
Auto-lint has been disabled.
```

See [Auto-Lint Feature](features/auto-lint.md) for complete documentation.

## rubocop_get_auto_lint_status

Get the current auto-lint configuration and status.

### Parameters

None.

### Example

```json
{}
```

### Response Format

**When enabled:**

```
Auto-lint Status:

• Auto-lint: enabled
• Auto-correction: enabled

The AI assistant should run RuboCop after generating or modifying Ruby files.
```

**When disabled:**

```
Auto-lint Status:

• Auto-lint: disabled

The AI assistant will not automatically lint Ruby files.
```

## Error Handling

All tools return descriptive error messages when issues occur:

### Common Errors

**RuboCop not found:**

```
Error: RuboCop is not installed or not in PATH.
Please run: gem install rubocop rubocop-rails
```

**Invalid path:**

```
Error: Path does not exist: app/models/invalid.rb
```

**Invalid cop name:**

```
Error: Cop not found: Rails/InvalidCopName
Use rubocop_list_cops to see available cops.
```

**Configuration error:**

```
Error: Invalid RuboCop configuration in .rubocop.yml
Line 5: unknown parameter 'InvalidKey'
```

## Best Practices

### 1. Use Auto-Correction Wisely

Auto-correction is safe for most style issues:

```json
{
  "path": "app/helpers",
  "auto_correct": true,
  "only": "Style,Layout"
}
```

But be careful with logic-related cops (Lint, Rails).

### 2. Filter by Department

For focused linting:

```json
{
  "path": "app/models",
  "only": "Rails"
}
```

### 3. Gradual Adoption

For existing projects:

1. Generate todo file
2. Enable high-priority cops first (Security, Lint)
3. Fix violations
4. Enable more cops gradually

### 4. Pagination for Large Results

Use appropriate page sizes:

```json
{
  "department": "Style",
  "limit": 50 // Readable size
}
```

### 5. Check Cop Details

Before enabling a cop, understand it:

```json
{
  "cop_name": "Rails/HasManyOrHasOneDependent"
}
```

## Next Steps

- [Usage Guide](usage.md) - Practical examples and workflows
- [Auto-Lint Feature](features/auto-lint.md) - Automatic linting setup
- [Pagination Guide](features/pagination.md) - Handle large result sets
- [Configuration](configuration.md) - Configure RuboCop
