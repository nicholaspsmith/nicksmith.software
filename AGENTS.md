# Agent Instructions

This project uses integrated tooling for code intelligence, issue tracking, and semantic operations.

## Integrated Tooling Stack

### 1. Beads (Issue Tracking) - MANDATORY
```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd create             # Create new issue
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git (run before commits)
```

### 2. Serena (Semantic Code Operations)
Use Serena MCP tools for all code analysis and modifications:
- `mcp__plugin_serena_serena__find_symbol` - Find symbols by name
- `mcp__plugin_serena_serena__get_symbols_overview` - Understand file structure
- `mcp__plugin_serena_serena__find_referencing_symbols` - Find usages
- `mcp__plugin_serena_serena__replace_symbol_body` - Modify code
- `mcp__plugin_serena_serena__search_for_pattern` - Regex search

### 3. Lance-Context (Semantic Search)
Use for natural language code discovery:
- `mcp__lance-context__search_code` - "Where is X implemented?"
- `mcp__lance-context__index_codebase` - Re-index after major changes

## Workflow Integration

### Starting Work
1. `bd ready` - Check for available work
2. `mcp__lance-context__search_code` - Understand relevant code
3. `mcp__plugin_serena_serena__get_symbols_overview` - Deep dive
4. `bd update <id> --status in_progress` - Claim the work

### During Implementation
- Use Serena for code analysis and modifications
- Use lance-context for discovery in unfamiliar areas
- Create child issues with `bd create` for sub-tasks

### Landing the Plane (Session Completion)

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Re-index lance-context** - If significant code was added
5. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
6. **Clean up** - Clear stashes, prune remote branches
7. **Verify** - All changes committed AND pushed
8. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
- ALL work must be tracked in Beads - no untracked changes

## Configuration

- Environment: `.env` contains API keys (JINA_API_KEY for lance-context)
- Tooling Reference: `_bmad/_config/custom/tooling-instructions.md`
- Agent Customizations: `_bmad/_config/agents/*.customize.yaml`
