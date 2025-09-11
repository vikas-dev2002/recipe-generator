import { connectToDatabase } from "./mongodb"
import type { Recipe, IngredientMatch } from "./types"

export class RecipeService {
  static async getAllRecipes(): Promise<Recipe[]> {
    const { db } = await connectToDatabase()
    const recipes = await db.collection("recipes").find({}).toArray()
    return recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }))
  }

  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")
    const recipe = await db.collection("recipes").findOne({ _id: new ObjectId(id) })

    if (!recipe) return null

    return {
      ...recipe,
      _id: recipe._id.toString(),
    }
  }

  static async searchRecipesByIngredients(ingredients: string[]): Promise<IngredientMatch[]> {
    const { db } = await connectToDatabase()

    // Normalize ingredients for better matching
    const normalizedIngredients = ingredients.map((ing) => ing.toLowerCase().trim())

    const recipes = await db.collection("recipes").find({}).toArray()

    const matches: IngredientMatch[] = recipes.map((recipe) => {
      const recipeIngredients = recipe.ingredients.map((ing: string) => ing.toLowerCase())

      // Calculate match percentage
      const matchingIngredients = normalizedIngredients.filter((userIng) =>
        recipeIngredients.some((recipeIng) => recipeIng.includes(userIng) || userIng.includes(recipeIng)),
      )

      const matchPercentage = (matchingIngredients.length / recipe.ingredients.length) * 100

      // Find missing ingredients
      const missingIngredients = recipe.ingredients.filter(
        (recipeIng: string) =>
          !normalizedIngredients.some(
            (userIng) => recipeIng.toLowerCase().includes(userIng) || userIng.includes(recipeIng.toLowerCase()),
          ),
      )

      return {
        recipe: {
          ...recipe,
          _id: recipe._id.toString(),
        },
        matchPercentage: Math.round(matchPercentage),
        missingIngredients,
      }
    })

    // Filter and sort by match percentage
    return matches.filter((match) => match.matchPercentage > 0).sort((a, b) => b.matchPercentage - a.matchPercentage)
  }

  static async filterRecipes(filters: {
    cuisine?: string
    difficulty?: string
    maxCookingTime?: number
    dietaryRestrictions?: string[]
  }): Promise<Recipe[]> {
    const { db } = await connectToDatabase()

    const query: any = {}

    if (filters.cuisine) {
      query.cuisine = filters.cuisine
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty
    }

    if (filters.maxCookingTime) {
      query.cookingTime = { $lte: filters.maxCookingTime }
    }

    if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
      query.dietaryRestrictions = { $in: filters.dietaryRestrictions }
    }

    const recipes = await db.collection("recipes").find(query).toArray()

    return recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }))
  }

  static async getTopRatedRecipes(limit = 10): Promise<Recipe[]> {
    const { db } = await connectToDatabase()

    const recipes = await db
      .collection("recipes")
      .find({})
      .sort({ rating: -1, totalRatings: -1 })
      .limit(limit)
      .toArray()

    return recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }))
  }

  static async searchRecipes(searchTerm: string): Promise<Recipe[]> {
    const { db } = await connectToDatabase()

    const searchRegex = new RegExp(searchTerm, "i")

    const recipes = await db
      .collection("recipes")
      .find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { ingredients: { $in: [searchRegex] } },
          { cuisine: searchRegex },
        ],
      })
      .toArray()

    return recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }))
  }
}
