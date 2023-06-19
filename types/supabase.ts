import { DBRecipeRecord } from './recipe'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          body: DBRecipeRecord['data']
          created_at: string | null
          id: number
          image_url: string | null
          ingredients: string
          title: string
          user_id: string | null
        }
        Insert: {
          body: DBRecipeRecord['data']
          created_at?: string | null
          id?: number
          image_url?: string | null
          ingredients: string
          title?: string
          user_id?: string | null
        }
        Update: {
          body?: DBRecipeRecord['data']
          created_at?: string | null
          id?: number
          image_url?: string | null
          ingredients?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
