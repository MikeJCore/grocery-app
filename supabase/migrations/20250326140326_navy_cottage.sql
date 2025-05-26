/*
  # Add Sample Data Migration
  
  This migration adds sample data including:
  - A sample household
  - A sample household member (owner)
  - 4 grocery lists with varying dates
  - Sample grocery items for each list
  
  Note: Uses a hardcoded UUID for the sample user since auth.uid() 
  is not available in regular SQL statements
*/

DO $$
DECLARE
  sample_user_id uuid := 'mike-123'::uuid;
  sample_household_id uuid := 'cf47b1f0-89e3-4c15-a05d-96a029323128'::uuid;
BEGIN
  -- Create a sample household
  INSERT INTO households (id, name, created_at)
  VALUES (
    sample_household_id,
    'Sample Household',
    now()
  );

  -- Add household member (owner)
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (
    sample_household_id,
    sample_user_id,
    'owner'
  );

  -- Create 4 grocery lists
  INSERT INTO grocery_lists (id, household_id, name, created_at, week_of, is_completed, total_spent, payment_method)
  VALUES
    -- List 1: Two weeks ago, completed
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', sample_household_id, 'Bi-weekly Shop', now() - interval '14 days', now() - interval '14 days', true, 156.75, 'Credit Card'),
    -- List 2: Last week, completed
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', sample_household_id, 'Weekly Essentials', now() - interval '7 days', now() - interval '7 days', true, 89.50, 'Debit Card'),
    -- List 3: Current week, in progress
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', sample_household_id, 'Weekly Shop', now() - interval '2 days', now(), false, null, null),
    -- List 4: Special occasion, completed
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', sample_household_id, 'Weekend BBQ', now() - interval '10 days', now() - interval '10 days', true, 124.30, 'Cash');

  -- Insert items for List 1 (Bi-weekly Shop)
  INSERT INTO grocery_items (list_id, name, category, quantity, unit, is_checked, added_by)
  VALUES
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Bananas', 'Produce', 1, 'bunch', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Apples', 'Produce', 6, null, true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Carrots', 'Produce', 1, 'kg', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Milk', 'Dairy', 2, 'gallon', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Yogurt', 'Dairy', 6, 'pack', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Cheese', 'Dairy', 1, 'block', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Chicken Breast', 'Meat', 2, 'lbs', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Ground Beef', 'Meat', 1, 'lbs', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Frozen Peas', 'Frozen', 2, 'bags', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Ice Cream', 'Frozen', 1, 'tub', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Bread', 'Bakery', 2, 'loaf', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Bagels', 'Bakery', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Pasta', 'Pantry', 3, 'boxes', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Rice', 'Pantry', 1, 'kg', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Canned Tomatoes', 'Pantry', 4, 'cans', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Coffee', 'Beverages', 1, 'bag', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Orange Juice', 'Beverages', 2, 'cartons', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Paper Towels', 'Household', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Dish Soap', 'Household', 1, 'bottle', true, sample_user_id),
    ('d8f3b9e0-1234-4c15-a05d-96a029323128', 'Laundry Detergent', 'Household', 1, 'bottle', true, sample_user_id);

  -- Insert items for List 2 (Weekly Essentials)
  INSERT INTO grocery_items (list_id, name, category, quantity, unit, is_checked, added_by)
  VALUES
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Spinach', 'Produce', 2, 'bags', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Tomatoes', 'Produce', 4, null, true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Cucumbers', 'Produce', 2, null, true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Eggs', 'Dairy', 1, 'dozen', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Butter', 'Dairy', 1, 'block', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Sour Cream', 'Dairy', 1, 'tub', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Turkey Slices', 'Meat', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Bacon', 'Meat', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Frozen Pizza', 'Frozen', 2, null, true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Frozen Berries', 'Frozen', 1, 'bag', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Croissants', 'Bakery', 4, null, true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Muffins', 'Bakery', 6, null, true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Cereal', 'Pantry', 2, 'boxes', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Peanut Butter', 'Pantry', 1, 'jar', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Crackers', 'Pantry', 2, 'boxes', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Tea', 'Beverages', 1, 'box', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Sparkling Water', 'Beverages', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Toilet Paper', 'Household', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Hand Soap', 'Household', 2, 'bottles', true, sample_user_id),
    ('d8f3b9e0-5678-4c15-a05d-96a029323128', 'Trash Bags', 'Household', 1, 'box', true, sample_user_id);

  -- Insert items for List 3 (Current Week)
  INSERT INTO grocery_items (list_id, name, category, quantity, unit, is_checked, added_by)
  VALUES
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Sweet Potatoes', 'Produce', 3, null, false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Bell Peppers', 'Produce', 4, null, false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Onions', 'Produce', 2, 'lbs', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Heavy Cream', 'Dairy', 1, 'pint', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Greek Yogurt', 'Dairy', 4, 'cups', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'String Cheese', 'Dairy', 1, 'pack', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Salmon', 'Meat', 2, 'fillets', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Chicken Thighs', 'Meat', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Frozen Corn', 'Frozen', 2, 'bags', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Frozen Waffles', 'Frozen', 1, 'box', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Sourdough Bread', 'Bakery', 1, 'loaf', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Cookies', 'Bakery', 12, null, true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Quinoa', 'Pantry', 1, 'bag', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Olive Oil', 'Pantry', 1, 'bottle', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Chicken Stock', 'Pantry', 2, 'boxes', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Almond Milk', 'Beverages', 2, 'cartons', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Kombucha', 'Beverages', 3, 'bottles', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Sponges', 'Household', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Glass Cleaner', 'Household', 1, 'bottle', false, sample_user_id),
    ('d8f3b9e0-9012-4c15-a05d-96a029323128', 'Air Freshener', 'Household', 2, 'cans', true, sample_user_id);

  -- Insert items for List 4 (Weekend BBQ)
  INSERT INTO grocery_items (list_id, name, category, quantity, unit, is_checked, added_by)
  VALUES
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Corn on the Cob', 'Produce', 8, null, true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Potatoes', 'Produce', 5, 'lbs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Mixed Salad', 'Produce', 2, 'bags', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Coleslaw Mix', 'Produce', 2, 'bags', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Sour Cream', 'Dairy', 1, 'tub', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Shredded Cheese', 'Dairy', 2, 'bags', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Burger Patties', 'Meat', 12, null, true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Hot Dogs', 'Meat', 2, 'packs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Chicken Wings', 'Meat', 3, 'lbs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Ice Cream Sandwiches', 'Frozen', 1, 'box', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Popsicles', 'Frozen', 2, 'boxes', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Hamburger Buns', 'Bakery', 3, 'packs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Hot Dog Buns', 'Bakery', 2, 'packs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'BBQ Sauce', 'Pantry', 2, 'bottles', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Potato Chips', 'Pantry', 3, 'bags', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Baked Beans', 'Pantry', 2, 'cans', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Soda', 'Beverages', 4, '2L bottles', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Beer', 'Beverages', 2, '6-packs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Paper Plates', 'Household', 2, 'packs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Plastic Utensils', 'Household', 1, 'pack', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Napkins', 'Household', 2, 'packs', true, sample_user_id),
    ('d8f3b9e0-3456-4c15-a05d-96a029323128', 'Charcoal', 'Household', 1, 'bag', true, sample_user_id);
END $$;