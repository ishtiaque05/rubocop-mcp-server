# Development Guide

Guide for contributing to and developing the RuboCop MCP server.

## Setup

### Prerequisites

- Node.js >= 20.17.0
- Yarn package manager
- RuboCop and rubocop-rails gems

### Clone and Install

```bash
git clone https://github.com/yourusername/rubocop-mcp.git
cd rubocop-mcp
yarn install
```

## Development Workflow

### Build

```bash
# One-time build
yarn build

# Clean build
yarn build:clean
```

### Watch Mode

Auto-recompile on changes:

```bash
yarn watch
```

### Development Server

Run with auto-reload:

```bash
yarn dev
```

## Code Quality

### Linting

```bash
# Run ESLint
yarn lint

# Auto-fix issues
yarn lint:fix
```

### Formatting

```bash
# Check formatting
yarn format:check

# Auto-format
yarn format
```

### Type Checking

```bash
yarn type-check
```

### Run All Checks

```bash
yarn validate
```

## Testing

### Manual Testing

**Test MCP server directly:**

```bash
node test/test-mcp.js
```

**Test with RuboCop CLI:**

```bash
# Lint the test file
rubocop test/test_example.rb

# With JSON output
rubocop --format json test/test_example.rb
```

**Test with Claude CLI:**

```bash
# Add server in development mode
claude mcp add --transport stdio rubocop-dev -- node $(pwd)/build/index.js

# Start Claude and test
claude
```

Then ask Claude:

```
Use rubocop_lint to check test/test_example.rb
```

### Test Files

- `test/test_example.rb` - Ruby file with intentional violations
- `test/.rubocop.yml` - RuboCop config for test files
- `test/test-mcp.js` - Direct MCP server test script

## Project Structure

```
rubocop-mcp/
├── src/
│   └── index.ts           # Main MCP server implementation
├── build/                  # Compiled JavaScript (generated)
├── test/                   # Test files and fixtures
├── docs/                   # Documentation
├── examples/               # Configuration examples
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .editorconfig           # Editor configuration
└── commitlint.config.js    # Commit message linting
```

## Code Style

### TypeScript

- Use explicit return types for functions
- Prefer `const` over `let`
- Use async/await over promises
- Import types with `type` keyword

**Example:**

```typescript
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

async function lintFile(path: string): Promise<RubocopResult> {
  const result = await execFileAsync('rubocop', ['--format', 'json', path]);
  return JSON.parse(result.stdout);
}
```

### Formatting

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Line length: 100 characters
- Trailing commas in multi-line

Prettier handles most formatting automatically.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for rubocop-rspec plugin
fix: handle missing .rubocop.yml gracefully
docs: update installation instructions
chore: upgrade dependencies
```

Types:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding tests
- `build` - Build system changes
- `ci` - CI configuration
- `chore` - Other changes

## Git Workflow

### Pre-commit Hooks

Husky automatically runs:

- ESLint on staged TypeScript files
- Prettier on all staged files

### Commit Message Validation

Commitlint validates commit messages on commit.

### Making Changes

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ...

# Stage and commit (hooks run automatically)
git add .
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature
```

## CI/CD

### GitHub Actions

The CI workflow runs on push and PR:

1. **Lint and Test Job:**
   - Type checking
   - ESLint
   - Prettier check
   - Build verification
   - Runs on Node.js 20.x and 22.x

2. **Commitlint Job** (PRs only):
   - Validates commit messages

3. **Dependency Review** (PRs only):
   - Checks for vulnerable dependencies

### Local CI Simulation

Run the same checks as CI:

```bash
yarn validate && yarn build
```

## Adding Features

### Adding a New Tool

1. **Define the tool schema** in `src/index.ts`:

```typescript
const TOOLS: Tool[] = [
  // ... existing tools
  {
    name: 'rubocop_my_tool',
    description: 'Description of what it does',
    inputSchema: {
      type: 'object',
      properties: {
        param1: {
          type: 'string',
          description: 'Parameter description',
        },
      },
      required: ['param1'],
    },
  },
];
```

2. **Implement the handler** in the `CallToolRequestSchema` handler:

```typescript
case 'rubocop_my_tool': {
  const { param1 } = args as { param1: string };

  // Implementation
  const result = await myToolLogic(param1);

  return {
    content: [{ type: 'text', text: result }],
  };
}
```

3. **Add documentation** to `docs/api-reference.md`

4. **Add usage examples** to `docs/usage.md`

5. **Test thoroughly**

### Adding Configuration Options

Update the `RubocopConfig` interface and related logic:

```typescript
interface RubocopConfig {
  autoLintEnabled: boolean;
  autoCorrect: boolean;
  myNewOption: boolean; // Add new option
}
```

## Debugging

### Debug Mode

Add debug logging:

```typescript
console.error('Debug:', { variable, state });
```

Output goes to stderr and can be seen in the MCP client logs.

### Test RuboCop Commands

Test the underlying RuboCop commands:

```bash
# Test the exact command the server runs
rubocop --format json app/models/user.rb

# Test cop listing
rubocop --show-cops

# Test specific cop
rubocop --show-cops Rails/ActiveRecordAliases
```

### MCP Protocol Debugging

Use the MCP inspector:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Performance

### Optimization Tips

1. **Use `--parallel` for large codebases** (future enhancement)
2. **Cache cop lists** to avoid repeated `--show-cops` calls
3. **Stream large results** instead of loading all in memory

### Benchmarking

Time RuboCop operations:

```bash
time rubocop --format json app/
```

## Documentation

### Update Documentation

When adding features, update:

- `README.md` - If it's a major feature
- `docs/api-reference.md` - Tool reference
- `docs/usage.md` - Usage examples
- `docs/configuration.md` - If configuration related

### Documentation Style

- Use clear, concise language
- Provide practical examples
- Include code snippets
- Link to related docs
- Use markdown tables for parameters

## Release Process

### Version Bumping

Update `package.json` version following [Semantic Versioning](https://semver.org/):

- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes

### Creating a Release

```bash
# Update version
vim package.json

# Update CHANGELOG.md
vim CHANGELOG.md

# Commit
git add package.json CHANGELOG.md
git commit -m "chore: bump version to X.Y.Z"

# Tag
git tag vX.Y.Z
git push origin main --tags
```

## Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all checks pass (`yarn validate && yarn build`)
5. Update documentation
6. Submit PR with clear description

### PR Guidelines

- Clear title following conventional commits
- Description of what changed and why
- Link related issues
- Screenshots/examples if applicable
- All CI checks must pass

## Getting Help

- [GitHub Issues](https://github.com/yourusername/rubocop-mcp/issues)
- [MCP Protocol Docs](https://modelcontextprotocol.io)
- [RuboCop Documentation](https://docs.rubocop.org)

## Next Steps

- [API Reference](api-reference.md) - Tool specifications
- [Troubleshooting](troubleshooting.md) - Common issues
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
