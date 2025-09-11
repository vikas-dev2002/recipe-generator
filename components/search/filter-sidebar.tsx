"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X } from "lucide-react"

interface FilterOptions {
  cuisine: string
  difficulty: string
  maxCookingTime: number
  dietaryRestrictions: string[]
}

interface FilterSidebarProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void
  isOpen: boolean
  onToggle: () => void
}

const cuisines = ["Italian", "Asian", "Mexican", "American", "Mediterranean", "Indian", "Greek", "Japanese", "Thai"]

const difficulties = ["Easy", "Medium", "Hard"]

const dietaryOptions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "low-carb", "keto", "paleo"]

export function FilterSidebar({ onFilterChange, isOpen, onToggle }: FilterSidebarProps) {
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    cuisine: "",
    difficulty: "",
    maxCookingTime: 120,
    dietaryRestrictions: [],
  })

  const handleCuisineChange = (cuisine: string) => {
    const newFilters = { ...filters, cuisine: cuisine === "all" ? "" : cuisine }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDifficultyChange = (difficulty: string) => {
    const newFilters = { ...filters, difficulty: difficulty === "all" ? "" : difficulty }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleTimeChange = (time: number[]) => {
    const newFilters = { ...filters, maxCookingTime: time[0] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    const currentRestrictions = filters.dietaryRestrictions || []
    const newRestrictions = checked
      ? [...currentRestrictions, restriction]
      : currentRestrictions.filter((r) => r !== restriction)

    const newFilters = { ...filters, dietaryRestrictions: newRestrictions }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      cuisine: "",
      difficulty: "",
      maxCookingTime: 120,
      dietaryRestrictions: [],
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 lg:relative lg:translate-x-0 lg:z-auto overflow-y-auto"
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cuisine Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Cuisine</Label>
              <Select value={filters.cuisine || "all"} onValueChange={handleCuisineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All cuisines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cuisines</SelectItem>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select value={filters.difficulty || "all"} onValueChange={handleDifficultyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cooking Time Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Max Cooking Time: {filters.maxCookingTime} minutes</Label>
              <Slider
                value={[filters.maxCookingTime || 120]}
                onValueChange={handleTimeChange}
                max={240}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Dietary Restrictions</Label>
              <div className="space-y-2">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={(filters.dietaryRestrictions || []).includes(option)}
                      onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="text-sm capitalize">
                      {option.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
