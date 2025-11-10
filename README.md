# RuboCop MCP Server

A Model Context Protocol (MCP) server that provides RuboCop and Rails linting capabilities to AI assistants like Claude and Cursor.

[![CI](https://github.com/yourusername/rubocop-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/rubocop-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **RuboCop Integration**: Run RuboCop linting with Rails-specific cops
- **Auto-correction**: Automatically fix style violations
- **Smart Pagination**: Handle large cop lists efficiently
- **Auto-lint Mode**: Automatic linting reminders for AI assistants
- **Flexible Filtering**: Run specific cops or departments
- **Gradual Adoption**: Generate `.rubocop_todo.yml` for existing projects

## Quick Start

### Prerequisites

```bash
# Install RuboCop
gem install rubocop rubocop-rails

# Or add to your Rails Gemfile
# gem 'rubocop', require: false
# gem 'rubocop-rails', require: false
```

### Installation

```bash
# 1. Clone and build
git clone https://github.com/yourusername/rubocop-mcp.git
cd rubocop-mcp
yarn install && yarn build

# 2. Add to Claude CLI
claude mcp add --transport stdio rubocop -- node $(pwd)/build/index.js

# 3. Verify
claude mcp list
```

### Usage

Start Claude in your Rails project and ask:

```
Lint app/models/user.rb
```

```
Check app/controllers for Rails violations and auto-fix them
```

```
List all available Rails cops
```

That's it! See [Installation Guide](docs/installation.md) for detailed setup instructions.

## Available Tools

| Tool                           | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| `rubocop_lint`                 | Run RuboCop on files with auto-correction support |
| `rubocop_list_cops`            | List available cops with pagination               |
| `rubocop_show_cop`             | Show detailed cop information                     |
| `rubocop_auto_gen_config`      | Generate `.rubocop_todo.yml` for gradual adoption |
| `rubocop_set_auto_lint`        | Enable/disable automatic linting reminders        |
| `rubocop_get_auto_lint_status` | Check auto-lint configuration                     |

See [API Reference](docs/api-reference.md) for complete documentation.

## Documentation

- [Installation Guide](docs/installation.md) - Complete installation instructions
- [Configuration](docs/configuration.md) - Configure for different environments
- [Usage Guide](docs/usage.md) - Examples and workflows
- [API Reference](docs/api-reference.md) - Complete tool reference
- [Auto-Lint Feature](docs/features/auto-lint.md) - Automatic linting reminders
- [Pagination Guide](docs/features/pagination.md) - Handle large result sets
- [Development Guide](docs/development.md) - Contributing and testing
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## Project Structure

```
rubocop-mcp/
├── src/              # TypeScript source code
├── build/            # Compiled JavaScript
├── docs/             # Documentation
├── examples/         # Configuration examples
├── test/             # Test files
└── package.json      # Project configuration
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

## Support

- [GitHub Issues](https://github.com/yourusername/rubocop-mcp/issues)
- [RuboCop Documentation](https://docs.rubocop.org)
- [MCP Protocol](https://modelcontextprotocol.io)
