"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { SearchBar } from "@/components/search/search-bar"
import { FilterSidebar } from "@/components/search/filter-sidebar"
import { RecipeList } from "@/components/recipe/recipe-list"
import { Button } from "@/components/ui/button"
import { Filter, BookOpen } from "lucide-react"
import { useRecipeSearch } from "@/hooks/use-recipe-search"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/contexts/auth-context"
import type { Recipe } from "@/lib/types"

export default function RecipesPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([])

  const { user } = useAuth()
  const { recipes, loading, error, searchRecipes, filterRecipes } = useRecipeSearch()
  const { toggleFavorite, favoriteIds } = useFavorites()

  useEffect(() => {
    fetchAllRecipes()
  }, [])

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch("/api/recipes")
      if (response.ok) {
        const data = await response.json()
        setAllRecipes(data.recipes)
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error)
    }
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchRecipes(query)
    } else {
      // Reset to show all recipes
      setAllRecipes(allRecipes)
    }
  }

  const handleFilterChange = (filters: any) => {
    filterRecipes(filters)
  }

  const displayRecipes = recipes.length > 0 ? recipes : allRecipes

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-r from-background to-muted py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                <BookOpen className="h-10 w-10 text-accent" />
                Recipe Collection
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Browse our complete collection of delicious recipes from around the world.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <SearchBar onSearch={handleSearch} placeholder="Search recipes by name, ingredient, or cuisine..." />
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Sidebar */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <FilterSidebar onFilterChange={handleFilterChange} isOpen={true} onToggle={() => {}} />
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                  <Button variant="outline" onClick={() => setFilterOpen(true)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Error State */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Recipe List */}
                <RecipeList
                  recipes={displayRecipes}
                  onFavorite={user ? toggleFavorite : undefined}
                  favoriteRecipes={favoriteIds}
                  loading={loading}
                  title={`${displayRecipes.length} Recipe${displayRecipes.length !== 1 ? "s" : ""}`}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar onFilterChange={handleFilterChange} isOpen={filterOpen} onToggle={() => setFilterOpen(false)} />
    </div>
  )
}
