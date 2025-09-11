import { type NextRequest, NextResponse } from "next/server"
import { RecipeService } from "@/lib/recipe-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 })
    }

    const recipes = await RecipeService.searchRecipes(query)
    return NextResponse.json({ recipes })
  } catch (error: any) {
    return NextResponse.json({ message: "Search failed" }, { status: 500 })
  }
}
