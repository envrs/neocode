# Testing Guide

## Overview

NeoCode has a comprehensive test suite with over 400 test files covering all major functionality.

## Running Tests

### From Project Root

```bash
# Run all tests across packages
bun test

# Run tests with coverage
bun run test:coverage

# Type checking
bun run typecheck
```

### From Specific Package

```bash
# Navigate to package
cd packages/neocode

# Run all tests
bun test

# Run specific test file
bun test test/tool/tool.test.ts

# Run tests matching pattern
bun test test/**/*.test.ts

# Run tests with coverage
bun test --coverage
```

## Test Structure

### Directory Organization

```
packages/neocode/test/
├── acp/              # Agent Client Protocol tests
├── agent/            # Agent functionality tests
├── cli/              # Command-line interface tests
├── config/           # Configuration tests
├── file/             # File operations tests
├── ide/              # IDE integration tests
├── lsp/              # Language Server Protocol tests
├── mcp/              # Model Context Protocol tests
├── permission/       # Permission system tests
├── provider/         # AI provider tests
├── server/           # Server functionality tests
└── session/          # Session management tests
```

### Test Naming Convention

- Test files end with `.test.ts`
- Use descriptive names that indicate functionality
- Group related tests in subdirectories

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from "bun:test"

describe("Feature Name", () => {
  it("should do something", () => {
    // Arrange
    const input = "test"

    // Act
    const result = functionUnderTest(input)

    // Assert
    expect(result).toBe("expected")
  })
})
```

### Testing Tools

```typescript
import { Tool } from "../src/tool/tool"

describe("Tool Tests", () => {
  it("should execute tool correctly", async () => {
    const tool = Tool.define({
      name: "test-tool",
      execute: async (input) => {
        return { success: true, data: input }
      },
    })

    const result = await tool.execute({ test: "data" })
    expect(result.success).toBe(true)
  })
})
```

### Mocking

- Use Bun's built-in mocking capabilities
- Mock external dependencies in test setup
- Clean up mocks after each test

## Test Categories

### Unit Tests

- Test individual functions and classes
- Fast and isolated
- No external dependencies

### Integration Tests

- Test component interactions
- Include external services when needed
- Focus on user workflows

### End-to-End Tests

- Test complete user scenarios
- Use Playwright for UI tests
- Include real file system operations

## Coverage

### Current Coverage

- **405 test files** across all packages
- Coverage reports available with `--coverage` flag
- Focus on critical paths and edge cases

### Coverage Goals

- Aim for >80% line coverage on core modules
- 100% coverage on security-critical code
- All public APIs should have tests

## CI/CD Integration

### GitHub Actions

Tests run automatically on:

- Pull requests
- Push to main/dev branches
- Scheduled runs

### Test Commands in CI

```yaml
- name: Run tests
  run: bun test

- name: Type check
  run: bun run typecheck

- name: Lint
  run: bun run lint
```

## Best Practices

### Test Organization

1. **Arrange, Act, Assert** pattern
2. Descriptive test names
3. One assertion per test when possible
4. Use helpers for common setup

### Test Data

1. Use fixtures for complex test data
2. Generate random data for edge cases
3. Clean up test files after tests

### Performance

1. Keep tests fast and focused
2. Use `test.skip()` for slow tests
3. Parallelize independent tests

## Debugging Tests

### Running Single Test

```bash
bun test test/specific-file.test.ts
```

### Debug Mode

```bash
bun test --debug
```

### Verbose Output

```bash
bun test --reporter=verbose
```

## Troubleshooting

### Common Issues

1. **Import errors**: Check relative paths
2. **Async issues**: Use proper async/await
3. **File permissions**: Ensure test files are executable
4. **Memory issues**: Limit concurrent tests

### Getting Help

- Check existing test patterns
- Review test failures in CI
- Ask in Discord #development channel
