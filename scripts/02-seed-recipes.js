// Seed script to populate the database with 20+ recipes
const { MongoClient } = require("mongodb")

const MONGO_URI = "mongodb+srv://hunter_vikas:vikas_hunter007@mahakal.isw80q6.mongodb.net/RecipeDB"



recipes.push(...additionalRecipes)

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI)

  try {
    await client.connect()
    const db = client.db("RecipeDB")

    // Clear existing recipes
    await db.collection("recipes").deleteMany({})

    // Insert new recipes
    const result = await db.collection("recipes").insertMany(recipes)
    console.log(`Inserted ${result.insertedCount} recipes`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
