#!/usr/bin/env bash
# sync-ecc-to-project.sh — Fallback: copy ECC config from ~/.cursor/ to project .cursor/.
# Use when Cursor does not load rules/agents/commands/MCP from global ~/.cursor/ in your version.
#
# Usage:
#   ./sync-ecc-to-project.sh [PROJECT_DIR]
#
# PROJECT_DIR: target project root (default: current directory).
#
set -euo pipefail

CURSOR_GLOBAL="${CURSOR_GLOBAL:-$HOME/.cursor}"
PROJECT_DIR="${1:-.}"

if [[ ! -d "$CURSOR_GLOBAL" ]]; then
  echo "Error: $CURSOR_GLOBAL not found. Run install-ecc-cursor-global.sh first." >&2
  exit 1
fi

DEST="$PROJECT_DIR/.cursor"
mkdir -p "$DEST"/{rules,agents,skills,commands}

echo "Syncing $CURSOR_GLOBAL -> $DEST"
[[ -d "$CURSOR_GLOBAL/rules" ]]    && cp -r "$CURSOR_GLOBAL/rules/."    "$DEST/rules/"   2>/dev/null || true
[[ -d "$CURSOR_GLOBAL/agents" ]]   && cp -r "$CURSOR_GLOBAL/agents/."   "$DEST/agents/"  2>/dev/null || true
[[ -d "$CURSOR_GLOBAL/skills" ]]   && cp -r "$CURSOR_GLOBAL/skills/."   "$DEST/skills/"  2>/dev/null || true
[[ -d "$CURSOR_GLOBAL/commands" ]] && cp -r "$CURSOR_GLOBAL/commands/." "$DEST/commands/" 2>/dev/null || true
[[ -f "$CURSOR_GLOBAL/mcp.json" ]] && cp "$CURSOR_GLOBAL/mcp.json" "$DEST/mcp.json"

echo "Done. ECC config synced to $DEST"
