-- 학생이 본인에게 배정된 코치 프로필을 조회할 수 있도록 허용
-- 기존 users_read_own 정책은 본인 행만 허용하므로, student 화면의 담당 코치 조회가 차단됨

CREATE OR REPLACE FUNCTION public.get_my_coach_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coach_id
  FROM public.profiles
  WHERE id = auth.uid()
    AND role = 'student';
$$;

CREATE POLICY "student_read_assigned_coach"
  ON public.profiles FOR SELECT
  USING (
    role = 'coach'
    AND id = public.get_my_coach_id()
  );
