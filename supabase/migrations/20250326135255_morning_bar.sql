/*
  # Fix Household Policies
  
  1. Changes
    - Drop existing problematic policies
    - Create new policies using household_members role
    - Fix recursion issues in policy definitions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own households" ON households;
DROP POLICY IF EXISTS "Members can view their households" ON households;

-- Create a new policy for household owners
CREATE POLICY "Owners can view their households" 
  ON households
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_members.household_id = households.id 
      AND household_members.user_id = auth.uid()
      AND household_members.role = 'owner'
    )
  );

-- Create a policy for household members
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