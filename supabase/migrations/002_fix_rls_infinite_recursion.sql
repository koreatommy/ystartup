-- RLS 무한 재귀 해결을 위한 SECURITY DEFINER 함수
-- profiles 테이블의 admin_read_all 등 정책이 같은 테이블을 서브쿼리로 참조하면
-- RLS가 재귀 적용되어 infinite recursion 에러 발생
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 기존 재귀 정책 삭제
DROP POLICY IF EXISTS "admin_read_all" ON public.profiles;
DROP POLICY IF EXISTS "admin_update_all" ON public.profiles;
DROP POLICY IF EXISTS "coach_read_students" ON public.profiles;

-- 재귀 없는 새 정책 생성
CREATE POLICY "admin_read_all"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() = 'super_admin');

CREATE POLICY "admin_update_all"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'super_admin');

CREATE POLICY "coach_read_students"
  ON public.profiles FOR SELECT
  USING (
    public.get_my_role() = 'coach'
    AND role = 'student'
    AND coach_id = auth.uid()
  );
