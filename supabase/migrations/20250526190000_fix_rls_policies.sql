-- Disable RLS temporarily
ALTER TABLE public.household_members DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'household_members') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.household_members';
    END LOOP;
END $$;

-- Create a simple policy that allows all operations (temporary)
CREATE POLICY "allow_all_operations" ON public.household_members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
