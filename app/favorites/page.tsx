"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { RecipeList } from "@/components/recipe/recipe-list"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft } from "lucide-react"

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const { favorites, loading, toggleFavorite, favoriteIds } = useFavorites()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                My Favorite Recipes
              </h1>
              <p className="text-muted-foreground">Your saved recipes collection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorite recipes yet</h2>
            <p className="text-muted-foreground mb-6">Start exploring recipes and save your favorites!</p>
            <Button onClick={() => router.push("/")}>Discover Recipes</Button>
          </motion.div>
        ) : (
          <RecipeList
            recipes={favorites}
            onFavorite={toggleFavorite}
            favoriteRecipes={favoriteIds}
            title={`${favorites.length} Favorite Recipe${favorites.length !== 1 ? "s" : ""}`}
            showSorting={true}
          />
        )}
      </div>
    </div>
  )
}
