"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Users, Star, Heart, ChefHat } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [servings, setServings] = useState(1)

  useEffect(() => {
    if (params.id) {
      fetchRecipe(params.id as string)
    }
  }, [params.id])

  const fetchRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`)
      if (!response.ok) {
        throw new Error("Recipe not found")
      }
      const data = await response.json()
      setRecipe(data.recipe)
      setServings(data.recipe.servings)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const adjustIngredientAmount = (ingredient: string, originalServings: number, newServings: number) => {
    // Simple ingredient adjustment - in a real app, this would be more sophisticated
    const ratio = newServings / originalServings
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const amount = Number.parseFloat(match)
      return (amount * ratio).toString()
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "The recipe you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/")}>Go Back Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipe Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
            </div>
          </motion.div>

          {/* Recipe Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground">{recipe.description}</p>
            </div>

            {/* Recipe Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{recipe.cookingTime} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>{recipe.rating?.toFixed(1) || "N/A"}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{recipe.cuisine}</Badge>
              <Badge
                variant={
                  recipe.difficulty === "Easy"
                    ? "default"
                    : recipe.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                }
              >
                {recipe.difficulty}
              </Badge>
              {recipe.dietaryRestrictions.map((restriction) => (
                <Badge key={restriction} variant="outline">
                  {restriction}
                </Badge>
              ))}
            </div>

            {/* Nutritional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutritional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Calories:</span> {recipe.nutritionalInfo.calories}
                  </div>
                  <div>
                    <span className="font-medium">Protein:</span> {recipe.nutritionalInfo.protein}g
                  </div>
                  <div>
                    <span className="font-medium">Carbs:</span> {recipe.nutritionalInfo.carbs}g
                  </div>
                  <div>
                    <span className="font-medium">Fat:</span> {recipe.nutritionalInfo.fat}g
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {user && (
              <div className="flex gap-4">
                <Button className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save Recipe
                </Button>
                <Button variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Recipe
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Ingredients and Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    Ingredients
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      disabled={servings <= 1}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium">{servings} servings</span>
                    <Button variant="outline" size="sm" onClick={() => setServings(servings + 1)}>
                      +
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                      <span className="text-sm">{adjustIngredientAmount(ingredient, recipe.servings, servings)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
