# ECC Cursor 전역 설치 (Everything Claude Code)

Cursor 전역(`~/.cursor/`)에 ECC 설정을 한 번 설치해, 프로젝트와 관계없이 모든 프로젝트에서 규칙·에이전트·스킬·커맨드·MCP를 사용할 수 있습니다.

## 설치 (한 번만)

```bash
# 기본: TypeScript만 (common + typescript 규칙)
./scripts/install-ecc-cursor-global.sh

# 여러 언어
./scripts/install-ecc-cursor-global.sh typescript python golang

# 기존 클론한 ECC 레포 경로 지정
./scripts/install-ecc-cursor-global.sh /path/to/everything-claude-code typescript
```

설치 위치: `~/.cursor/` (rules, agents, skills, commands, mcp.json).

## MCP 환경 변수

`~/.cursor/mcp.json`에서 참조하는 env. 필요한 서버만 쓰면 됩니다. `~/.zshrc` 또는 `~/.bashrc`에 추가:

```bash
# GitHub (MCP server-github)
export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token"

# Firecrawl (선택)
export FIRECRAWL_API_KEY="your_firecrawl_key"
```

Supabase, Railway 등 다른 MCP는 `~/.cursor/mcp.json`에서 `YOUR_PROJECT_REF` 등을 실제 값으로 바꾸거나, 해당 서버 문서에 맞게 env를 설정하면 됩니다.

## 폴백: 프로젝트에만 복사

Cursor 버전에 따라 전역에서 rules/agents가 안 보일 수 있습니다. 그때는 프로젝트 루트에서:

```bash
./scripts/sync-ecc-to-project.sh          # 현재 디렉터리
./scripts/sync-ecc-to-project.sh /path/to/project
```

`~/.cursor/` 내용을 해당 프로젝트의 `.cursor/`로 복사합니다.

## User Rules (전역 규칙 문구)

Cursor **User Rules**에 ECC 스타일 요약을 넣어 두면, 모든 프로젝트에서 AI가 같은 원칙을 따릅니다.

- **내용 편집**: `scripts/ecc-user-rules-content.md` 수정 후 아래 스크립트 실행.
- **적용**: `./scripts/apply-ecc-user-rules.sh` — Cursor 전역 설정(DB)에 반영.

Cursor에서도 **Settings → Rules → User Rules**를 열면 동일 내용이 보입니다. (동기화는 스크립트 또는 UI 중 한쪽에서 하세요.)

## 참고

- **Skills**: Cursor는 `~/.cursor/skills/` 전역 경로를 공식 지원합니다.
- **Rules/Agents/Commands/MCP**: 전역 인식 여부는 Cursor 버전에 따라 다를 수 있으므로, 인식되지 않으면 위 폴백 스크립트를 사용하세요.
- 소스: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

## PC 간 동기화 (Dotfiles)

Cursor 전역 설정을 다른 PC와 맞추려면 **cursor-dotfiles** 저장소를 사용합니다. 로컬 경로: `~/cursor-dotfiles`. GitHub에 private 저장소를 만든 뒤 `git remote add origin ...` 하고 push 하면, 다른 PC에서 clone 후 `./deploy-to-cursor.sh` 로 동일 환경을 적용할 수 있습니다. 자세한 절차는 `~/cursor-dotfiles/README.md` 참고.
