"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, Heart } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
  onFavorite?: (recipeId: string) => void
  isFavorited?: boolean
  showMatchPercentage?: number
  missingIngredients?: string[]
}

export function RecipeCard({
  recipe,
  onFavorite,
  isFavorited = false,
  showMatchPercentage,
  missingIngredients,
}: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onFavorite && recipe._id) {
      onFavorite(recipe._id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/recipes/${recipe._id}`}>
        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div className="relative">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Match percentage badge */}
            {showMatchPercentage !== undefined && (
              <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                {showMatchPercentage}% match
              </Badge>
            )}

            {/* Favorite button */}
            {onFavorite && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </Button>
            )}

            {/* Difficulty badge */}
            <Badge
              variant={
                recipe.difficulty === "Easy" ? "default" : recipe.difficulty === "Medium" ? "secondary" : "destructive"
              }
              className="absolute bottom-2 left-2"
            >
              {recipe.difficulty}
            </Badge>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2 text-balance">{recipe.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>

              {/* Recipe stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookingTime}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{recipe.rating?.toFixed(1) || "N/A"}</span>
                </div>
              </div>

              {/* Cuisine and dietary restrictions */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {recipe.cuisine}
                </Badge>
                {recipe.dietaryRestrictions.slice(0, 2).map((restriction) => (
                  <Badge key={restriction} variant="outline" className="text-xs">
                    {restriction}
                  </Badge>
                ))}
                {recipe.dietaryRestrictions.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{recipe.dietaryRestrictions.length - 2}
                  </Badge>
                )}
              </div>

              {/* Missing ingredients */}
              {missingIngredients && missingIngredients.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Missing: </span>
                  {missingIngredients.slice(0, 3).join(", ")}
                  {missingIngredients.length > 3 && ` +${missingIngredients.length - 3} more`}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
