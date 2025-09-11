import { type NextRequest, NextResponse } from "next/server"
import { RecipeService } from "@/lib/recipe-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipe = await RecipeService.getRecipeById(params.id)

    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json({ recipe })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch recipe" }, { status: 500 })
  }
}
