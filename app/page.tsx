"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { SearchBar } from "@/components/search/search-bar"
import { IngredientInput } from "@/components/search/ingredient-input"
import { FilterSidebar } from "@/components/search/filter-sidebar"
import { RecipeList } from "@/components/recipe/recipe-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Sparkles, Clock, Users } from "lucide-react"
import { useRecipeSearch } from "@/hooks/use-recipe-search"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/contexts/auth-context"
import type { Recipe } from "@/lib/types"

export default function HomePage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [searchMode, setSearchMode] = useState<"text" | "ingredients">("text")

  const { user } = useAuth()
  const { recipes, ingredientMatches, loading, error, searchRecipes, filterRecipes, searchByIngredients } =
    useRecipeSearch()
  const { toggleFavorite, favoriteIds } = useFavorites()

  useEffect(() => {
    // Fetch featured recipes on load
    fetchFeaturedRecipes()
  }, [])

  const fetchFeaturedRecipes = async () => {
    try {
      const response = await fetch("/api/recipes")
      if (response.ok) {
        const data = await response.json()
        // Show top-rated recipes as featured
        const featured = data.recipes.sort((a: Recipe, b: Recipe) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)
        setFeaturedRecipes(featured)
      }
    } catch (error) {
      console.error("Failed to fetch featured recipes:", error)
    }
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchRecipes(query)
      setSearchMode("text")
    }
  }

  const handleIngredientSearch = (ingredients: string[]) => {
    if (ingredients.length > 0) {
      searchByIngredients(ingredients)
      setSearchMode("ingredients")
    }
  }

  const handleFilterChange = (filters: any) => {
    filterRecipes(filters)
    setSearchMode("text")
  }

  const hasResults = recipes.length > 0 || ingredientMatches.length > 0
  const showFeatured = !hasResults && !loading

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Discover Amazing Recipes with{" "}
                <span className="text-accent">
                  <Sparkles className="inline h-8 w-8 md:h-12 md:w-12" />
                  Smart Suggestions
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Find perfect recipes based on ingredients you have at home. Get personalized suggestions, save
                favorites, and cook with confidence.
              </p>

              {/* Search Section */}
              <div className="max-w-2xl mx-auto space-y-6">
                <SearchBar onSearch={handleSearch} placeholder="Search for recipes, cuisines, or dishes..." />

                <div className="text-sm text-muted-foreground">
                  <span>or</span>
                </div>

                <IngredientInput onIngredientsChange={handleIngredientSearch} />
              </div>
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

                {/* Results */}
                {hasResults ? (
                  <RecipeList
                    recipes={searchMode === "text" ? recipes : []}
                    ingredientMatches={searchMode === "ingredients" ? ingredientMatches : []}
                    onFavorite={user ? toggleFavorite : undefined}
                    favoriteRecipes={favoriteIds}
                    loading={loading}
                    title={
                      searchMode === "ingredients"
                        ? "Recipes you can make"
                        : recipes.length > 0
                          ? "Search Results"
                          : "Filtered Recipes"
                    }
                  />
                ) : (
                  showFeatured && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      {/* Featured Recipes */}
                      <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Featured Recipes</h2>
                        <RecipeList
                          recipes={featuredRecipes}
                          onFavorite={user ? toggleFavorite : undefined}
                          favoriteRecipes={favoriteIds}
                          title=""
                          showSorting={false}
                        />
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">20+</div>
                            <p className="text-xs text-muted-foreground">Curated recipes from various cuisines</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Cooking Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">30 min</div>
                            <p className="text-xs text-muted-foreground">Quick and easy recipes for busy schedules</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Serving Sizes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">2-8</div>
                            <p className="text-xs text-muted-foreground">Adjustable portions for any group size</p>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )
                )}
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
