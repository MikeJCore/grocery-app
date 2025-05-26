/*
  # Fix Household Policies
  
  1. Changes
    - Drop existing policies
    - Create new policies using correct column references
    - Fix permissions for household management
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Members can view their households" ON households;
DROP POLICY IF EXISTS "Users can create households" ON households;
DROP POLICY IF EXISTS "Owners can update their households" ON households;
DROP POLICY IF EXISTS "Owners can delete their households" ON households;
DROP POLICY IF EXISTS "Owners can create household members" ON household_members;

-- Create policies without using IF NOT EXISTS (not supported for policies)
CREATE POLICY "Members can view their households" 
  ON households
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_members.household_id = households.id 
      AND household_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create households"
  ON households
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their households"
  ON households
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_members.household_id = households.id 
      AND household_members.user_id = auth.uid()
      AND household_members.role = 'owner'
    )
  );

CREATE POLICY "Owners can delete their households"
  ON households
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_members.household_id = households.id 
      AND household_members.user_id = auth.uid()
      AND household_members.role = 'owner'
    )
  );

CREATE POLICY "Owners can create household members"
  ON household_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM household_members
      WHERE household_members.household_id = NEW.household_id 
      AND household_members.user_id = auth.uid()
      AND household_members.role = 'owner'
    )
  );