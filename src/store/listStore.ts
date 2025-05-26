import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { format, addWeeks, subDays } from 'date-fns';
import { ListState, GroceryList, GroceryItem } from '../types';
import { useAuthStore } from './authStore';
import { supabase } from '../lib/supabase';

export const useListStore = create<ListState & {
  fetchLists: () => Promise<void>;
  createList: () => Promise<void>;
  createYesterdaysList: () => Promise<void>;
  duplicateList: (listId: string) => Promise<void>;
  fetchListItems: (listId: string) => Promise<void>;
  addItem: (listId: string, name: string, category: string, quantity: number, unit?: string) => Promise<void>;
  updateItem: (item: GroceryItem) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  toggleItemCheck: (itemId: string) => Promise<void>;
  moveItemToCategory: (itemId: string, newCategory: string) => Promise<void>;
  completeList: (listId: string, totalSpent: number, paymentMethod: string, receiptUrl?: string) => Promise<void>;
  setCurrentList: (list: GroceryList | null) => void;
  updateListName: (listId: string, newName: string) => Promise<void>;
  archiveList: (listId: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
}>((set, get) => ({
  lists: [],
  currentList: null,
  items: [],
  isLoading: false,
  error: null,

  fetchLists: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      // For the mock user, we'll use mock data
      if (user.id === 'mike-123') {
        // If no lists exist yet, create a default one
        if (get().lists.length === 0) {
          await get().createList();
        }
        set({ isLoading: false });
        return;
      }
      
      // Get the user's household from household_members
      const { data: householdMembers, error: householdError } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id);
      
      if (householdError) {
        console.error('Household fetch error:', householdError);
        throw householdError;
      }
      
      if (!householdMembers || householdMembers.length === 0) {
        console.log('No household found, creating one...');
        const householdId = await useAuthStore.getState().createHousehold('My Household');
        
        // Fetch non-archived grocery lists for this new household
        const { data: lists, error } = await supabase
          .from('grocery_lists')
          .select('*')
          .eq('household_id', householdId)
          .eq('is_archived', false)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Lists fetch error:', error);
          throw error;
        }
        
        set({ lists: lists || [] });
        
        // If no lists exist, create a default one
        if (!lists || lists.length === 0) {
          await get().createList();
        }
        return;
      }
      
      console.log('Household found:', householdMembers[0].household_id);
      
      // Fetch non-archived grocery lists for this household
      const { data: lists, error } = await supabase
        .from('grocery_lists')
        .select('*')
        .eq('household_id', householdMembers[0].household_id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Lists fetch error:', error);
        throw error;
      }
      
      console.log('Lists fetched:', lists?.length || 0);
      set({ lists: lists || [] });
      
      // If no lists exist, create a default one
      if (!lists || lists.length === 0) {
        await get().createList();
      }
    } catch (error) {
      console.error('Error in fetchLists:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  // ... [previous functions remain the same until setCurrentList] ...

  setCurrentList: (list) => {
    set({ currentList: list });
  },
  
  // Archive a list (soft delete)
  archiveList: async (listId: string) => {
    if (!confirm('Are you sure you want to archive this list? You can restore it later from the archived lists.')) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      // For the mock user, update in-memory
      if (user.id === 'mike-123') {
        set(state => ({
          lists: state.lists.filter(list => list.id !== listId),
          currentList: state.currentList?.id === listId ? null : state.currentList
        }));
        return;
      }
      
      // Update in the database
      const { error } = await supabase
        .from('grocery_lists')
        .update({ is_archived: true })
        .eq('id', listId);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        lists: state.lists.filter(list => list.id !== listId),
        currentList: state.currentList?.id === listId ? null : state.currentList
      }));
      
      // Show success message
      alert('List archived successfully');
    } catch (error) {
      console.error('Error archiving list:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Permanently delete a list and all its items
  deleteList: async (listId: string) => {
    if (!confirm('Are you sure you want to permanently delete this list? This action cannot be undone.')) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      // For the mock user, update in-memory
      if (user.id === 'mike-123') {
        set(state => ({
          lists: state.lists.filter(list => list.id !== listId),
          currentList: state.currentList?.id === listId ? null : state.currentList,
          items: state.currentList?.id === listId ? [] : state.items
        }));
        return;
      }
      
      // First delete all items in the list
      const { error: itemsError } = await supabase
        .from('grocery_items')
        .delete()
        .eq('list_id', listId);
      
      if (itemsError) throw itemsError;
      
      // Then delete the list itself
      const { error } = await supabase
        .from('grocery_lists')
        .delete()
        .eq('id', listId);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        lists: state.lists.filter(list => list.id !== listId),
        currentList: state.currentList?.id === listId ? null : state.currentList,
        items: state.currentList?.id === listId ? [] : state.items
      }));
      
      // Show success message
      alert('List deleted successfully');
    } catch (error) {
      console.error('Error deleting list:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Update list name
  updateListName: async (listId: string, newName: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      // For the mock user, update in-memory
      if (user.id === 'mike-123') {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId ? { ...list, name: newName } : list
          ),
          currentList: state.currentList?.id === listId 
            ? { ...state.currentList, name: newName } 
            : state.currentList
        }));
        return;
      }
      
      // Update in the database
      const { error } = await supabase
        .from('grocery_lists')
        .update({ name: newName })
        .eq('id', listId);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        lists: state.lists.map(list => 
          list.id === listId ? { ...list, name: newName } : list
        ),
        currentList: state.currentList?.id === listId 
          ? { ...state.currentList, name: newName } 
          : state.currentList
      }));
    } catch (error) {
      console.error('Error updating list name:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  }
}));
