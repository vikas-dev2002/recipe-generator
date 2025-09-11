"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecipeGrid } from "./recipe-grid"
import type { Recipe, IngredientMatch } from "@/lib/types"

interface RecipeListProps {
  recipes?: Recipe[]
  ingredientMatches?: IngredientMatch[]
  onFavorite?: (recipeId: string) => void
  favoriteRecipes?: string[]
  loading?: boolean
  title?: string
  showSorting?: boolean
}

type SortOption = "rating" | "time" | "difficulty" | "name"

export function RecipeList({
  recipes = [],
  ingredientMatches = [],
  onFavorite,
  favoriteRecipes = [],
  loading = false,
  title = "Recipes",
  showSorting = true,
}: RecipeListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("rating")

  const sortRecipes = (items: Recipe[] | IngredientMatch[], sortOption: SortOption) => {
    return [...items].sort((a, b) => {
      const recipeA = "recipe" in a ? a.recipe : a
      const recipeB = "recipe" in b ? b.recipe : b

      switch (sortOption) {
        case "rating":
          return (recipeB.rating || 0) - (recipeA.rating || 0)
        case "time":
          return recipeA.cookingTime - recipeB.cookingTime
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 }
          return difficultyOrder[recipeA.difficulty] - difficultyOrder[recipeB.difficulty]
        case "name":
          return recipeA.title.localeCompare(recipeB.title)
        default:
          return 0
      }
    })
  }

  const displayItems = ingredientMatches.length > 0 ? ingredientMatches : recipes
  const sortedItems = sortRecipes(displayItems, sortBy)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">
            {displayItems.length} recipe{displayItems.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {showSorting && displayItems.length > 0 && (
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="time">Cooking Time</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        )}
      </motion.div>

      {/* Recipe Grid */}
      <RecipeGrid
        recipes={ingredientMatches.length > 0 ? [] : (sortedItems as Recipe[])}
        ingredientMatches={ingredientMatches.length > 0 ? (sortedItems as IngredientMatch[]) : []}
        onFavorite={onFavorite}
        favoriteRecipes={favoriteRecipes}
        loading={loading}
      />
    </div>
  )
}
