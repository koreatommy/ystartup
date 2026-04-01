CREATE OR REPLACE FUNCTION public.list_approved_coaches()
RETURNS TABLE (
  id uuid,
  name text,
  affiliation text,
  school_type public.school_type,
  school_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.name,
    p.affiliation,
    p.school_type,
    p.school_name
  FROM public.profiles p
  WHERE p.role = 'coach'
    AND p.status = 'approved'
  ORDER BY p.name;
$$;

REVOKE ALL ON FUNCTION public.list_approved_coaches() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_approved_coaches() TO anon, authenticated;
