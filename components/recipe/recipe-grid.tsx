"use client"

import { motion } from "framer-motion"
import { RecipeCard } from "./recipe-card"
import type { Recipe, IngredientMatch } from "@/lib/types"

interface RecipeGridProps {
  recipes?: Recipe[]
  ingredientMatches?: IngredientMatch[]
  onFavorite?: (recipeId: string) => void
  favoriteRecipes?: string[]
  loading?: boolean
  emptyMessage?: string
}

export function RecipeGrid({
  recipes = [],
  ingredientMatches = [],
  onFavorite,
  favoriteRecipes = [],
  loading = false,
  emptyMessage = "No recipes found",
}: RecipeGridProps) {
  const displayItems = ingredientMatches.length > 0 ? ingredientMatches : recipes.map((recipe) => ({ recipe }))

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg aspect-video mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (displayItems.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {displayItems.map((item, index) => {
        const recipe = "recipe" in item ? item.recipe : item
        const matchPercentage = "matchPercentage" in item ? item.matchPercentage : undefined
        const missingIngredients = "missingIngredients" in item ? item.missingIngredients : undefined

        return (
          <motion.div
            key={recipe._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RecipeCard
              recipe={recipe}
              onFavorite={onFavorite}
              isFavorited={recipe._id ? favoriteRecipes.includes(recipe._id) : false}
              showMatchPercentage={matchPercentage}
              missingIngredients={missingIngredients}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
