"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { IngredientInput } from "@/components/search/ingredient-input"
import { RecipeList } from "@/components/recipe/recipe-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ChefHat, Sparkles } from "lucide-react"
import { useRecipeSearch } from "@/hooks/use-recipe-search"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/contexts/auth-context"

const cuisineTypes = ["Italian", "Asian", "Mexican", "Mediterranean", "Indian", "American"]
const dietaryOptions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "low-carb"]

export default function DiscoverPage() {
  const [selectedCuisine, setSelectedCuisine] = useState<string>("")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])

  const { user } = useAuth()
  const { ingredientMatches, loading, searchByIngredients, filterRecipes } = useRecipeSearch()
  const { toggleFavorite, favoriteIds } = useFavorites()

  const handleIngredientSearch = (ingredients: string[]) => {
    searchByIngredients(ingredients)
  }

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine)
    filterRecipes({ cuisine })
  }

  const handleDietaryFilter = (dietary: string) => {
    const newDietary = selectedDietary.includes(dietary)
      ? selectedDietary.filter((d) => d !== dietary)
      : [...selectedDietary, dietary]

    setSelectedDietary(newDietary)
    filterRecipes({ dietaryRestrictions: newDietary })
  }

  const clearFilters = () => {
    setSelectedCuisine("")
    setSelectedDietary([])
    filterRecipes({})
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Lightbulb className="h-10 w-10 text-accent" />
            Discover New Recipes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Find your next favorite dish by exploring ingredients you have or filtering by cuisine and dietary
            preferences.
          </p>
        </motion.div>

        {/* Ingredient Discovery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-6 w-6" />
                What's in your kitchen?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IngredientInput onIngredientsChange={handleIngredientSearch} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="space-y-6">
            {/* Cuisine Filters */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Explore by Cuisine
              </h3>
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.map((cuisine) => (
                  <Button
                    key={cuisine}
                    variant={selectedCuisine === cuisine ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCuisineFilter(cuisine)}
                  >
                    {cuisine}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dietary Filters */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((dietary) => (
                  <Badge
                    key={dietary}
                    variant={selectedDietary.includes(dietary) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleDietaryFilter(dietary)}
                  >
                    {dietary.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCuisine || selectedDietary.length > 0) && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {ingredientMatches.length > 0 ? (
            <RecipeList
              ingredientMatches={ingredientMatches}
              onFavorite={user ? toggleFavorite : undefined}
              favoriteRecipes={favoriteIds}
              loading={loading}
              title="Recipes you can make"
            />
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to discover?</h3>
              <p className="text-muted-foreground">
                Add some ingredients above or select a cuisine to find amazing recipes!
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
