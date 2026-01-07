# Project Tooling Instructions

This project uses integrated tooling for code intelligence, issue tracking, and semantic code operations.

## Tool Priority Order

When working with code in this project, use tools in this priority order:

### 1. Serena (Semantic Code Operations)
Use Serena MCP tools for **all code analysis and modifications**:
- `mcp__plugin_serena_serena__find_symbol` - Find symbols by name/path
- `mcp__plugin_serena_serena__get_symbols_overview` - Understand file structure
- `mcp__plugin_serena_serena__find_referencing_symbols` - Find usages
- `mcp__plugin_serena_serena__replace_symbol_body` - Modify code symbols
- `mcp__plugin_serena_serena__search_for_pattern` - Regex search across codebase
- `mcp__plugin_serena_serena__read_file` - Read specific files
- `mcp__plugin_serena_serena__replace_content` - Regex-based replacements

**When to use Serena:**
- Reading/understanding code structure
- Making targeted code changes
- Finding symbol definitions and references
- Refactoring operations
- Any operation where you need to understand code relationships

### 2. Lance-Context (Semantic Code Search)
Use lance-context for **natural language code discovery**:
- `mcp__lance-context__search_code` - Search with natural language queries
- `mcp__lance-context__index_codebase` - Re-index after major changes
- `mcp__lance-context__get_index_status` - Check index health

**When to use lance-context:**
- "Where is X implemented?"
- "Find code related to [concept]"
- Understanding unfamiliar parts of the codebase
- Discovering patterns across the codebase
- When you don't know exact symbol names

**Important:** Run `index_codebase` after adding significant new code.

### 3. Beads (Issue Tracking)
Use `bd` commands for **all work tracking**:
```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd create             # Create new issue
bd update <id>        # Update issue status
bd close <id>         # Complete work
bd sync               # Sync with git
```

**When to use Beads:**
- Starting work: Check `bd ready` first
- During work: Update status with `bd update`
- Finding issues: Create with `bd create`
- Completing work: Close with `bd close`
- Always: `bd sync` before committing

## Workflow Integration

### Starting a Task
1. `bd ready` - Check for available work
2. `mcp__lance-context__search_code` - Understand relevant code areas
3. `mcp__plugin_serena_serena__get_symbols_overview` - Deep dive into specific files
4. `bd update <id> --status in_progress` - Claim the work

### During Implementation
1. Use Serena tools for code analysis and modifications
2. Use lance-context for discovery when exploring unfamiliar areas
3. Create child issues with `bd create` for discovered sub-tasks

### Completing Work
1. `bd close <id>` - Mark issue complete
2. `bd sync` - Sync issues with git
3. `mcp__lance-context__index_codebase` - Update search index if significant changes
4. Commit and push

## Environment Setup

The following environment variables are configured:
- `JINA_API_KEY` - For lance-context embeddings (in .env)

## Notes

- Prefer Serena over basic grep/read for code operations
- Use lance-context for conceptual searches, Serena for precise symbol operations
- Always track work in Beads - no untracked changes
- Re-index lance-context after adding new features or significant refactoring
