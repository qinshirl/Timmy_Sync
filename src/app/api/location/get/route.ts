// src/app/api/location/get/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || !user.partnerId) {
    return NextResponse.json({ error: "No partner linked" }, { status: 403 })
  }

  const partnerLocation = await prisma.location.findUnique({
    where: { userId: user.partnerId }, 
  })

  if (!partnerLocation) {
    return NextResponse.json({ error: "No location found for partner" }, { status: 404 })
  }

//   return NextResponse.json(partnerLocation)
return NextResponse.json({ partnerLocation })
}