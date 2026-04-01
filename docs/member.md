# 데모 계정 (이메일 = 로그인 아이디)

## 코치 (coach)

| 이름   | 로그인 아이디                    |
| ------ | -------------------------------- |
| 김영월 | coach.kim@demo.ystart.local      |
| 이소방 | coach.lee@demo.ystart.local      |
| 박주천 | coach.park@demo.ystart.local     |

## 학생 (student)

| 이름   | 로그인 아이디                    |
| ------ | -------------------------------- |
| 최민수 | student01@demo.ystart.local      |
| 정서연 | student02@demo.ystart.local      |
| 한지훈 | student03@demo.ystart.local      |
| 윤다은 | student04@demo.ystart.local      |
| 강태양 | student05@demo.ystart.local      |

## 슈퍼 관리자 (super_admin)

`create-super-admin` 스크립트로 생성한 계정을 사용합니다. (`BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD`)

---

## 비밀번호

- **로그인 비밀번호**는 Supabase **Auth**(`auth.users`)에 저장됩니다. `profiles` 테이블에는 평문 비밀번호가 없습니다.
- **앱에서 변경**: 코치·학생은 각각 **내 정보 수정**(코치) / **연락처·이메일 수정**(학생) 화면 하단의 **비밀번호 변경**에서 새 비밀번호를 설정할 수 있습니다. (6자 이상, 확인 입력 일치)
- **더미 시드**: `node scripts/seed-dummy-members.mjs` 실행 시 비밀번호는 다음 우선순위로 결정됩니다.
  1. `COACH_STUDENT_RESET_PASSWORD` (`.env.local`)
  2. `SEED_DUMMY_PASSWORD`
  3. 기본값 `DemoYstart1!`
- **일괄 재설정**: `.env.local`에 `COACH_STUDENT_RESET_PASSWORD`(6자 이상)를 넣은 뒤:

  ```bash
  node scripts/reset-coach-student-passwords.mjs
  ```

  `profiles`에서 `role`이 `coach` 또는 `student`인 모든 사용자의 Auth 비밀번호를 위 값으로 맞춥니다.

**주의**: `.env.local`은 **커밋·공유하지 마세요**. `SUPABASE_SERVICE_ROLE_KEY`와 평문 비밀번호가 함께 있으면 유출 시 전체 계정이 위험합니다.
