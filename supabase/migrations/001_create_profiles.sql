-- 역할 enum
CREATE TYPE public.user_role AS ENUM ('super_admin', 'coach', 'student');

-- 상태 enum
CREATE TYPE public.member_status AS ENUM ('pending', 'approved', 'rejected', 'inactive');

-- 학교 유형 enum
CREATE TYPE public.school_type AS ENUM ('중학교', '고등학교');

-- profiles 테이블
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.user_role    NOT NULL DEFAULT 'student',
  status      public.member_status NOT NULL DEFAULT 'approved',
  name        TEXT                NOT NULL,
  phone       TEXT                NOT NULL,
  email       TEXT                NOT NULL UNIQUE,
  affiliation TEXT,
  school_type public.school_type,
  school_name TEXT,
  grade       TEXT                CHECK (grade IN ('1학년', '2학년', '3학년')),
  coach_id    UUID                REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ         NOT NULL DEFAULT now()
);

-- 코치에겐 affiliation 필수
ALTER TABLE public.profiles
  ADD CONSTRAINT chk_coach_affiliation
  CHECK (role <> 'coach' OR affiliation IS NOT NULL);

-- 학생에겐 school/grade/coach 필수
ALTER TABLE public.profiles
  ADD CONSTRAINT chk_student_fields
  CHECK (
    role <> 'student'
    OR (school_type IS NOT NULL AND school_name IS NOT NULL AND grade IS NOT NULL AND coach_id IS NOT NULL)
  );

-- 인덱스
CREATE INDEX idx_profiles_role    ON public.profiles(role);
CREATE INDEX idx_profiles_status  ON public.profiles(status);
CREATE INDEX idx_profiles_coach   ON public.profiles(coach_id);
CREATE INDEX idx_profiles_school  ON public.profiles(school_name);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: 본인 프로필 조회
CREATE POLICY "users_read_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- RLS: super_admin 전체 조회
CREATE POLICY "admin_read_all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- RLS: coach가 담당 학생 조회
CREATE POLICY "coach_read_students"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'coach'
    )
    AND role = 'student'
    AND coach_id = auth.uid()
  );

-- RLS: 본인 프로필 수정
CREATE POLICY "users_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS: super_admin 전체 수정
CREATE POLICY "admin_update_all"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- RLS: 가입 시 본인 프로필 생성
CREATE POLICY "users_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
