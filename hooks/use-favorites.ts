"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Recipe } from "@/lib/types"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    } else {
      setFavorites([])
      setFavoriteIds([])
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) return

      const response = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
        setFavoriteIds(data.favorites.map((recipe: Recipe) => recipe._id!))
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = useCallback(
    async (recipeId: string) => {
      if (!user) return

      try {
        const token = localStorage.getItem("auth-token")
        if (!token) return

        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId }),
        })

        if (response.ok) {
          setFavoriteIds((prev) => [...prev, recipeId])
          // Optionally refetch favorites to get the full recipe data
          fetchFavorites()
        }
      } catch (error) {
        console.error("Failed to add to favorites:", error)
      }
    },
    [user],
  )

  const removeFromFavorites = useCallback(
    async (recipeId: string) => {
      if (!user) return

      try {
        const token = localStorage.getItem("auth-token")
        if (!token) return

        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId }),
        })

        if (response.ok) {
          setFavoriteIds((prev) => prev.filter((id) => id !== recipeId))
          setFavorites((prev) => prev.filter((recipe) => recipe._id !== recipeId))
        }
      } catch (error) {
        console.error("Failed to remove from favorites:", error)
      }
    },
    [user],
  )

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      if (favoriteIds.includes(recipeId)) {
        removeFromFavorites(recipeId)
      } else {
        addToFavorites(recipeId)
      }
    },
    [favoriteIds, addToFavorites, removeFromFavorites],
  )

  const isFavorited = useCallback((recipeId: string) => favoriteIds.includes(recipeId), [favoriteIds])

  return {
    favorites,
    favoriteIds,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorited,
    refetch: fetchFavorites,
  }
}
