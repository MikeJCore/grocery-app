-- Fix RLS recursion issue in household_members table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view members of their households" ON household_members;
DROP POLICY IF EXISTS "Owners can manage household members" ON household_members;
DROP POLICY IF EXISTS "Allow users to join households" ON household_members;

-- Basic policy for initial user to create their household membership
CREATE POLICY "Allow users to join households"
  ON household_members
  FOR INSERT
  WITH CHECK (
    -- Allow insert if no other members exist for this household
    NOT EXISTS (
      SELECT 1
      FROM household_members
      WHERE household_id = NEW.household_id
    )
    -- Ensure user can only add themselves
    AND auth.uid() = NEW.user_id
    -- First user must be owner
    AND NEW.role = 'owner'
  );

-- Users can view members of their households
CREATE POLICY "Users can view members of their households"
  ON household_members
  FOR SELECT
  USING (
    -- User can view if they are a member of the same household
    user_id = auth.uid() OR
    household_id IN (
      SELECT household_id
      FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- Owners can manage household members
CREATE POLICY "Owners can manage household members"
  ON household_members
  FOR ALL
  USING (
    -- Can manage if user is an owner of the household
    household_id IN (
      SELECT household_id
      FROM household_members
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  )
  WITH CHECK (
    -- Can only modify if user is an owner of the household
    household_id IN (
      SELECT household_id
      FROM household_members
      WHERE user_id = auth.uid()
      AND role = 'owner'
    )
  );
