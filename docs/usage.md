# Usage Guide

Learn how to use the RuboCop MCP server effectively with your AI assistant.

## Basic Usage

Start your AI assistant in your Rails project directory:

```bash
cd /path/to/your/rails/project
claude  # or use Cursor/Claude Desktop
```

## Common Commands

### Linting Files

**Lint a single file:**

```
Lint app/models/user.rb
```

**Lint a directory:**

```
Check app/controllers for style violations
```

**Lint with auto-fix:**

```
Lint app/services/payment_service.rb and auto-fix all issues
```

### Working with Cops

**List cops by department:**

```
List all Rails cops
```

```
Show me all Style cops
```

**Get cop details:**

```
Show details about the Rails/HasManyOrHasOneDependent cop
```

```
What does the Style/StringLiterals cop do?
```

### Filtering

**Run specific cops only:**

```
Check app/models for only Rails cop violations
```

**Exclude specific cops:**

```
Lint this file but skip the Style/Documentation cop
```

## Workflows

### Pre-Commit Workflow

Before committing changes:

```
Lint all files I modified with RuboCop
```

```
Check my staged changes for style issues and auto-fix them
```

### Code Review Workflow

During code review:

```
Lint app/controllers/api/v1/users_controller.rb and explain any violations
```

```
What Rails best practices am I violating in this file?
```

### Refactoring Workflow

When refactoring code:

```
Run RuboCop on app/services/ and show me the most critical issues
```

```
Check this file for security and performance issues
```

### Learning Workflow

To learn RuboCop rules:

```
List all Lint cops and explain what they check for
```

```
Show me examples of the Rails/ActiveRecordAliases violation
```

## Auto-Lint Mode

Enable automatic linting reminders:

```
Enable RuboCop auto-lint
```

Now your AI assistant will automatically check files after modifying them:

```
You: Create a new Rails controller for posts

Claude: [Creates the controller file]
       Let me run RuboCop to check for any style issues...
       [Automatically runs rubocop_lint]
```

With auto-correction enabled:

```
Enable RuboCop auto-lint with auto-correction
```

See [Auto-Lint Feature](features/auto-lint.md) for complete documentation.

## Tool-Specific Usage

### rubocop_lint

**Basic lint:**

```
Use rubocop_lint to check app/models/user.rb
```

**With auto-correction:**

```
Use rubocop_lint with auto_correct=true on app/controllers/users_controller.rb
```

**Run only specific cops:**

```
Use rubocop_lint on app/models with only='Rails'
```

**Exclude specific cops:**

```
Use rubocop_lint on this file except Style/Documentation
```

### rubocop_list_cops

**List all departments:**

```
List all RuboCop cop departments
```

**List cops in a department:**

```
List all Rails cops
```

**Paginated results:**

```
Show the next 50 Style cops (offset 50)
```

See [Pagination Guide](features/pagination.md) for details.

### rubocop_show_cop

**Get cop information:**

```
Show details about Rails/ActiveRecordAliases
```

**Understand violations:**

```
Explain the Style/StringLiterals cop with examples
```

### rubocop_auto_gen_config

**Generate todo file:**

```
Generate a RuboCop todo configuration for this project
```

**For specific directory:**

```
Generate RuboCop todo config for app/services
```

### Auto-Lint Control

**Enable:**

```
Enable RuboCop auto-lint
```

**Enable with auto-fix:**

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

## Practical Examples

### Example 1: Fixing a Controller

```
You: Lint app/controllers/posts_controller.rb

Claude: Found 5 offenses:
        1. Missing frozen string literal comment
        2. Line too long (132 characters, max 120)
        3. Use `if` instead of `unless` with `else`
        4. Unused variable `result`
        5. Prefer single quotes over double quotes

You: Fix all auto-correctable issues

Claude: [Runs with auto_correct=true]
        Fixed 3 offenses. 2 require manual attention:
        - Line too long needs refactoring
        - Conditional logic needs restructuring
```

### Example 2: Learning Rails Best Practices

