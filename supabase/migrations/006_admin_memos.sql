-- 슈퍼관리자 전용 운영 메모 (코치·학생 RLS로 비노출)
CREATE TABLE public.admin_memos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT admin_memos_content_nonempty
    CHECK (char_length(trim(content)) > 0 AND char_length(content) <= 500)
);

CREATE INDEX idx_admin_memos_created_at ON public.admin_memos (created_at DESC);

CREATE TRIGGER set_updated_at_admin_memos
  BEFORE UPDATE ON public.admin_memos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.admin_memos ENABLE ROW LEVEL SECURITY;

-- super_admin만 조회
CREATE POLICY "admin_memos_select_super_admin"
  ON public.admin_memos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- super_admin만 생성, 작성자는 본인
CREATE POLICY "admin_memos_insert_super_admin"
  ON public.admin_memos FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- super_admin만 수정
CREATE POLICY "admin_memos_update_super_admin"
  ON public.admin_memos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- super_admin만 삭제
CREATE POLICY "admin_memos_delete_super_admin"
  ON public.admin_memos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );
