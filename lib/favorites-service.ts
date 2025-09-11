import { connectToDatabase } from "./mongodb"
import type { Recipe } from "./types"

export class FavoritesService {
  static async addToFavorites(userId: string, recipeId: string): Promise<void> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $addToSet: { favoriteRecipes: recipeId } })
  }

  static async removeFromFavorites(userId: string, recipeId: string): Promise<void> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $pull: { favoriteRecipes: recipeId } })
  }

  static async getFavoriteRecipes(userId: string): Promise<Recipe[]> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    if (!user || !user.favoriteRecipes || user.favoriteRecipes.length === 0) {
      return []
    }

    const recipeIds = user.favoriteRecipes.map((id: string) => new ObjectId(id))
    const recipes = await db
      .collection("recipes")
      .find({ _id: { $in: recipeIds } })
      .toArray()

    return recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }))
  }

  static async isFavorited(userId: string, recipeId: string): Promise<boolean> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    return user?.favoriteRecipes?.includes(recipeId) || false
  }
}

export class RatingService {
  static async rateRecipe(userId: string, recipeId: string, rating: number): Promise<void> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    // Upsert user rating
    await db
      .collection("ratings")
      .updateOne({ userId, recipeId }, { $set: { userId, recipeId, rating, createdAt: new Date() } }, { upsert: true })

    // Update recipe average rating
    await this.updateRecipeRating(recipeId)
  }

  static async getUserRating(userId: string, recipeId: string): Promise<number | null> {
    const { db } = await connectToDatabase()

    const rating = await db.collection("ratings").findOne({ userId, recipeId })
    return rating?.rating || null
  }

  static async updateRecipeRating(recipeId: string): Promise<void> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    // Calculate average rating
    const ratings = await db.collection("ratings").find({ recipeId }).toArray()

    if (ratings.length === 0) {
      return
    }

    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    const totalRatings = ratings.length

    // Update recipe
    await db
      .collection("recipes")
      .updateOne({ _id: new ObjectId(recipeId) }, { $set: { rating: averageRating, totalRatings } })
  }

  static async getTopRatedRecipes(limit = 10): Promise<Recipe[]> {
    const { db } = await connectToDatabase()

    const recipes = await db
      .collection("recipes")
      .find({ rating: { $exists: true } })
      .sort({ rating: -1, totalRatings: -1 })
      .limit(limit)
      .toArray()

    return recipes.map((recipe) => ({
      ...recipe,
      _id: recipe._id.toString(),
    }))
  }
}
