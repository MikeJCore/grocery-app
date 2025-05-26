import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { useAuthStore } from './authStore';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch global default categories
      const { data: defaultCategories, error: defaultError } = await supabase
        .from('categories')
        .select('*')
        .is('household_id', null);
      
      if (defaultError) throw defaultError;
      
      // Fetch user's custom categories (if authenticated)
      const { data: session } = await supabase.auth.getSession();
      let customCategories: Category[] = [];
      
      if (session.session) {
        // Get the user's household
        const { data: household, error: householdError } = await supabase
          .from('households')
          .select('id')
          .single();
        
        if (householdError && householdError.code !== 'PGRST116') {
          throw householdError;
        }
        
        if (household) {
          // Fetch custom categories for this household
          const { data: userCategories, error: userError } = await supabase
            .from('categories')
            .select('*')
            .eq('household_id', household.id);
          
          if (userError) throw userError;
          
          if (userCategories) {
            customCategories = userCategories;
          }
        }
      }
      
      // Combine default and custom categories
      const allCategories = [...(defaultCategories || []), ...customCategories];
      
      set({ categories: allCategories });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addCategory: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      // Get the user's household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .select('id')
        .single();
      
      if (householdError) throw householdError;
      if (!household) throw new Error('No household found');
      
      // Add the new category
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          name,
          is_default: false,
          household_id: household.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        categories: [...state.categories, newCategory]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateCategory: async (id: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      // Check if the category is a default one
      const category = get().categories.find(c => c.id === id);
      if (!category) throw new Error('Category not found');
      
      if (category.is_default) {
        throw new Error('Default categories cannot be modified');
      }
      
      // Update the category
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        categories: state.categories.map(category => 
          category.id === id
            ? { ...category, name }
            : category
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Check if the category is a default one
      const category = get().categories.find(c => c.id === id);
      if (!category) throw new Error('Category not found');
      
      if (category.is_default) {
        throw new Error('Default categories cannot be deleted');
      }
      
      // Get the "Other" category for moving items
      const otherCategory = get().categories.find(c => c.name === 'Other');
      if (!otherCategory) throw new Error('Other category not found');
      
      // Update all items with this category to "Other"
      const { error: updateError } = await supabase
        .from('grocery_items')
        .update({ category: 'Other' })
        .eq('category', category.name);
      
      if (updateError) throw updateError;
      
      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        categories: state.categories.filter(category => category.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  }
}));