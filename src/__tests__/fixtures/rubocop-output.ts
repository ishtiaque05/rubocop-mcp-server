/**
 * Test fixtures for RuboCop command output
 * Contains realistic examples of RuboCop responses
 */

export const RUBOCOP_SHOW_COPS_OUTPUT = `# Department 'Style' (143):
Style/AccessorGrouping:
  Description: Checks for grouping of accessors in class and module bodies.
Style/Alias:
  Description: Enforces the use of either alias or alias_method.
Style/AndOr:
  Description: Checks for uses of and and or.

# Department 'Layout' (67):
Layout/AccessModifierIndentation:
  Description: Modifiers should be indented as deep as method definitions.
Layout/ArrayAlignment:
  Description: Checks alignment of array elements.

# Department 'Lint' (92):
Lint/AmbiguousOperator:
  Description: Checks for ambiguous operators in the first argument.
Lint/AmbiguousRegexpLiteral:
  Description: Checks for ambiguous regexp literals in the first argument.

# Department 'Metrics' (12):
Metrics/AbcSize:
  Description: Checks that the ABC size is below a certain threshold.
Metrics/BlockLength:
  Description: Avoid long blocks with many lines.

# Department 'Naming' (23):
Naming/AccessorMethodName:
  Description: Checks accessor method names.
Naming/AsciiIdentifiers:
  Description: Use only ascii symbols in identifiers.`;

export const RUBOCOP_LINT_SUCCESS_JSON = JSON.stringify({
  metadata: {
    rubocop_version: '1.50.0',
    ruby_engine: 'ruby',
    ruby_version: '3.2.0',
    ruby_patchlevel: '0',
    ruby_platform: 'x86_64-linux',
  },
  files: [
    {
      path: 'app.rb',
      offenses: [],
    },
  ],
  summary: {
    offense_count: 0,
    target_file_count: 1,
    inspected_file_count: 1,
  },
});

export const RUBOCOP_LINT_WITH_OFFENSES_JSON = JSON.stringify({
  metadata: {
    rubocop_version: '1.50.0',
    ruby_engine: 'ruby',
    ruby_version: '3.2.0',
    ruby_patchlevel: '0',
    ruby_platform: 'x86_64-linux',
  },
  files: [
    {
      path: 'app.rb',
      offenses: [
        {
          severity: 'convention',
          message:
            "Prefer single-quoted strings when you don't need string interpolation or special symbols.",
          cop_name: 'Style/StringLiterals',
          corrected: false,
          correctable: true,
          location: {
            start_line: 10,
            start_column: 5,
            last_line: 10,
            last_column: 20,
            line: 10,
            column: 5,
          },
        },
        {
          severity: 'convention',
          message: 'Use the new Ruby 1.9 hash syntax.',
          cop_name: 'Style/HashSyntax',
          corrected: false,
          correctable: true,
          location: {
            start_line: 15,
            start_column: 3,
            last_line: 15,
            last_column: 15,
            line: 15,
            column: 3,
          },
        },
      ],
    },
  ],
  summary: {
    offense_count: 2,
    target_file_count: 1,
    inspected_file_count: 1,
  },
});

export const RUBOCOP_LINT_MULTIPLE_FILES_JSON = JSON.stringify({
  metadata: {
    rubocop_version: '1.50.0',
    ruby_engine: 'ruby',
    ruby_version: '3.2.0',
  },
  files: [
    {
      path: 'app/models/user.rb',
      offenses: [
        {
          severity: 'warning',
          message: 'Method has too many lines. [25/10]',
          cop_name: 'Metrics/MethodLength',
          corrected: false,
          correctable: false,
          location: {
            start_line: 5,
            start_column: 3,
            last_line: 30,
            last_column: 5,
            line: 5,
            column: 3,
          },
        },
      ],
    },
    {
      path: 'app/controllers/users_controller.rb',
      offenses: [
        {
          severity: 'convention',
          message: 'Missing top-level class documentation comment.',
          cop_name: 'Style/Documentation',
          corrected: false,
          correctable: false,
          location: {
            start_line: 1,
            start_column: 1,
            last_line: 1,
            last_column: 30,
            line: 1,
            column: 1,
          },
        },
      ],
    },
    {
      path: 'spec/models/user_spec.rb',
      offenses: [],
    },
  ],
  summary: {
    offense_count: 2,
    target_file_count: 3,
    inspected_file_count: 3,
  },
});

export const RUBOCOP_CONFIG_ERROR = `Error: configuration file .rubocop.yml not found
Invalid YAML detected at line 5`;

export const RUBOCOP_SYNTAX_ERROR = `Lint/Syntax: unexpected token $end
  (Using Ruby 3.2 parser; configure using TargetRubyVersion parameter, under AllCops)`;
