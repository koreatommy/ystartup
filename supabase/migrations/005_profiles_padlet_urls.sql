-- 코치 Padlet 보드 URL 목록 (JSON 배열: [{ "id": "uuid", "url": "https://..." }, ...])
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS padlet_urls JSONB NOT NULL DEFAULT '[]'::jsonb;
