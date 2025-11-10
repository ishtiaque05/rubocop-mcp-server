# Pagination Guide

The `rubocop_list_cops` tool supports pagination to handle large result sets that might exceed token limits.

## How It Works

### Without Department Filter

Returns a summary of all departments (no pagination needed):

```
List RuboCop cops
```

Response:
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

### With Department Filter

Returns paginated results:

```
List Rails RuboCop cops
```

Default: Shows first 50 cops.

Response:
```
RuboCop Cops (Rails department):
Showing 1-50 of 80 total cops

• Rails/ActionControllerFlashBeforeRender
• Rails/ActionControllerTestCase
...

📄 More results available. To see the next page:
   Use limit: 50, offset: 50
   Remaining: 30 cops
```

## Pagination Parameters

### `limit` (optional)
- Default: `50`
- Maximum: `200`
- Controls how many cops to show per page

### `offset` (optional)
- Default: `0`
- Number of cops to skip
- Use for accessing subsequent pages

## Usage Examples

### Get First Page (Default)
```
List Rails cops
```

Equivalent to:
```json
{
  "department": "Rails",
  "limit": 50,
  "offset": 0
}
```

### Get Second Page
```
List Rails cops with offset 50
```

Or explicitly:
```json
{
  "department": "Rails",
  "limit": 50,
  "offset": 50
}
```

### Get 100 Cops at Once
```json
{
  "department": "Style",
  "limit": 100,
  "offset": 0
}
```

### Get Third Page of 20 Cops Each
```json
{
  "department": "Lint",
  "limit": 20,
  "offset": 40
}
```

## Navigating Pages

The response tells you:
1. Current range: "Showing 1-50 of 150 total cops"
2. If more results exist
3. What offset to use for the next page
4. How many cops remain

### Example Navigation

**Page 1:**
```
Showing 1-50 of 120 total cops
📄 More results available. To see the next page:
   Use limit: 50, offset: 50
   Remaining: 70 cops
```

**Page 2:**
```
Showing 51-100 of 120 total cops
📄 More results available. To see the next page:
   Use limit: 50, offset: 100
   Remaining: 20 cops
```

**Page 3 (Last):**
```
Showing 101-120 of 120 total cops
✓ All cops displayed for Rails department.
```

## Best Practices

1. **Start with summary**: First ask for all departments to understand what's available
2. **Choose your limit**: Use smaller limits (20-50) for readability, larger (100-200) for completeness
3. **Follow the hints**: The response tells you exactly what offset to use next
4. **Know when to stop**: When you see "All cops displayed", you've reached the end

## Common Scenarios

### Scenario 1: Browsing a Department

```
You: List Rails cops

Claude: [Shows first 50]

You: Show more Rails cops

Claude: [Uses offset: 50, shows next 50]
```

### Scenario 2: Getting All Cops from a Department

```
You: Get all Style cops

Claude: [Uses limit: 200 to minimize requests]
   If > 200: Shows first 200, then next 200, etc.
```

### Scenario 3: Searching for Specific Cop

```
You: List Rails cops

Claude: [Shows first 50]

You: Show more, I'm looking for ActiveRecord cops

Claude: [Shows next page until found]
```

## Token Limits

Without pagination, listing all RuboCop cops could exceed 85,000 tokens (way over the 25,000 limit).

With pagination:
- **Summary view**: ~500 tokens
- **50 cops**: ~2,000-3,000 tokens
- **100 cops**: ~4,000-6,000 tokens
- **200 cops**: ~8,000-12,000 tokens

All well within limits!

## Troubleshooting

**Response says "No cops found"?**
- Check the department name spelling
- Use summary view to see available departments

**Not sure what offset to use?**
- The response tells you exactly: "Use limit: 50, offset: 50"
- Or start from 0 and increment by your limit

**Want to see all cops without pagination?**
- Not possible without hitting token limits
- Use a department filter and page through results
- Or use `rubocop_show_cop` for specific cops
