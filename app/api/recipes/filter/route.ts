import { type NextRequest, NextResponse } from "next/server"
import { RecipeService } from "@/lib/recipe-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      cuisine: searchParams.get("cuisine") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      maxCookingTime: searchParams.get("maxCookingTime")
        ? Number.parseInt(searchParams.get("maxCookingTime")!)
        : undefined,
      dietaryRestrictions: searchParams.get("dietaryRestrictions")?.split(",") || undefined,
    }

    const recipes = await RecipeService.filterRecipes(filters)
    return NextResponse.json({ recipes })
  } catch (error: any) {
    return NextResponse.json({ message: "Filter failed" }, { status: 500 })
  }
}
