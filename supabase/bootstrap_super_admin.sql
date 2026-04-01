-- 최초 슈퍼관리자 1명 만들기 (한 번만 실행)
--
-- 1) Supabase 대시보드 → Authentication → Users → "Add user"
--    - Email / Password 지정 후 사용자 생성
-- 2) 같은 화면에서 해당 사용자 행을 열어 UUID(id) 복사
-- 3) 아래 :USER_ID 와 이메일·이름·전화만 본인 값으로 바꾼 뒤
--    SQL Editor 에서 실행 (대시보드 SQL은 RLS를 우회합니다)
--
-- profiles.email 은 auth.users 의 email 과 맞추는 것을 권장합니다.

INSERT INTO public.profiles (
  id,
  role,
  status,
  name,
  phone,
  email,
  affiliation
)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,  -- ← 여기에 Auth 사용자 UUID 붙여넣기
  'super_admin',
  'approved',
  '시스템 관리자',
  '010-1111-2222',
  'admin@your-domain.com',  -- ← Auth에 등록한 이메일과 동일하게
  '본부'
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  affiliation = EXCLUDED.affiliation;
