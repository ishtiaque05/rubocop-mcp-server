# Contributing to RuboCop MCP Server

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

**Before submitting:**

- Check existing [GitHub Issues](https://github.com/yourusername/rubocop-mcp/issues)
- Verify you're using the latest version
- Try to reproduce the issue

**Submit a bug report with:**

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, Ruby version, OS)
- Error messages and logs
- Minimal reproduction example if possible

### Suggesting Features

**Open a feature request with:**

- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Examples of similar features elsewhere

### Pull Requests

1. **Fork and clone** the repository
2. **Create a branch** from `main`
3. **Make your changes**
4. **Test thoroughly**
5. **Update documentation**
6. **Submit PR**

## Development Setup

### Prerequisites

- Node.js >= 20.17.0
- Yarn package manager
- RuboCop and rubocop-rails gems

### Setup

```bash
git clone https://github.com/yourusername/rubocop-mcp.git
cd rubocop-mcp
yarn install
yarn build
```

### Development Workflow

```bash
# Watch mode (auto-recompile)
yarn watch

# Development server
yarn dev

# Run linter
yarn lint

# Run type checker
yarn type-check

# Format code
yarn format

# Run all checks
yarn validate
```

See [Development Guide](docs/development.md) for detailed information.

## Code Standards

### TypeScript Style

- Use explicit return types for functions
- Prefer `const` over `let`
- Use async/await over raw promises
- Import types with `type` keyword
- Follow existing code patterns

### Code Quality

All code must pass:

- ESLint (no warnings)
- TypeScript compiler (no errors)
- Prettier formatting
- Type checking

Run before committing:

```bash
yarn validate
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Build system or dependencies
- `ci`: CI configuration
- `chore`: Other changes

**Examples:**

```
feat: add support for rubocop-rspec plugin

Adds integration with the rubocop-rspec plugin to enable
RSpec-specific cop checking for test files.

Closes #123
```

```
fix: handle missing .rubocop.yml gracefully

Previously the server crashed when no config file was found.
Now falls back to default RuboCop configuration.
```

```
docs: update installation instructions for Windows

Clarifies path format and provides Windows-specific examples.
```

### Git Hooks

Pre-commit hooks automatically run:

- ESLint on staged `.ts` and `.js` files
- Prettier on all staged files
- Commitlint validates commit messages

If hooks fail, fix the issues before committing.

## Testing

### Manual Testing

```bash
# Test MCP server
node test/test-mcp.js

# Test with RuboCop
rubocop test/test_example.rb

# Test with Claude
claude mcp add --transport stdio rubocop-dev -- node $(pwd)/build/index.js
claude
```

### Test Coverage

Ensure your changes work with:

- Different Ruby versions
- Different RuboCop versions
- Different platforms (macOS, Linux, Windows)
- Multiple AI assistants (Claude CLI, Claude Desktop, Cursor)

## Documentation

### Update Documentation

When making changes, update relevant documentation:

- **README.md** - For major features
- **docs/api-reference.md** - For tool changes
- **docs/usage.md** - For usage examples
- **docs/configuration.md** - For configuration changes
- **docs/troubleshooting.md** - For common issues

### Documentation Style

- Clear and concise
- Provide examples
- Use markdown properly
- Link to related docs
- Test all code examples

## Pull Request Process

### Before Submitting

1. **Update your branch:**

```bash
git fetch origin
git rebase origin/main
```

2. **Run all checks:**

```bash
yarn validate && yarn build
```

3. **Update documentation**

4. **Write descriptive commit messages**

### PR Guidelines

**Title:**

- Follow conventional commit format
- Clear and descriptive

**Description:**

- What changed and why
- Link to related issues
- Breaking changes (if any)
- Screenshots/examples (if applicable)

**Checklist:**

- [ ] Code follows project standards
- [ ] All checks pass
- [ ] Documentation updated
- [ ] Tested manually
- [ ] Commit messages are descriptive

### Review Process

1. Maintainer reviews PR
2. Feedback and requested changes
3. You make updates
4. Approval and merge

## Project Structure

```
rubocop-mcp/
├── src/              # TypeScript source
│   └── index.ts      # Main server implementation
├── build/            # Compiled JavaScript
├── docs/             # Documentation
├── test/             # Test files
├── examples/         # Configuration examples
└── .github/          # GitHub Actions
```

## Areas for Contribution

### High Priority

- Test coverage improvements
- Performance optimizations
- Bug fixes
- Documentation improvements

### Feature Ideas

- Support for additional RuboCop plugins
- Caching for cop lists
- Parallel linting for large codebases
- Configuration file validation
- Interactive cop configuration wizard

### Documentation Needs

- More usage examples
- Video tutorials
- Blog posts
- Translation to other languages

## Getting Help

- **Questions:** Open a [GitHub Discussion](https://github.com/yourusername/rubocop-mcp/discussions)
- **Bugs:** Open a [GitHub Issue](https://github.com/yourusername/rubocop-mcp/issues)
- **Chat:** Join our community (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:

- Listed in release notes
- Acknowledged in the README (for significant contributions)
- Appreciated and thanked!

Thank you for contributing to RuboCop MCP Server!
