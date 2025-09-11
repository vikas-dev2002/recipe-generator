import { type NextRequest, NextResponse } from "next/server"
import { RecipeService } from "@/lib/recipe-service"

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json()

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ message: "Ingredients array is required" }, { status: 400 })
    }

    const matches = await RecipeService.searchRecipesByIngredients(ingredients)
    return NextResponse.json({ matches })
  } catch (error: any) {
    return NextResponse.json({ message: "Ingredient search failed" }, { status: 500 })
  }
}
