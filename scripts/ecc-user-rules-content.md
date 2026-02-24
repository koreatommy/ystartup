Always respond in Korean.

---
## ECC-style defaults (apply in all projects)

### Coding style
- Immutability: create new objects, never mutate existing ones.
- File organization: many small files over few large files; 200–400 lines typical, 800 max; organize by feature/domain.
- Error handling: handle errors at every level; no silent swallowing; user-friendly messages in UI, detailed logs on server.
- Input validation: validate at system boundaries; schema-based where available; never trust external data.
- Before complete: readable names, functions <50 lines, files <800 lines, no deep nesting (>4), no hardcoded values.

### Security
- Before any commit: no hardcoded secrets; validate inputs; parameterized queries; XSS/CSRF protection; no sensitive data in error messages.
- Secrets: use environment variables or secret manager only; never in source.

### Testing
- Minimum 80% coverage; unit + integration + E2E for critical flows.
- TDD: test first (RED) → minimal implementation (GREEN) → refactor (IMPROVE).

### Structure
- One clear responsibility per file; separate UI from logic, domain from I/O, state from utilities.
- Before adding to a file: if not core responsibility or +50 lines, consider a new module.
- When planning/refactoring: consider /plan and code-review workflow; use security-reviewer for security issues, tdd-guide for tests.
