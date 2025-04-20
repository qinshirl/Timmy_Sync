// src/app/api/photo/list/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
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

  const photos = await prisma.photo.findMany({
    where: {
      OR: [
        { uploaderId: user.id, partnerId: user.partnerId },
        { uploaderId: user.partnerId, partnerId: user.id },
      ],
    },
    orderBy: { createdAt: "desc" },
  })

  const bucket = process.env.SUPABASE_BUCKET!

  const signedUrls = await Promise.all(
    photos.map(async (photo) => {
      const { data } = await supabaseServer
        .storage
        .from(bucket)
        .createSignedUrl(photo.path, 3600)
      return {
        id: photo.id,
        url: data?.signedUrl || "",
        title: photo.path.split("-").slice(-1)[0],
      }
    })
  )

  return NextResponse.json(signedUrls)
}