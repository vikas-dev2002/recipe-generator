import { connectToDatabase } from "./mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { User } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export class AuthService {
  static async registerUser(email: string, name: string, password: string): Promise<{ user: User; token: string }> {
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      email,
      name,
      password: hashedPassword,
      favoriteRecipes: [],
      dietaryPreferences: [],
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertedId.toString(), email }, JWT_SECRET, { expiresIn: "7d" })

    return {
      user: {
        _id: result.insertedId.toString(),
        email,
        name,
        favoriteRecipes: [],
        dietaryPreferences: [],
        createdAt: newUser.createdAt,
      },
      token,
    }
  }

  static async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const { db } = await connectToDatabase()

    // Find user
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error("Invalid email or password")
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString(), email }, JWT_SECRET, { expiresIn: "7d" })

    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        favoriteRecipes: user.favoriteRecipes || [],
        dietaryPreferences: user.dietaryPreferences || [],
        createdAt: user.createdAt,
      },
      token,
    }
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
      const { db } = await connectToDatabase()
      const { ObjectId } = require("mongodb")

      const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })
      if (!user) return null

      return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        favoriteRecipes: user.favoriteRecipes || [],
        dietaryPreferences: user.dietaryPreferences || [],
        createdAt: user.createdAt,
      }
    } catch (error) {
      return null
    }
  }

  static async updateUserPreferences(userId: string, dietaryPreferences: string[]): Promise<User> {
    const { db } = await connectToDatabase()
    const { ObjectId } = require("mongodb")

    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { dietaryPreferences } })

    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    return {
      _id: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      favoriteRecipes: updatedUser.favoriteRecipes || [],
      dietaryPreferences: updatedUser.dietaryPreferences || [],
      createdAt: updatedUser.createdAt,
    }
  }
}
