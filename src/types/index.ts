export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Household {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: 'owner' | 'member';
  joined_at: string;
}

export interface GroceryList {
  id: string;
  household_id: string;
  name: string;
  created_at: string;
  week_of: string;
  is_completed: boolean;
  total_spent?: number;
  payment_method?: string;
  receipt_url?: string;
}

export interface GroceryItem {
  id: string;
  list_id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  is_checked: boolean;
  added_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  household_id?: string;
}

export type CategoryName = 
  | 'Produce'
  | 'Dairy'
  | 'Meat'
  | 'Frozen'
  | 'Pantry'
  | 'Bakery'
  | 'Beverages'
  | 'Household'
  | 'Other';

export const CATEGORIES: CategoryName[] = [
  'Produce',
  'Dairy',
  'Meat',
  'Frozen',
  'Pantry',
  'Bakery',
  'Beverages',
  'Household',
  'Other'
];

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ListState {
  lists: GroceryList[];
  currentList: GroceryList | null;
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
}