import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    const result = await AuthService.registerUser(email, name, password)

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 400 })
  }
}
