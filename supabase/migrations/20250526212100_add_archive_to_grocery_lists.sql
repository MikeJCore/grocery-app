-- Add is_archived column to grocery_lists table
ALTER TABLE grocery_lists 
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false;

-- Create index for better performance when querying non-archived lists
CREATE INDEX IF NOT EXISTS idx_grocery_lists_household_archived 
ON grocery_lists(household_id, is_archived)
WHERE is_archived = false;
