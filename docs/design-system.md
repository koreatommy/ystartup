# Y-START 디자인 시스템

이 문서는 Y-START 프로젝트의 디자인 토큰, 컴포넌트 패턴, 타이포그래피, 반응형 규칙을 한 곳에 정리합니다.
소스 오브 트루스는 `src/app/globals.css`의 CSS 변수와 `src/components/ui/` 컴포넌트입니다.

---

## 1. 브랜드 톤

- 교육적이면서도 현대적인 분위기
- 신뢰감 있는 구조 중심 디자인
- 청소년 대상이지만 지나치게 가볍지 않은 균형감
- 과도한 광고성 표현 지양, 기능 중심 구체적 문구 사용

---

## 2. 컬러 시스템

### 시맨틱 역할

| 역할 | 다크 모드 변수 | 값 (다크) |
|------|---------------|-----------|
| 배경 (베이스) | `--color-bg-base` | `#0a0a0f` |
| 배경 그라디언트 | `--color-bg-gradient-start/end` | `#0a0a0f` → `#1a1a2e` |
| 텍스트 (기본) | `--color-text` | `#ffffff` |
| 텍스트 (보조) | `--color-text-secondary` | `rgba(255,255,255,0.7)` |
| 텍스트 (뮤트) | `--color-text-muted` | `rgba(255,255,255,0.5)` |
| 텍스트 (미약) | `--color-text-subtle` | `rgba(255,255,255,0.3)` |
| Primary | `--color-primary` | `#8b5cf6` (violet) |
| Secondary | `--color-secondary` | `#06b6d4` (cyan) |
| Success | `--color-success` | `#10b981` |
| Warning | `--color-warning` | `#f59e0b` |
| Danger | `--color-danger` | `#ef4444` |

### 글래스 효과

| 변수 | 다크 값 |
|------|--------|
| `--glass-bg` | `rgba(255,255,255,0.05)` |
| `--glass-bg-hover` | `rgba(255,255,255,0.08)` |
| `--glass-border` | `rgba(255,255,255,0.1)` |
| `--glass-blur` | `16px` |

### 그라디언트 액센트

| 이름 | 시작 | 끝 |
|------|------|-----|
| Primary | `#6366f1` (indigo) | `#8b5cf6` (violet) |
| Secondary | `#06b6d4` (cyan) | `#3b82f6` (blue) |
| Success | `#10b981` | `#34d399` |

### 테마 전환

라이트 모드는 `[data-theme="light"]` 셀렉터로 모든 CSS 변수를 오버라이드합니다.

---

## 3. 타이포그래피

| 용도 | 클래스 | 폰트 |
|------|--------|------|
| 제목·네비게이션·한글 중심 | `.font-sidebar` | Noto Sans KR |
| 본문·영문·보조 | `.font-main` | Inter |

### 랜딩 페이지 스케일

| 요소 | 모바일 | 태블릿 | 데스크톱 |
|------|--------|--------|----------|
| 히어로 헤드라인 | `text-4xl` | `text-5xl` | `text-6xl` |
| 서브 헤드라인 | `text-lg` | `text-xl` | `text-xl` |
| 섹션 제목 | `text-2xl` | `text-3xl` | `text-3xl` |
| 본문 | `text-base` | `text-base` | `text-base` |
| CTA 라벨 | `text-base` | `text-lg` | `text-lg` |

공통: `tracking-tight` (제목), `leading-relaxed` (본문), `font-bold` (제목), `font-semibold` (CTA).

---

## 4. 간격·레이아웃

- 콘텐츠 최대 너비: `max-w-5xl`
- 좌우 패딩: `px-4 md:px-8`
- 섹션 간 수직: `py-16 md:py-24` (랜딩), `space-y-6` (대시보드)
- 앵커 스크롤 오프셋: `scroll-mt-20`
- 네비바 본문 오프셋: `pt-16`

---

## 5. 컴포넌트 패턴

### Button (`src/components/ui/button.tsx`)

| Variant | 용도 |
|---------|------|
| `gradient` | 주 CTA (glow-primary 조합) |
| `glass` | 보조 CTA, 보조 액션 |
| `ghost` | 인라인 네비게이션 |
| `glass-primary` | 강조 보조 |
| `outline` | 경계선 스타일 |

사이즈: `xs` / `sm` / `default` / `lg` / `xl`.

### Card (`src/components/ui/card.tsx`)

| Variant | 용도 |
|---------|------|
| `glass` | 기본 카드 (대시보드·랜딩) |
| `glass-hover` | 호버 인터랙션이 필요한 카드 (기능 소개 등) |
| `elevated` | 강조 카드 |
| `gradient` | 그라디언트 보더 카드 |

### 유틸 클래스 (`globals.css @layer components/utilities`)

- `.glass`, `.glass-hover` — 글래스모피즘
- `.gradient-primary`, `.gradient-secondary` — 배경 그라디언트
- `.text-gradient-primary` — 텍스트 그라디언트
- `.glow-primary`, `.glow-secondary` — 박스 글로우
- `.card-hover` — 호버 시 translateY + shadow

---

## 6. 반응형 브레이크포인트

Tailwind 기본: `sm(640px)` / `md(768px)` / `lg(1024px)`.

| 뷰포트 | 네비바 | 카드 grid | CTA 배치 |
|--------|--------|----------|----------|
| < 640px | 로고 + 햄버거 | 1열 | 세로 풀너비 |
| 640~1024px | 로고 + 텍스트 버튼 | 2열 | 가로 |
| 1024px+ | 로고 + 버튼 + 넉넉한 여백 | 2~4열 | 가로 + glow |

터치 타깃 최소 48px (`h-12`+).

---

## 7. 접근성

- 모든 인터랙티브 요소에 `focus-visible:ring-2 ring-[var(--ring)]`
- 글래스 위 텍스트 최소 WCAG AA 대비(다크: 흰 텍스트 on `rgba(255,255,255,0.05)`)
- 버튼·링크에 `aria-label` 필수(아이콘만 있는 경우)
- 키보드 탭 순서가 시각적 순서와 일치

---

## 8. 챕터 컬러

| 챕터 | 변수 | 색상 |
|------|------|------|
| 01 | `--color-bar-01` | `#8b5cf6` |
| 02 | `--color-bar-02` | `#ec4899` |
| 03 | `--color-bar-03` | `#f97316` |
| 04 | `--color-bar-04` | `#eab308` |
| 05 | `--color-bar-05` | `#84cc16` |
| 06 | `--color-bar-06` | `#06b6d4` |
| 07 | `--color-bar-07` | `#3b82f6` |
| 08 | `--color-bar-08` | `#2563eb` |
| 09 | `--color-bar-09` | `#4f46e5` |
| 10 | `--color-bar-10` | `#6366f1` |
