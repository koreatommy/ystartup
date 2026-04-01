# Y-START 앱 페이지 구성 및 로직

이 문서는 로그인·회원가입·워크북 대시보드·역할별 회원관리 화면이 어떻게 연결되는지, 서버/미들웨어에서 어떤 규칙으로 보호되는지 정리합니다.

---

## 1. 개요

- **인증**: Supabase Auth (`signInWithPassword`, `signUp`, 세션 쿠키).
- **권한·승인 상태**: `profiles` 테이블의 `role`, `status`로 결정.
- **역할(`role`)**: `super_admin` | `coach` | `student` (`src/constants/member.ts`의 `ROLES`).
- **상태(`status`)**: `pending` | `approved` | `rejected` | `inactive` (`STATUSES`).
- **기본 가입 시 상태** (`DEFAULT_STATUS`): 코치는 `pending`, 학생은 `approved`, 슈퍼관리자는 스크립트 등으로 `approved`로 생성되는 것을 전제로 합니다.

---

## 2. 주요 라우트 맵

| 경로 | 설명 |
|------|------|
| `/login` | 로그인 폼. 서버 액션 `login` 호출 후 성공 시 `/`로 이동. |
| `/signup/student` | 학생 회원가입. |
| `/signup/coach` | 코치 가입 신청. |
| `/` | 워크북 대시보드(홈). 로그인·승인된 사용자만 본문; 역할에 따라 회원 영역 링크만 다름. |
| `/pending` | `status !== approved`인 사용자용 승인 대기 안내. |
| `/admin` | 슈퍼관리자 회원관리 콘솔. |
| `/coach` | 코치 업무·담당 학생 조회 등. |
| `/student` | 학생 본인 정보·연락처 수정 등. |

공개 경로(비로그인 접근 허용, 미들웨어 기준): `/login`, `/signup`, `/signup/student`, `/signup/coach` 및 해당 하위 경로.

---

## 3. 세션·접근 제어 (`updateSession`)

구현 위치: `src/lib/supabase/middleware.ts`의 `updateSession`.  
동일 로직을 `src/proxy.ts`에서 다시 export합니다. Next.js에서 **실제로 모든 요청에 적용**하려면 일반적으로 프로젝트 루트 또는 `src/middleware.ts`에서 `updateSession(request)`를 호출해야 합니다(저장소 상태에 따라 파일 유무를 확인하세요).

### 3.1 Supabase 미설정

`isSupabaseConfigured()`가 false이면 세션 검사 없이 `NextResponse.next`만 반환합니다.

### 3.2 비로그인 사용자

- 공개 경로가 아니면 → **`/login`으로 리다이렉트**.

### 3.3 로그인 + 공개 경로 (`/login`, `/signup/*`)

`profiles`에서 `role`, `status` 조회 후:

- 프로필 없음 → 그대로 통과(응답 유지).
- `status !== approved` → **`/pending`**.
- 승인됨 → **`/`** (로그인/가입 페이지에 머무르지 않음).

### 3.4 로그인 + 보호된 경로

- `status !== approved`이고 경로가 `/pending`이 아니면 → **`/pending`**.
- `status === approved`이면 역할별 **회원 전용 경로** 제한:
  - `super_admin` → 허용: `/admin` 하위.
  - `coach` → 허용: `/coach` 하위.
  - `student` → 허용: `/student` 하위.
- `/admin`, `/coach`, `/student` 중 **자기 역할에 맞지 않는 경로**로 들어가면 → **`/`**로 리다이렉트.

즉, 승인된 사용자도 URL로 남의 역할 페이지를 직접 치면 홈(워크북)으로 돌아갑니다.

### 3.5 리프레시 토큰 오류

`refresh_token_not_found` 등 “오래된 세션”으로 판단되면 `signOut`으로 쿠키를 정리합니다.

---

## 4. 로그인 화면 (`/login`)

- **파일**: `src/app/login/page.tsx` (클라이언트 컴포넌트 + `Suspense`).
- **제출**: 서버 액션 `login(email, password)` (`src/lib/actions/auth.ts`).
  - 성공 시 `redirect("/")`.
  - 실패 시 에러 메시지 표시(Supabase 메시지는 `mapSupabaseAuthErrorMessage`로 가공).
