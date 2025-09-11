export interface Recipe {
  _id?: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  cookingTime: number
  difficulty: "Easy" | "Medium" | "Hard"
  servings: number
  cuisine: string
  dietaryRestrictions: string[]
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  image: string
  rating?: number
  totalRatings?: number
  createdAt: Date
}

export interface User {
  _id?: string
  email: string
  name: string
  favoriteRecipes: string[]
  dietaryPreferences: string[]
  createdAt: Date
}

export interface UserRating {
  _id?: string
  userId: string
  recipeId: string
  rating: number
  createdAt: Date
}

export interface IngredientMatch {
  recipe: Recipe
  matchPercentage: number
  missingIngredients: string[]
}
