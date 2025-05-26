export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          is_default: boolean
          created_at: string
          household_id: string | null
        }
        Insert: {
          id?: string
          name: string
          is_default?: boolean
          created_at?: string
          household_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          is_default?: boolean
          created_at?: string
          household_id?: string | null
        }
      }
      grocery_items: {
        Row: {
          id: string
          list_id: string
          name: string
          category: string
          quantity: number
          unit: string | null
          is_checked: boolean
          added_by: string
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          name: string
          category: string
          quantity?: number
          unit?: string | null
          is_checked?: boolean
          added_by: string
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name?: string
          category?: string
          quantity?: number
          unit?: string | null
          is_checked?: boolean
          added_by?: string
          created_at?: string
        }
      }
      grocery_lists: {
        Row: {
          id: string
          household_id: string
          name: string
          created_at: string
          week_of: string
          is_completed: boolean
          total_spent: number | null
          payment_method: string | null
          receipt_url: string | null
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          created_at?: string
          week_of: string
          is_completed?: boolean
          total_spent?: number | null
          payment_method?: string | null
          receipt_url?: string | null
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          created_at?: string
          week_of?: string
          is_completed?: boolean
          total_spent?: number | null
          payment_method?: string | null
          receipt_url?: string | null
        }
      }
      household_members: {
        Row: {
          id: string
          household_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id: string
          role: string
          joined_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      households: {
        Row: {
          id: string
          name: string
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          owner_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}