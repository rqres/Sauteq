export interface DBRecipeRecord {
  id: string
  title: string
  data: {
    "recipe-name": string
    description: string
    "prep-time": string
    "cook-time": string
    serves: number
    ingredients: string[]
    directions: string[]
    optional: string[]
  }
  rawData: string
  ready: boolean
  ingredients: string
  imageUrl: string
}
