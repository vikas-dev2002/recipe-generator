import { MongoClient, type Db } from "mongodb"

const MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://hunter_vikas:vikas_hunter007@mahakal.isw80q6.mongodb.net/RecipeDB"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    client = new MongoClient(MONGO_URI)
    await client.connect()
    db = client.db("RecipeDB")

    console.log("Connected to MongoDB")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export { db }
