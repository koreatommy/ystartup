학생/코치/슈퍼관리자 3단계 회원가입 및 회원관리 시스템을 설계하고 구현해줘.

# 목표
- 학생은 회원가입 시 담당 코치를 선택한다.
- 코치는 본인이 담당하는 학생만 조회할 수 있다.
- 슈퍼관리자는 전체 회원, 학교, 코치-학생 배정을 관리할 수 있다.

# 역할
- super_admin
- coach
- student

# 역할별 권한
## super_admin
- 전체 코치/학생 조회
- 코치별 학생 목록 조회
- 학교별 코치 배정 현황 조회
- 코치/학생 정보 수정
- 코치/학생 비활성화 또는 삭제
- 학교 목록 관리
- 코치 가입 승인/반려
- 학생의 학교, 학년, 담당 코치 변경

## coach
- 본인 정보 조회/수정
- 본인이 담당하는 학생 목록 조회
- 본인이 담당하는 학생 상세 조회
- 학생 수정/삭제 불가
- 본인 담당이 아닌 학생 조회 불가
- 다른 코치 정보 조회 불가

## student
- 본인 정보 조회
- 본인 연락처, 이메일만 수정 가능
- 학교/학년/담당 코치/이름/role/status 변경 불가
- 다른 회원 정보 조회 불가

# 회원가입 정책
## super_admin
- 일반 회원가입 없음
- 운영자가 별도 생성

## coach
- 가입 신청 가능
- 기본 상태: pending
- super_admin 승인 후 approved
- 반려 시 rejected

## student
- 가입 즉시 approved
- 가입 시 학교, 학년, 담당 코치 선택 필수

# 가입 필드
## coach
- affiliation
- name
- phone
- email

## student
- schoolType (중학교 | 고등학교)
- schoolName
- grade (1 | 2 | 3)
- name
- phone
- email
- coachId

# 학교 목록
## 중학교
- 영월중학교
- 봉래중학교
- 옥동중학교
- 녹전중학교
- 마차중학교
- 연당중학교
- 쌍룡중학교
- 주천중학교
- 상동중학교
- 석정여자중학교

## 고등학교
- 영월고등학교
- 한국소방마이스터고등학교
- 마차고등학교
- 주천고등학교
- 상동고등학교
- 석정여자고등학교

학교 목록은 상수로 분리하고, 추후 super_admin이 관리 가능하도록 확장 가능한 구조로 설계해줘.

# 상태값
- pending
- approved
- rejected
- inactive

정책:
- coach 기본 pending
- student 기본 approved
- super_admin 별도 생성 시 approved
- inactive 계정은 로그인 불가

# DB 설계 요구사항
- Prisma 사용하지 말고 Supabase(PostgreSQL) 기준으로 설계해줘.
- DB 스키마는 Supabase CLI 또는 MCP로 직접 작성하는 방식으로 설계해줘.
- 실행 가능한 PostgreSQL SQL migration 형태로 작성해줘.
- enum, table, foreign key, unique, index, check 제약 포함해줘.
- 필요하면 auth.users와 연결되는 profiles 구조를 검토해줘.
- 관계:
  - coach 1명 : student 여러 명
  - student 1명 : coach 1명
- 최소 필드:
  - id
  - role
  - status
  - name
  - phone
  - email
  - created_at
  - updated_at
  - affiliation
  - school_type
  - school_name
  - grade
  - coach_id

# RLS 정책 요구사항
Supabase RLS까지 설계해줘.
- super_admin: 전체 회원 조회/수정 가능
- coach: 본인 정보 조회/수정 가능
- coach: 본인이 담당하는 student만 조회 가능
- student: 본인 정보만 조회/수정 가능
- student는 school, grade, coach_id, name, role, status 직접 수정 불가
- 앱 레벨 RBAC + DB 레벨 RLS 둘 다 설계해줘

# validation
## 공통
- name 필수
- phone 필수
- email 필수
- 이메일 형식 검증
- phone은 000-0000-0000 형식 검증

## coach
- affiliation 필수

## student
- schoolType 필수
- schoolName 필수
- grade 필수
- coachId 필수
- schoolName은 schoolType에 따라 선택 목록이 달라져야 함
- 이메일 중복 방지 고려

# 수정 가능 범위
## super_admin
- 코치/학생 정보 전체 수정 가능
- 학교/학년/담당 코치 변경 가능
- 상태값 변경 가능

## coach
- affiliation, phone, email만 수정 가능

## student
- phone, email만 수정 가능

# 화면 요구사항
## 공개
- 학생 회원가입 페이지
- 코치 회원가입 페이지
- 로그인 페이지

## student
- 내 정보 조회
- 내 정보 수정

## coach
- 내 정보 조회/수정
- 담당 학생 목록
- 담당 학생 상세

## super_admin
- 전체 회원 목록
- 코치 목록
- 학생 목록
- 코치 승인 관리
- 학교 목록 관리
- 회원 상세
- 회원 수정

# 접근 제어
- /admin/** : super_admin만
- /coach/** : coach만
- /student/** : student만
- coach는 API 레벨에서도 본인 담당 학생만 조회 가능해야 함
- 프론트 숨김이 아니라 서버 검증 필수
- RLS와 서버 로직이 일관되게 동작해야 함

# 추가 규칙
- 학생 가입 시 반드시 코치 선택
- coach 선택 드롭다운에는 approved 상태 코치만 노출
- pending/rejected/inactive 코치는 학생 선택 대상 제외
- 학생은 담당 코치를 직접 변경할 수 없음
- coach는 학생 수정 절대 불가
- 삭제보다 inactive 비활성화를 우선 고려

# 산출물 순서
아래 순서대로 먼저 설계 결과를 보여줘.
1. 전체 기능 설계안
2. 데이터 모델 설계
3. 권한 정책 표
4. 페이지 구조
5. API 엔드포인트 설계
6. validation 규칙
7. Supabase SQL schema 초안
8. Supabase RLS 정책 초안
9. Supabase CLI migration 예시 또는 MCP 작업 절차
10. Next.js App Router 폴더 구조 제안
11. 구현 우선순위

그 다음 실제 구현 코드로 진행해줘.

# 작성 원칙
- 정책에 없는 기능 임의 추가 금지
- role, status, school list는 상수 또는 enum 분리
- validation schema 분리
- 접근 제어 로직 공통화
- student / coach / admin 기능 명확히 분리
- 유지보수 가능하고 확장 가능한 구조
- Supabase 중심으로 설계