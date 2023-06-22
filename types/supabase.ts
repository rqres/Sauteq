import { RecipeBody } from './recipe'

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
          body: RecipeBody
          bookmark: boolean
          created_at: string | null
          id: number
          image_url: string
          ingredients: string
          title: string
          user_id: string
        }
        Insert: {
          body: RecipeBody
          bookmark?: boolean
          created_at?: string | null
          id?: number
          image_url: string
          ingredients: string
          title?: string
          user_id?: string
        }
        Update: {
          body?: RecipeBody
          bookmark?: boolean
          created_at?: string | null
          id?: number
          image_url?: string
          ingredients?: string
          title?: string
          user_id?: string
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
