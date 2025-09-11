import { type NextRequest, NextResponse } from "next/server"
import { FavoritesService } from "@/lib/favorites-service"
import { AuthService } from "@/lib/auth"

export async function GET(request: NextRequest) {
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

    const favorites = await FavoritesService.getFavoriteRecipes(user._id!)
    return NextResponse.json({ favorites })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch favorites" }, { status: 500 })
  }
}

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

    const { recipeId } = await request.json()
    if (!recipeId) {
      return NextResponse.json({ message: "Recipe ID is required" }, { status: 400 })
    }

    await FavoritesService.addToFavorites(user._id!, recipeId)
    return NextResponse.json({ message: "Added to favorites" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to add to favorites" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { recipeId } = await request.json()
    if (!recipeId) {
      return NextResponse.json({ message: "Recipe ID is required" }, { status: 400 })
    }

    await FavoritesService.removeFromFavorites(user._id!, recipeId)
    return NextResponse.json({ message: "Removed from favorites" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to remove from favorites" }, { status: 500 })
  }
}
