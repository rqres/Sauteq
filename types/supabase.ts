import { RecipeBody } from './recipe'

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
      bookmarks: {
        Row: {
          created_at: string | null
          recipe_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          recipe_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          recipe_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookmarks_recipe_id_fkey'
            columns: ['recipe_id']
            referencedRelation: 'recipes'
            referencedColumns: ['id']
          }
        ]
      }
      followers: {
        Row: {
          created_at: string | null
          followee_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string | null
          followee_id: string
          follower_id: string
        }
        Update: {
          created_at?: string | null
          followee_id?: string
          follower_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          body: RecipeBody
          created_at: string | null
          description: string
          id: number
          image_url: string | null
          ingredients: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'any'
          preview: boolean
          title: string
          user_id: string
        }
        Insert: {
          body: RecipeBody
          created_at?: string | null
          description?: string
          id?: number
          image_url?: string | null
          ingredients: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'any'
          preview?: boolean
          title?: string
          user_id?: string
        }
        Update: {
          body?: RecipeBody
          created_at?: string | null
          description?: string
          id?: number
          image_url?: string | null
          ingredients?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'any'
          preview?: boolean
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