- **쿼리 파라미터**:
  - `?registered=student` → 학생 가입 완료 안내 배너.
  - `?registered=coach` → 코치는 관리자 승인 후 로그인 가능 안내.
- **하단 링크**: `/signup/student`, `/signup/coach`.

페이지 레벨에서 별도 역할 검사는 없고, 미들웨어·다음 단계(홈)에서 승인/역할이 반영됩니다.

---

## 5. 회원가입

### 5.1 학생 (`/signup/student`)

- **파일**: `src/app/signup/student/page.tsx`.
- **코치 목록**: 마운트 시 `getApprovedCoaches()` → Supabase RPC `list_approved_coaches`. 승인된 코치만 선택 가능.
- **학교/학년**: `SCHOOL_TYPES`, `SCHOOLS`, `GRADES` (`src/constants/member.ts`). 학교 유형 변경 시 학교명 초기화.
- **코치 필터**: 선택한 학교 유형·학교명과 코치의 `school_type` / `school_name`이 맞는 항목만 드롭다운에 표시(코치에 값이 없으면 필터에서 제외하지 않는 완화 로직 포함).
- **서버 액션**: `signupStudent` (`auth.ts`).
  - 클라이언트 검증: `validateStudentSignup`.
  - 서버에서 다시 RPC로 코치 유효성 검증.
  - **관리자 경로**(서비스 롤 + rate limit 우회 가능 시): `auth.admin.createUser` 후 `profiles` insert, 실패 시 Auth 사용자 삭제.
  - **일반 경로**: `signUp` → 세션 없으면 `signInWithPassword`로 프로필 insert 가능하게 한 뒤 `profiles` insert → **`signOut`** → `redirect("/login?registered=student")`.
  - 학생 프로필: `role: "student"`, `status: DEFAULT_STATUS.student` → **`approved`**.

### 5.2 코치 (`/signup/coach`)

- **파일**: `src/app/signup/coach/page.tsx`.
- **필드**: 소속, 이름, 연락처, 이메일, 비밀번호. `validateCoachSignup`.
- **서버 액션**: `signupCoach` — 학생과 동일한 이중 경로(관리자/일반) 패턴.
  - 코치 프로필: `role: "coach"`, `status: DEFAULT_STATUS.coach` → **`pending`**.
  - 완료 후 `redirect("/login?registered=coach")`.

---

## 6. 승인 대기 화면 (`/pending`)

- **파일**: `src/app/pending/page.tsx`.
- 코치처럼 가입 직후 `pending`인 경우 미들웨어가 보호된 페이지 대신 여기로 보냅니다.
- **로그아웃**: `logout` 서버 액션 → `/login`.

---

## 7. 워크북 대시보드 (홈 `/`)

- **파일**: `src/app/page.tsx` (서버 컴포넌트, `dynamic = "force-dynamic"`).
- **흐름**:
  1. `getCurrentProfile()` — 세션 사용자의 `profiles` 전체 행.
  2. 없으면 → `redirect("/login")`.
  3. `status !== approved` → `redirect("/pending")`.
  4. 역할에 따라 `memberAreaHref` 결정:  
     `super_admin` → `/admin`, `coach` → `/coach`, `student` → `/student` (매핑에 없으면 `/login`).
  5. `<WorkbookDashboard memberAreaHref={...} />` 렌더.

- **UI 조립**:
  - `WorkbookDashboard` → `DashboardLayout` (`Sidebar`, `Header`, `MainContent`, `MobileNav` 등).
  - 헤더의 **「회원 정보」** 링크가 `memberAreaHref`로 연결되어 역할별 회원관리 화면으로 이동합니다.

워크북 본문은 PDF/챕터 기반 학습 UI이며, 인증과 직접 연관된 분기는 홈에서 프로필 검사와 회원 영역 링크 전달 정도입니다.

---

## 8. 회원관리 화면 (역할별)

각 경로는 **서버 페이지**에서 `getCurrentProfile()` 후 `role`이 일치할 때만 대시보드를 렌더하고, 아니면 **`redirect("/")`** 합니다. 미들웨어와 이중으로 역할을 막습니다.

### 8.1 슈퍼관리자 (`/admin`)

