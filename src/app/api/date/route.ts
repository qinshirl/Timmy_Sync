import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, date } = body

  if (!title || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || !user.partnerId) {
    return NextResponse.json({ error: "Link to a partner first" }, { status: 403 })
  }

  const newDate = await prisma.importantDate.create({
    data: {
      title,
      description,
      date: new Date(date),
      createdById: user.id,
      partnerId: user.partnerId,
    },
  })

  return NextResponse.json(newDate)
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || !user.partnerId) {
    return NextResponse.json([], { status: 200 })
  }

  // fetch shared dates where current user is either creator or partner
  const sharedDates = await prisma.importantDate.findMany({
    where: {
      OR: [
        { createdById: user.id, partnerId: user.partnerId },
        { createdById: user.partnerId, partnerId: user.id },
      ],
    },
    orderBy: {
      date: "asc",
    },
  })

  return NextResponse.json(sharedDates)
}