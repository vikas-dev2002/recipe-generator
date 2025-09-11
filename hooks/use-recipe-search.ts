"use client"

import { useState, useCallback } from "react"
import type { Recipe, IngredientMatch } from "@/lib/types"

interface FilterOptions {
  cuisine?: string
  difficulty?: string
  maxCookingTime?: number
  dietaryRestrictions?: string[]
}

export function useRecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredientMatches, setIngredientMatches] = useState<IngredientMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchRecipes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setRecipes([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recipes/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setRecipes(data.recipes)
    } catch (err) {
      setError("Failed to search recipes")
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [])

  const filterRecipes = useCallback(async (filters: FilterOptions) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.cuisine) params.append("cuisine", filters.cuisine)
      if (filters.difficulty) params.append("difficulty", filters.difficulty)
      if (filters.maxCookingTime) params.append("maxCookingTime", filters.maxCookingTime.toString())
      if (filters.dietaryRestrictions?.length) {
        params.append("dietaryRestrictions", filters.dietaryRestrictions.join(","))
      }

      const response = await fetch(`/api/recipes/filter?${params}`)
      if (!response.ok) throw new Error("Filter failed")

      const data = await response.json()
      setRecipes(data.recipes)
    } catch (err) {
      setError("Failed to filter recipes")
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }, [])

  const searchByIngredients = useCallback(async (ingredients: string[]) => {
    if (ingredients.length === 0) {
      setIngredientMatches([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/recipes/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      })

      if (!response.ok) throw new Error("Ingredient search failed")

      const data = await response.json()
      setIngredientMatches(data.matches)
    } catch (err) {
      setError("Failed to search by ingredients")
      setIngredientMatches([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    recipes,
    ingredientMatches,
    loading,
    error,
    searchRecipes,
    filterRecipes,
    searchByIngredients,
  }
}