```
You: List all Rails/ActiveRecord related cops

Claude: [Shows Rails cops related to ActiveRecord]
        - Rails/ActiveRecordAliases
        - Rails/ActiveRecordCallbacksOrder
        - Rails/ActiveRecordOverride
        ...

You: Show details about Rails/ActiveRecordAliases

Claude: This cop checks for the use of old ActiveRecord alias methods:
        - `update_attributes` → use `update`
        - `update_attributes!` → use `update!`
        ...
```

### Example 3: Gradual Adoption

```
You: Generate a RuboCop todo configuration

Claude: [Creates .rubocop_todo.yml with 247 disabled offenses]

You: Which cops should I enable first?

Claude: I recommend starting with:
        1. Security cops (highest priority)
        2. Lint cops (catch potential bugs)
        3. Style cops (improve consistency)

You: Enable all Lint cops and check the project

Claude: [Removes Lint cops from todo file]
        Found 23 Lint violations across 8 files.
        Let me fix the auto-correctable ones...
```

### Example 4: Department-Specific Linting

```
You: Check app/models for only Rails-specific issues

Claude: [Runs with only='Rails']
        Found Rails violations:
        - Missing dependent: :destroy on has_many
        - Using update_attributes instead of update
        - Validation without presence check
```

### Example 5: Pre-Commit Check

```
You: I'm about to commit. Check all modified files.

Claude: [Checks git status and lints changed files]
        Found violations in:
        - app/models/user.rb: 2 offenses
        - app/services/notification.rb: 1 offense

        Shall I auto-fix these before you commit?

You: Yes, fix them

Claude: [Auto-fixes all violations]
        All files are now clean! Ready to commit.
```

## Tips and Best Practices

### 1. Start with Auto-Lint

Enable auto-lint at the beginning of your session:

```
Enable RuboCop auto-lint with auto-correction
```

### 2. Focus on Departments

Work on one department at a time:

```
Show me all Security violations in this project
```

### 3. Understand Before Fixing

Always ask for explanations:

```
Why is this a violation and how should I fix it?
```

### 4. Use Auto-Fix Wisely

Auto-fix is safe for most style issues:

```
Auto-fix all Style violations
```

But review changes for logic-related cops:

```
Show me Rails violations but don't auto-fix yet
```

### 5. Leverage Pagination

For large codebases, use pagination:

```
Show the first 50 cops, I'll ask for more if needed
```

### 6. Project Context

Always run Claude from your project root so it finds your `.rubocop.yml`:

```bash
cd /path/to/project  # Important!
claude
```

### 7. Combine with Git

```
Lint only files in my current branch
```

```
Check files changed since main branch
```

## Common Patterns

**Quick fix:**

```
Lint this file and auto-fix everything
```

**Careful review:**

```
Lint this file, show me each violation, and I'll decide what to fix
```

**Learning:**

```
What are the most common Rails violations developers make?
```

**Batch processing:**

```
Check all controllers and fix style issues
```

**Focused linting:**

```
Check only for security issues in this file
```

## Integration with Development Workflow

### With Git Hooks

You can use the MCP server alongside git hooks:

```bash
# .git/hooks/pre-commit
#!/bin/bash
bundle exec rubocop --force-exclusion $(git diff --cached --name-only --diff-filter=ACM | grep '\.rb$')
```

### With CI/CD

In your CI pipeline, run RuboCop separately:

```yaml
- name: RuboCop
  run: bundle exec rubocop --parallel --format json --out rubocop-results.json
```

Use the MCP server for:

- Interactive development
- Learning RuboCop rules
- Quick fixes during coding
- Code review assistance

### With Editor Integration

The MCP server complements editor plugins:

- **Editor plugins**: Real-time inline warnings
- **MCP server**: AI-assisted explanations and fixes

## Next Steps

- [API Reference](api-reference.md) - Complete tool documentation
- [Auto-Lint Feature](features/auto-lint.md) - Automatic linting setup
- [Pagination Guide](features/pagination.md) - Handle large result sets
- [Troubleshooting](troubleshooting.md) - Fix common issues
