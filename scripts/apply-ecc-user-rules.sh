#!/usr/bin/env bash
# apply-ecc-user-rules.sh — Apply ECC-style rules to Cursor User Rules (Settings > Rules > User Rules).
# User Rules apply to ALL projects. Content is read from scripts/ecc-user-rules-content.md.
#
# Usage: ./scripts/apply-ecc-user-rules.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTENT_FILE="$SCRIPT_DIR/ecc-user-rules-content.md"
DB_PATH="$HOME/Library/Application Support/Cursor/User/globalStorage/state.vscdb"

if [[ ! -f "$CONTENT_FILE" ]]; then
  echo "Error: $CONTENT_FILE not found." >&2
  exit 1
fi

if [[ ! -f "$DB_PATH" ]]; then
  echo "Error: Cursor state DB not found at $DB_PATH (is Cursor installed?)." >&2
  exit 1
fi

python3 -c "
import sqlite3
with open(\"$CONTENT_FILE\", \"r\") as f:
    content = f.read()
conn = sqlite3.connect(\"$DB_PATH\")
cur = conn.execute(\"UPDATE ItemTable SET value = ? WHERE key = 'aicontext.personalContext'\", (content,))
conn.commit()
print('Cursor User Rules updated from ecc-user-rules-content.md (' + str(cur.rowcount) + ' row).')
conn.close()
"
