import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState & {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  invitePartner: (email: string) => Promise<void>;
  checkSession: () => Promise<void>;
  createHousehold: (name: string) => Promise<string>;
}>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at || new Date().toISOString(),
        } as User;
        
        set({ user });
        
        // Create a default household for the new user
        await get().createHousehold('My Household');
      }
    } catch (error) {
      console.error('Error in signUp:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at || new Date().toISOString(),
        } as User;
        
        // Set the user first
        set({ user });
        
        // Then check if the user has a household
        const { data: householdMember, error: householdError } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', data.user.id)
          .single();
        
        if (householdError && householdError.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is fine for new users
          throw householdError;
        }
        
        // If no household exists, create one
        if (!householdMember) {
          await get().createHousehold('My Household');
        }
      }
    } catch (error) {
      console.error('Error in signIn:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Error in signOut:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  invitePartner: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const user = get().user;
      if (!user) throw new Error('User not authenticated');
      
      // Get the user's household by joining with household_members
      const { data: householdMember, error: householdError } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .single();
      
      if (householdError) throw householdError;
      if (!householdMember) throw new Error('No household found');
      
      // In a real app, this would create an invitation record and send an email
      console.log(`Invitation sent to ${email} for household ${householdMember.household_id}`);
      
      // For now, we'll just simulate success
      setTimeout(() => {
        set({ isLoading: false });
      }, 1000);
    } catch (error) {
      console.error('Error in invitePartner:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    }
  },

  checkSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data.session?.user) {
        const user = {
          id: data.session.user.id,
          email: data.session.user.email || '',
          created_at: data.session.user.created_at || new Date().toISOString(),
        } as User;
        
        set({ user });
        
        // Check if the user has a household by joining with household_members
        const { data: householdMember, error: householdError } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', data.session.user.id)
          .single();
        
        if (householdError && householdError.code !== 'PGRST116') {
          throw householdError;
        }
        
        if (!householdMember) {
          await get().createHousehold('My Household');
        }
      }
    } catch (error) {
      console.error('Error in checkSession:', error);
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createHousehold: async (name) => {
    const user = get().user;
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Create a new household
      const { data: household, error } = await supabase
        .from('households')
        .insert({ name })
        .select()
        .single();
      
      if (error) throw error;
      if (!household) throw new Error('Failed to create household');
      
      // Create a household member record for the owner
      const { error: memberError } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: user.id,
          role: 'owner'
        });
      
      if (memberError) throw memberError;
      
      return household.id;
    } catch (error) {
      console.error('Error in createHousehold:', error);
      throw error;
    }
  }
}));