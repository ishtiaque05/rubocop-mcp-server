# Auto-Lint Feature

The RuboCop MCP server includes an auto-lint feature that helps remind Claude or Cursor to automatically check Ruby files after modification.

## How It Works

When auto-lint is enabled, the MCP server will:
1. Track the auto-lint state for your session
2. Provide helpful reminders to run RuboCop when issues are found
3. Optionally apply auto-corrections automatically

## Usage

### Enable Auto-Lint

Ask Claude or Cursor to enable auto-lint:

```
Enable RuboCop auto-lint
```

Or be more specific:

```
Enable RuboCop auto-lint with auto-correction
```

This calls the `rubocop_set_auto_lint` tool behind the scenes.

### Check Status

To see if auto-lint is enabled:

```
What's the RuboCop auto-lint status?
```

### Disable Auto-Lint

To turn it off:

```
Disable RuboCop auto-lint
```

## Example Workflow

```
You: Enable RuboCop auto-lint with auto-correction

Claude: ✓ Auto-lint has been enabled with auto-correction.

The AI assistant will now be reminded to run RuboCop after
generating or modifying Ruby files.

You: Create a new Rails controller for users

Claude: [Creates the controller file]
Let me run RuboCop to check for any style issues...

[Runs rubocop_lint and auto-corrects any issues]

✓ No offenses found!
```

## Configuration Options

### Basic Enable/Disable

```json
{
  "enabled": true
}
```

### With Auto-Correction

```json
{
  "enabled": true,
  "auto_correct": true
}
```

## MCP Tool Reference

### rubocop_set_auto_lint

Enable or disable automatic linting mode.

**Parameters:**
- `enabled` (required): `true` to enable, `false` to disable
- `auto_correct` (optional): `true` to auto-fix issues, default `false`

**Example:**
```json
{
  "enabled": true,
  "auto_correct": true
}
```

### rubocop_get_auto_lint_status

Get the current auto-lint configuration.

**Parameters:** None

**Returns:**
```
Auto-lint Status:

• Auto-lint: enabled
• Auto-correction: enabled

📝 The AI assistant should run RuboCop after generating or modifying Ruby files.
```

## How This Differs From Hooks

### Auto-Lint (This Feature)
- Works at the MCP tool level
- Provides reminders to the AI assistant
- The AI decides when to lint
- Works with Claude CLI, Claude Desktop, and Cursor
- Toggleable per session

### Claude Code Hooks
- Works at the IDE/CLI level
- Automatically executes after file changes
- Happens regardless of AI involvement
- Only works with Claude CLI
- Configured in settings files

### Pre-commit Hooks
- Works at the git level
- Runs before commits
- Happens outside of AI context
- Works with any tool
- Configured per repository

## Best Practices

1. **Enable auto-lint at the start of your session:**
   ```
   Enable RuboCop auto-lint
   ```

2. **Use auto-correction for quick fixes:**
   ```
   Enable RuboCop auto-lint with auto-correction
   ```

3. **Disable when working on experimental code:**
   ```
   Disable RuboCop auto-lint
   ```

4. **Check status if unsure:**
   ```
   What's the auto-lint status?
   ```

## Troubleshooting

**Auto-lint seems disabled?**
- Check the status: ask "What's the RuboCop auto-lint status?"
- Re-enable if needed: "Enable RuboCop auto-lint"

**AI not running RuboCop automatically?**
- Auto-lint provides *reminders*, not forced execution
- The AI assistant decides when to run based on context
- You can always explicitly ask: "Run RuboCop on this file"

**Want forced auto-execution?**
- Use Claude Code hooks (for Claude CLI)
- Use pre-commit hooks (for git integration)
- See the main README for setup instructions
