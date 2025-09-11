"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, ChefHat } from "lucide-react"

interface IngredientInputProps {
  onIngredientsChange: (ingredients: string[]) => void
  className?: string
}

const commonIngredients = [
  "chicken",
  "beef",
  "pork",
  "fish",
  "eggs",
  "milk",
  "cheese",
  "butter",
  "onion",
  "garlic",
  "tomatoes",
  "potatoes",
  "carrots",
  "broccoli",
  "spinach",
  "rice",
  "pasta",
  "bread",
  "flour",
  "olive oil",
]

export function IngredientInput({ onIngredientsChange, className = "" }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim().toLowerCase()
    if (trimmed && !ingredients.includes(trimmed)) {
      const newIngredients = [...ingredients, trimmed]
      setIngredients(newIngredients)
      onIngredientsChange(newIngredients)
      setInputValue("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter((ing) => ing !== ingredient)
    setIngredients(newIngredients)
    onIngredientsChange(newIngredients)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addIngredient(inputValue)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          What ingredients do you have?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add an ingredient..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Your ingredients:</h4>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {ingredients.map((ingredient) => (
                  <motion.div
                    key={ingredient}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {ingredient}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeIngredient(ingredient)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Common Ingredients */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Common ingredients:</h4>
          <div className="flex flex-wrap gap-2">
            {commonIngredients
              .filter((ing) => !ingredients.includes(ing))
              .slice(0, 12)
              .map((ingredient) => (
                <Button
                  key={ingredient}
                  variant="outline"
                  size="sm"
                  onClick={() => addIngredient(ingredient)}
                  className="text-xs"
                >
                  {ingredient}
                </Button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
