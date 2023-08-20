export interface RecipeBody {
  description?: string
  'prep-time': string
  'cook-time': string
  serves: number
  ingredients: string[]
  directions: string[]
  optional?: string[]
}
