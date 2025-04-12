import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return NextResponse.json({ message: "User created" }, { status: 201 })
}