- **페이지**: `src/app/admin/page.tsx` → `AdminDashboard`.
- **레이아웃**: `MemberLayout` + `AdminContent`.
- **메뉴 구성** (`AdminDashboard.tsx`): 운영 현황, 승인 대기, 회원 목록·코치·학생, 코치 승인, 학생-코치 배정, 학교별 배정 현황, 기준정보, 설정 등.
- **데이터**: `getAdminStats`, `listProfilesPaged`, `updateMemberStatus`, `updateProfile`, `getStudentSchoolCounts`, `getSchoolCoachAssignments` 등 `src/lib/actions/members.ts`의 서버 액션.
- **권한**: 상태 변경·타인 프로필 수정은 액션 내부에서 `callerProfile.role === "super_admin"` 검사.

### 8.2 코치 (`/coach`)

- **페이지**: `src/app/coach/page.tsx` → `CoachDashboard`.
- **메뉴**: 내 정보 요약, 담당 학생, 내 정보 조회/수정 등 (`CoachContent`).
- **데이터**: `getMyStudents`, `listProfilesPaged`(필요 시), `updateMyProfile`, `updateMyPassword` 등.

### 8.3 학생 (`/student`)

- **페이지**: `src/app/student/page.tsx` → `StudentDashboard`.
- **메뉴**: 내 정보 요약, 담당 코치, 계정 상태, 연락처/이메일 수정 (`StudentContent`).
- **정책**: 주석상 슈퍼관리자/코치와 달리 목록 페이징을 두지 않고 단건·소량 UI 위주.

### 8.4 회원 영역 공통 UI

- `MemberHeader`: **`/`(워크북)** 링크, 프로필 이름·역할 표시, `logout` 폼 버튼 (`src/components/member/MemberHeader.tsx`).

---

## 9. API 라우트 (보조)

| 경로 | 용도 |
|------|------|
| `GET /api/members` | 로그인 사용자 프로필의 역할에 따라 `profiles` 조회 범위 제한. 코치는 담당 학생만, 학생은 본인만. (쿼리 `role`, `status` 필터) |
| `PATCH` 등 `/api/members/[id]`, `/api/members/[id]/status` | 멤버 단건/상태 변경(구현 세부는 해당 파일 참고). |
| `GET /api/coaches/approved` | 승인된 코치 목록 등. |

UI는 주로 **서버 액션**을 사용하고, API는 별도 클라이언트/연동용으로 둔 형태입니다.

---

## 10. 로그아웃

- `logout()` (`auth.ts`): Supabase `signOut` 후 **`redirect("/login")`**.
- 로그인 페이지·pending·회원 헤더 등에서 `form action={logout}` 패턴으로 호출됩니다.

---

## 11. 사용자 여정 요약 (다이어그램)

```mermaid
flowchart TD
  A[비로그인] -->|보호 경로 접근| L[/login]
  L -->|login 성공| H[/]
  S[signup/student] -->|성공| L2[/login?registered=student]
  C[signup/coach] -->|성공| L3[/login?registered=coach]
  L2 --> H
  L3 --> L
  H -->|profile approved| W[WorkbookDashboard]
  H -->|not approved| P[/pending]
  W -->|회원 정보| R{role}
  R -->|super_admin| AD[/admin]
  R -->|coach| CO[/coach]
  R -->|student| ST[/student]
  AD -->|워크북 링크| W
  CO -->|워크북 링크| W
  ST -->|워크북 링크| W
```

---

## 12. 관련 소스 파일 빠른 참조

| 영역 | 주요 파일 |
|------|-----------|
| 미들웨어 로직 | `src/lib/supabase/middleware.ts`, `src/proxy.ts` |
| 인증·가입 | `src/lib/actions/auth.ts` |
| 프로필·관리자 액션 | `src/lib/actions/members.ts` |
| 역할·상태 상수 | `src/constants/member.ts` |
| 타입 | `src/types/member.ts` |
| 워크북 셸 | `src/components/WorkbookDashboard.tsx`, `DashboardLayout.tsx`, `Header.tsx` |
| 회원 셸 | `src/components/member/MemberLayout.tsx`, `MemberHeader.tsx` |

데모 계정·비밀번호 정책은 `docs/member.md`를 참고하면 됩니다.
