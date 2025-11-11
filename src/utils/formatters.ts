import type { RubocopOffense, RubocopResult } from '../types.js';

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    default:
      return 'ℹ️';
  }
}

function formatOffenseMetadata(offense: RubocopOffense): string {
  const parts: string[] = [];

  if (offense.correctable) {
    parts.push('[Auto-correctable]');
  }

  if (offense.corrected) {
    parts.push('[Corrected]');
  }

  return parts.length > 0 ? ` ${parts.join(' ')}` : '';
}

function formatOffense(offense: RubocopOffense): string {
  const icon = getSeverityIcon(offense.severity);
  const metadata = formatOffenseMetadata(offense);
  const location = `${offense.location.line}:${offense.location.column}`;

  return (
    `  ${icon} Line ${location}: ${offense.message}\n` +
    `     Cop: ${offense.cop_name}${metadata}\n`
  );
}

/**
 * Formats all offenses for a RuboCop result
 *
 * @param result - The RuboCop analysis result
 * @returns Formatted string suitable for display
 */
export function formatOffenses(result: RubocopResult): string {
  if (result.summary.offense_count === 0) {
    return '✓ No offenses found!';
  }

  let output = `Found ${result.summary.offense_count} offense(s) in ${result.files.length} file(s):\n\n`;

  for (const file of result.files) {
    if (file.offenses.length === 0) {
      continue;
    }

    output += `📄 ${file.path}\n`;

    for (const offense of file.offenses) {
      output += formatOffense(offense);
    }

    output += '\n';
  }

  return output;
}

/**
 * Pagination information for cop lists
 */
interface PaginationInfo {
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Formats pagination footer for cop lists
 */
function formatPaginationFooter(pagination: PaginationInfo, department: string): string {
  if (!pagination.hasMore) {
    return `✓ All cops displayed for ${department} department.\n`;
  }

  const nextOffset = pagination.offset + pagination.limit;
  const remaining = pagination.total - (pagination.offset + pagination.limit);

  return (
    `📄 More results available. To see the next page:\n` +
    `   Use limit: ${pagination.limit}, offset: ${nextOffset}\n` +
    `   Remaining: ${remaining} cops\n`
  );
}

/**
 * Extracts cop names from RuboCop --show-cops output for a specific department
 *
 */
function extractCopsForDepartment(stdout: string, department: string): string[] {
  const lines = stdout.split('\n');
  const matchingCops: string[] = [];
  const deptPrefix = `${department}/`;

  for (const line of lines) {
    if (line.startsWith(deptPrefix)) {
      const copMatch = line.match(/^([A-Z][a-zA-Z]+\/[A-Za-z0-9]+):/);
      if (copMatch?.[1]) {
        matchingCops.push(copMatch[1]);
      }
    }
  }

  return matchingCops;
}

/**
 * Formats the list of cops for a department with pagination
 *
 * @param stdout - Raw RuboCop --show-cops output
 * @param department - Department to filter by
 * @param limit - Maximum cops to show
 * @param offset - Number of cops to skip
 */
export function formatCopList(
  stdout: string,
  department: string,
  limit: number = 50,
  offset: number = 0
): string {
  const matchingCops = extractCopsForDepartment(stdout, department);
  const totalCops = matchingCops.length;

  // Guard clause: No cops found
  if (totalCops === 0) {
    return (
      `No cops found for department: ${department}\n\n` +
      `Available departments can be seen by calling rubocop_list_cops without a department parameter.`
    );
  }

  // Apply pagination with conservative limits
  const maxLimit = Math.min(limit, 100);
  const paginatedCops = matchingCops.slice(offset, offset + maxLimit);
  const hasMore = offset + maxLimit < totalCops;

  // Build output
  let output = `RuboCop Cops (${department} department):\n`;
  output += `Showing ${offset + 1}-${offset + paginatedCops.length} of ${totalCops} total cops\n\n`;

  for (const cop of paginatedCops) {
    output += `• ${cop}\n`;
  }

  output += '\n';

  // Add pagination footer
  output += formatPaginationFooter(
    { offset, limit: maxLimit, total: totalCops, hasMore },
    department
  );

  return output;
}

/**
 * Formats department summary from RuboCop output
 */
export function formatDepartmentSummary(stdout: string): string {
  const lines = stdout.split('\n');
  const departments = new Map<string, number>();
  let totalCops = 0;

  // Parse department headers (format: "# Department 'Name' (count):")
  for (const line of lines) {
    const deptMatch = line.match(/^# Department '([^']+)' \((\d+)\):/);
    if (deptMatch?.[1] && deptMatch[2]) {
      const [, deptName, count] = deptMatch;
      const copCount = parseInt(count, 10);
      departments.set(deptName, copCount);
      totalCops += copCount;
    }
  }

  let output = `RuboCop has ${totalCops} total cops across ${departments.size} departments:\n\n`;

  // Sort departments alphabetically for consistent output
  for (const [dept, count] of Array.from(departments.entries()).sort()) {
    output += `• ${dept}: ${count} cops\n`;
  }

  output += `\n💡 To see cops for a specific department, use the 'department' parameter.\n`;
  output += `   Example: { "department": "Style" }\n`;

  return output;
}
