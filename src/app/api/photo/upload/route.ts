// src/app/api/photo/upload/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { supabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file || typeof file.name !== "string") {
    return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || !user.partnerId) {
    return NextResponse.json({ error: "You must be linked to a partner" }, { status: 403 })
  }

  const bucket = process.env.SUPABASE_BUCKET
  if (!bucket) {
    return NextResponse.json({ error: "Bucket not configured" }, { status: 500 })
  }

  // console.log("Bucket env:", process.env.SUPABASE_BUCKET)
  // console.log("File:", file)
  // console.log("File name:", file.name)
  // console.log("File type:", file.type)
  // console.log("File size:", file.size)
  // console.log("File lastModified:", file.lastModified)
  // console.log("File webkitRelativePath:", file.webkitRelativePath)

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // sanitize filename
  const sanitizedFileName = file.name.replace(/[^\w.-]/g, "-")
  const fileName = `${user.id}-${Date.now()}-${sanitizedFileName}`
  
  const { data, error: uploadError } = await supabaseServer
    .storage
    .from(bucket)
    .upload(fileName, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })
  
  // console.log("Upload data:", data)
  // console.log("Upload error:", uploadError)
  
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  await prisma.photo.create({
    data: {
      path: fileName,
      uploaderId: user.id,
      partnerId: user.partnerId,
    },
  })

  return NextResponse.json({ success: true, path: fileName })
}
