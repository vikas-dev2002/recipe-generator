import { type NextRequest, NextResponse } from "next/server"
import { RatingService } from "@/lib/favorites-service"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { recipeId, rating } = await request.json()
    if (!recipeId || rating === undefined) {
      return NextResponse.json({ message: "Recipe ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 })
    }

    await RatingService.rateRecipe(user._id!, recipeId, rating)
    return NextResponse.json({ message: "Rating submitted" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to submit rating" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recipeId = searchParams.get("recipeId")
    const authHeader = request.headers.get("authorization")

    if (!recipeId) {
      return NextResponse.json({ message: "Recipe ID is required" }, { status: 400 })
    }

    let userRating = null
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const user = await AuthService.verifyToken(token)
      if (user) {
        userRating = await RatingService.getUserRating(user._id!, recipeId)
      }
    }

    return NextResponse.json({ userRating })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch rating" }, { status: 500 })
  }
}
