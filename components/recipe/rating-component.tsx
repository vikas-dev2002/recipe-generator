"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface RatingComponentProps {
  recipeId: string
  currentRating?: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingComponent({
  recipeId,
  currentRating = 0,
  onRatingChange,
  readonly = false,
  size = "md",
}: RatingComponentProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  useEffect(() => {
    if (user && recipeId) {
      fetchUserRating()
    }
  }, [user, recipeId])

  const fetchUserRating = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) return

      const response = await fetch(`/api/ratings?recipeId=${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUserRating(data.userRating)
        setRating(data.userRating || 0)
      }
    } catch (error) {
      console.error("Failed to fetch user rating:", error)
    }
  }

  const handleRating = async (newRating: number) => {
    if (readonly || !user) return

    setLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) return

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId, rating: newRating }),
      })

      if (response.ok) {
        setRating(newRating)
        setUserRating(newRating)
        onRatingChange?.(newRating)
      }
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setLoading(false)
    }
  }

  const displayRating = readonly ? currentRating : hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div key={star} whileHover={!readonly ? { scale: 1.1 } : {}} whileTap={!readonly ? { scale: 0.95 } : {}}>
          <Button
            variant="ghost"
            size="sm"
            className={`p-0 h-auto hover:bg-transparent ${readonly ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={loading || readonly || !user}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                star <= displayRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </Button>
        </motion.div>
      ))}
      {!readonly && user && (
        <span className="text-sm text-muted-foreground ml-2">
          {userRating ? `You rated: ${userRating}` : "Rate this recipe"}
        </span>
      )}
    </div>
  )
}
