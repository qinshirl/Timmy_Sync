import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  try {
    // Confirm this date belongs to the current user (creator or partner)
    const dateToDelete = await prisma.importantDate.findUnique({
      where: { id: params.id },
    })

    if (
      !dateToDelete ||
      (dateToDelete.createdById !== user.id &&
        dateToDelete.partnerId !== user.id)
    ) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 })
    }

    await prisma.importantDate.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}