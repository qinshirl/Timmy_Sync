// src/app/api/photo/[photoId]/comment/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { photoId: string } }
) {
  const session = await getServerSession(authOptions)
  const { text } = await req.json()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: {
      text,
      userId: user.id,
      photoId: params.photoId,
    },
    include: {
      user: true,
    },
  })

  return NextResponse.json(comment)
}

// export async function GET(
//     _req: Request,
//     { params }: { params: { photoId: string } }
//   ) {

    
//     const session = await getServerSession(authOptions)
  
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }
  
//     const comments = await prisma.comment.findMany({
//       where: { photoId: params.photoId },
//       orderBy: { createdAt: "asc" },
//       include: {
//         user: true,
//       },
//     })
  
//     return NextResponse.json(comments)
//   }

// export async function GET(req: Request, context: { params: { photoId: string } }) {
//     const { params } = context; 
  
//     const session = await getServerSession(authOptions)
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }
  
//     const comments = await prisma.comment.findMany({
//       where: { photoId: params.photoId },
//       orderBy: { createdAt: "asc" },
//       include: { user: true },
//     })
  
//     return NextResponse.json(comments)
//   }

// export async function GET(req: Request, context: { params: { photoId: string } }) {
//     const { params } = context
//     const { photoId } = params
  
//     const session = await getServerSession(authOptions)
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }
  
//     const comments = await prisma.comment.findMany({
//       where: { photoId },
//       orderBy: { createdAt: "asc" },
//       include: { user: true },
//     })
  
//     return NextResponse.json(comments)
//   }

export async function GET(_req: Request, context: { params: { photoId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const comments = await prisma.comment.findMany({
      where: { photoId: context.params.photoId },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    })
  
    return NextResponse.json(comments)
  }