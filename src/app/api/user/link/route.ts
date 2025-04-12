import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { partnerCode } = await req.json()

  if (!partnerCode) {
    return NextResponse.json({ error: "Partner code required" }, { status: 400 })
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (currentUser.partnerId) {
    return NextResponse.json({ error: "You are already linked" }, { status: 400 })
  }

  if (partnerCode === currentUser.id) {
    return NextResponse.json({ error: "You cannot link with yourself" }, { status: 400 })
  }

  const partner = await prisma.user.findUnique({
    where: { id: partnerCode },
  })

  if (!partner) {
    return NextResponse.json({ error: "Invalid partner code" }, { status: 404 })
  }

  if (partner.partnerId) {
    return NextResponse.json({ error: "That partner is already linked" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { partnerId: partner.id },
  })

  await prisma.user.update({
    where: { id: partner.id },
    data: { partnerId: currentUser.id },
  })

  return NextResponse.json({ message: "Partner linked successfully!" })
}