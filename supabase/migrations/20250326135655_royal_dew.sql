/*
  # Complete Database Schema Setup
  
  1. Tables
    - households
    - household_members
    - categories
    - grocery_lists
    - grocery_items
    
  2. Security
    - Enable RLS
    - Create policies
    - Set up proper relationships
*/

-- Create households table
CREATE TABLE IF NOT EXISTS households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create household_members table
CREATE TABLE IF NOT EXISTS household_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(household_id, user_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE
);

-- Create grocery_lists table
CREATE TABLE IF NOT EXISTS grocery_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  week_of date NOT NULL,
  is_completed boolean DEFAULT false,
  total_spent numeric,
  payment_method text,
  receipt_url text
);

-- Create grocery_items table
CREATE TABLE IF NOT EXISTS grocery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES grocery_lists(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit text,
  is_checked boolean DEFAULT false,
  added_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Households policies
CREATE POLICY "Users can view their households"
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

-- Household members policies
CREATE POLICY "Users can view members of their households"
  ON household_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members AS hm
      WHERE hm.household_id = household_members.household_id 
      AND hm.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage household members"
  ON household_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_members.household_id = household_members.household_id 
      AND household_members.user_id = auth.uid() 
      AND household_members.role = 'owner'
    )
  );

-- Categories policies
CREATE POLICY "Users can view categories"
  ON categories
  FOR SELECT
  USING (
    household_id IS NULL OR
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_id = categories.household_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage categories"
  ON categories
  FOR ALL
  USING (
    household_id IS NULL OR
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_id = categories.household_id 
      AND user_id = auth.uid()
    )
  );

-- Grocery lists policies
CREATE POLICY "Users can view grocery lists"
  ON grocery_lists
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_id = grocery_lists.household_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage grocery lists"
  ON grocery_lists
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM household_members 
      WHERE household_id = grocery_lists.household_id 
      AND user_id = auth.uid()
    )
  );

-- Grocery items policies
CREATE POLICY "Users can view grocery items"
  ON grocery_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM grocery_lists
      JOIN household_members ON household_members.household_id = grocery_lists.household_id
      WHERE grocery_lists.id = grocery_items.list_id 
      AND household_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage grocery items"
  ON grocery_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM grocery_lists
      JOIN household_members ON household_members.household_id = grocery_lists.household_id
      WHERE grocery_lists.id = grocery_items.list_id 
      AND household_members.user_id = auth.uid()
    )
  );

-- Insert default categories
INSERT INTO categories (name, is_default, household_id)
VALUES 
  ('Produce', true, NULL),
  ('Dairy', true, NULL),
  ('Meat', true, NULL),
  ('Frozen', true, NULL),
  ('Pantry', true, NULL),
  ('Bakery', true, NULL),
  ('Beverages', true, NULL),
  ('Household', true, NULL),
  ('Other', true, NULL);