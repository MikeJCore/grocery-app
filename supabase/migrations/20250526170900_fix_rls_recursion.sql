-- Fix RLS recursion issue in household_members table

-- Drop existing policies to ensure a clean slate. Add any other policy names you might have used.
DROP POLICY IF EXISTS "Users can view their household memberships" ON public.household_members;
DROP POLICY IF EXISTS "Users can create household memberships" ON public.household_members;
DROP POLICY IF EXISTS "Owners can update household memberships" ON public.household_members;
DROP POLICY IF EXISTS "Users can delete household memberships" ON public.household_members;
-- Legacy names from previous attempts, ensure they are dropped:
DROP POLICY IF EXISTS "Users can view members of their households" ON public.household_members;
DROP POLICY IF EXISTS "Owners can manage household members" ON public.household_members;
DROP POLICY IF EXISTS "Allow users to join households" ON public.household_members;

-- Helper Functions (SECURITY DEFINER to bypass RLS for internal queries)

CREATE OR REPLACE FUNCTION public.is_household_owner(p_user_id uuid, p_household_id uuid)
RETURNS boolean AS $$
BEGIN
  IF p_user_id IS NULL OR p_household_id IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.household_members hm
    WHERE hm.user_id = p_user_id AND hm.household_id = p_household_id AND hm.role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_household_member(p_user_id uuid, p_household_id uuid)
RETURNS boolean AS $$
BEGIN
  IF p_user_id IS NULL OR p_household_id IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.household_members hm
    WHERE hm.user_id = p_user_id AND hm.household_id = p_household_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.household_has_no_members(p_household_id uuid)
RETURNS boolean AS $$
BEGIN
  IF p_household_id IS NULL THEN RETURN TRUE; END IF; -- Or handle as an error/false
  RETURN NOT EXISTS (SELECT 1 FROM public.household_members hm WHERE hm.household_id = p_household_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_household_owner_count(p_household_id uuid)
RETURNS integer AS $$
DECLARE owner_count integer;
BEGIN
  IF p_household_id IS NULL THEN RETURN 0; END IF;
  SELECT COUNT(*) INTO owner_count FROM public.household_members hm
  WHERE hm.household_id = p_household_id AND hm.role = 'owner';
  RETURN owner_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for household_members table

-- SELECT: Users can view member entries for households they are part of.
CREATE POLICY "Users can view their household memberships"
  ON public.household_members FOR SELECT
  USING ( public.is_household_member(auth.uid(), household_members.household_id) );

-- INSERT: Allows initial household creation by an owner, or an existing owner to add members.
CREATE POLICY "Users can create household memberships"
  ON public.household_members FOR INSERT
  WITH CHECK (
    (
      -- Case 1: User is creating their *own* first membership in a new/empty household (must be owner).
      NEW.user_id = auth.uid() AND
      NEW.role = 'owner' AND
      public.household_has_no_members(NEW.household_id)
    ) OR (
      -- Case 2: An existing owner of the household is adding a new member (or another owner).
      public.is_household_owner(auth.uid(), NEW.household_id)
    )
  );

-- UPDATE: Owners can update member roles. User ID and Household ID of a membership are immutable by this policy.
-- Prevents demoting the last owner.
CREATE POLICY "Owners can update household memberships"
  ON public.household_members FOR UPDATE
  USING ( public.is_household_owner(auth.uid(), OLD.household_id) )
  WITH CHECK (
    public.is_household_owner(auth.uid(), NEW.household_id) AND
    NEW.user_id = OLD.user_id AND
    NEW.household_id = OLD.household_id AND
    NOT (OLD.role = 'owner' AND NEW.role <> 'owner' AND public.get_household_owner_count(OLD.household_id) = 1)
  );

-- DELETE: Users can remove themselves (if not sole owner). Owners can remove other members.
CREATE POLICY "Users can delete household memberships"
  ON public.household_members FOR DELETE
  USING (
    (
      OLD.user_id = auth.uid() AND
      NOT (OLD.role = 'owner' AND public.get_household_owner_count(OLD.household_id) = 1)
    ) OR (
      public.is_household_owner(auth.uid(), OLD.household_id) AND
      OLD.user_id <> auth.uid()
    )
  );