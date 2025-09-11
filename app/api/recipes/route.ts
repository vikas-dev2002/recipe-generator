import { NextResponse } from "next/server"
import { RecipeService } from "@/lib/recipe-service"

export async function GET() {
  try {
    const recipes = await RecipeService.getAllRecipes()
    return NextResponse.json({ recipes })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 })
  }
}
