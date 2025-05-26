import { supabase } from './lib/supabase';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection to grocery_items table...');
  
  try {
    // Test a simple query to the grocery_items table
    const { data: items, error } = await supabase
      .from('grocery_items')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error querying grocery_items table:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase and queried grocery_items table!');
    
    if (items && items.length > 0) {
      console.log('\nTable structure:', Object.keys(items[0]));
      console.log('\nSample items:');
      console.log(JSON.stringify(items, null, 2));
    } else {
      console.log('\nThe grocery_items table exists but is empty.');
    }
    
  } catch (error) {
    console.error('Unexpected error testing Supabase:', error);
  }
}

// Run the test
testSupabaseConnection();
