#!/usr/bin/env bash
# install-ecc-cursor-global.sh — Install ECC (everything-claude-code) Cursor config to ~/.cursor/ (global).
# Run once; then all projects can use ECC rules, agents, skills, commands, and MCP without per-project setup.
#
# Usage:
#   ./install-ecc-cursor-global.sh [SOURCE_DIR] [LANG ...]
#
# Examples:
#   ./install-ecc-cursor-global.sh                          # clone ECC to temp, install with typescript only
#   ./install-ecc-cursor-global.sh "" typescript python      # clone, install common + typescript + python
#   ./install-ecc-cursor-global.sh /path/to/everything-claude-code typescript golang
#
# SOURCE_DIR: optional. If provided, use this path as ECC repo (must contain .cursor/). If "" or omitted, clone to temp.
# LANG: one or more of typescript, python, golang. Default: typescript.
#
set -euo pipefail

ECC_REPO_URL="https://github.com/affaan-m/everything-claude-code.git"
CURSOR_GLOBAL="${CURSOR_GLOBAL:-$HOME/.cursor}"
TMP_CLONE=""
USE_SOURCE=""

# --- Parse args ---
if [[ -n "${1:-}" && -d "${1}/.cursor" ]]; then
  USE_SOURCE="$1"
  shift
fi

if [[ $# -gt 0 ]]; then
  LANGS=("$@")
else
  LANGS=(typescript)
fi

# --- Resolve ECC source ---
if [[ -n "$USE_SOURCE" ]]; then
  ECC_DIR="$USE_SOURCE"
  echo "Using ECC source: $ECC_DIR"
else
  TMP_CLONE="$(mktemp -d)"
  trap 'rm -rf "$TMP_CLONE"' EXIT
  echo "Cloning ECC (depth 1)..."
  git clone --depth 1 "$ECC_REPO_URL" "$TMP_CLONE"
  ECC_DIR="$TMP_CLONE"
fi

CURSOR_SRC="$ECC_DIR/.cursor"
if [[ ! -d "$CURSOR_SRC" ]]; then
  echo "Error: $CURSOR_SRC not found." >&2
  exit 1
fi

# --- Create global dirs ---
echo "Installing to $CURSOR_GLOBAL/"
mkdir -p "$CURSOR_GLOBAL"/{rules,agents,skills,commands}

# --- Rules: common + context + hooks-guidance + per-language ---
echo "Installing rules (common + context + ${LANGS[*]})..."
for f in "$CURSOR_SRC/rules"/common-*.md "$CURSOR_SRC/rules"/context-*.md "$CURSOR_SRC/rules/hooks-guidance.md"; do
  [[ -f "$f" ]] && cp "$f" "$CURSOR_GLOBAL/rules/"
done
for lang in "${LANGS[@]}"; do
  if [[ "$lang" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    for f in "$CURSOR_SRC/rules"/${lang}-*.md; do
      [[ -f "$f" ]] && cp "$f" "$CURSOR_GLOBAL/rules/"
    done
  fi
done

# --- Agents, Skills, Commands (full copy) ---
echo "Installing agents..."
cp -r "$CURSOR_SRC/agents/." "$CURSOR_GLOBAL/agents/" 2>/dev/null || true
echo "Installing skills..."
cp -r "$CURSOR_SRC/skills/." "$CURSOR_GLOBAL/skills/" 2>/dev/null || true
echo "Installing commands..."
cp -r "$CURSOR_SRC/commands/." "$CURSOR_GLOBAL/commands/" 2>/dev/null || true

# --- MCP ---
if [[ -f "$CURSOR_SRC/mcp.json" ]]; then
  echo "Installing mcp.json..."
  cp "$CURSOR_SRC/mcp.json" "$CURSOR_GLOBAL/mcp.json"
fi

echo "Done. ECC Cursor config installed to $CURSOR_GLOBAL/"
echo "Set MCP env vars (e.g. in ~/.zshrc): GITHUB_PERSONAL_ACCESS_TOKEN, etc. See scripts/README-ECC-CURSOR.md"
