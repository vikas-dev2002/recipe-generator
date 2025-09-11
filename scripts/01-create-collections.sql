-- MongoDB Collections Setup for Recipe Database
-- This script creates the necessary collections and indexes

-- Create recipes collection with sample data
db.recipes.createIndex({ "ingredients": 1 })
db.recipes.createIndex({ "dietaryRestrictions": 1 })
db.recipes.createIndex({ "cuisine": 1 })
db.recipes.createIndex({ "difficulty": 1 })
db.recipes.createIndex({ "cookingTime": 1 })

-- Create users collection
db.users.createIndex({ "email": 1 }, { unique: true })

-- Create ratings collection
db.ratings.createIndex({ "userId": 1, "recipeId": 1 }, { unique: true })
db.ratings.createIndex({ "recipeId": 1 })
