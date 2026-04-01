# 회원가입 테스트 가이드

`/signup/student`, `/signup/coach` 테스트가 `email rate limit exceeded`로 막히는 상황을 빠르게 우회/완화하기 위한 운영 가이드입니다.

## 1) 개발 환경에서 Rate Limit 완화 (권장)

Supabase Dashboard에서 개발 프로젝트 기준으로 아래를 완화하세요.

1. `Authentication` -> `Rate Limits` 이동
2. 이메일 회원가입/인증 관련 제한치를 개발용으로 상향
3. 저장 후 1~2분 뒤 재시도

주의:
- 운영(Production) 프로젝트는 보안상 과도한 완화를 피하세요.
- 완화는 개발/스테이징 환경에서만 적용하세요.

## 2) 테스트 전용 계정 경로 사용 (Rate Limit 무관)

이 프로젝트는 서비스 롤 키 기반 시드 스크립트를 제공합니다.
이 경로는 Supabase Auth 일반 가입 제한의 영향을 받지 않아 QA 반복 테스트에 적합합니다.

### 사전 준비

`.env.local`에 아래 값이 있어야 합니다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- (선택) `SEED_DUMMY_PASSWORD`

### 실행

```bash
npm run create-super-admin
npm run seed-dummy-members
```

### 결과

- 승인 코치/학생 더미 계정이 `auth.users`, `public.profiles`에 upsert 됩니다.
- 학생 가입 화면의 `담당 코치` 드롭다운이 DB의 승인 코치 기반으로 채워집니다.

## 3) 개발용 회원가입 우회 모드 (코드 레벨)

회원가입 폼 자체를 계속 테스트해야 하는 경우, 아래 환경변수를 켜면
서버 액션이 `auth.signUp` 대신 `service_role` 기반 `admin.createUser` 경로를 사용합니다.

`.env.local`

```bash
BYPASS_SUPABASE_SIGNUP_RATE_LIMIT=true
```

필수 조건:
- `SUPABASE_SERVICE_ROLE_KEY` 설정됨
- 개발/스테이징 환경에서만 사용 (운영 비권장)

## 권장 테스트 순서

1. `npm run create-super-admin`
2. `npm run seed-dummy-members`
3. `npm run dev`
4. Playwright로 `/signup/student`, `/signup/coach` 검증
5. 필요 시 DB에서 `auth.users`, `public.profiles` 확인
