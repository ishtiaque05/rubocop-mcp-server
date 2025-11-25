# Sample Gem

A simple Ruby gem with intentional RuboCop violations for testing the RuboCop MCP server.

## Structure

```
lib/
  sample_gem.rb               # Main entry point
  sample_gem/
    version.rb                # Version constant
    style_violations.rb       # Style violations
    rails_violations.rb       # Rails violations
```

## Setup

```bash
cd test/sample_gem
bundle install
```

## Testing with RuboCop

```bash
# Lint the entire gem
rubocop lib/

# Lint specific files
rubocop lib/sample_gem/style_violations.rb
rubocop lib/sample_gem/rails_violations.rb

# Auto-correct
rubocop -a lib/
```

## Testing with MCP Server

Use the RuboCop MCP tools:

```
Use rubocop_lint on test/sample_gem/lib
Use rubocop_lint on test/sample_gem/lib/sample_gem/style_violations.rb
```
