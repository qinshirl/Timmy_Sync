// src/app/api/photo/delete/[id]/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const photoId = context.params.id

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || !user.partnerId) {
    return NextResponse.json({ error: "Link with a partner first" }, { status: 403 })
  }

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
  })

  if (
    !photo ||
    ![user.id, user.partnerId].includes(photo.uploaderId)
  ) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
  }

  // Delete from Supabase Storage
  const { error: storageError } = await supabaseServer
    .storage
    .from(process.env.SUPABASE_BUCKET!)
    .remove([photo.path])

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 })
  }

  // Delete from database
  await prisma.photo.delete({
    where: { id: photoId },
  })

  return NextResponse.json({ success: true })
}