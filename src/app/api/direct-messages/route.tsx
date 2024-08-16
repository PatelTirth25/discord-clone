import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import CurrentUser from "@/lib/currentUser";
import { DirectMessage } from "@prisma/client";


const Message_Batch = 15;

export async function GET(req: NextRequest) {
    try {
        const profile = await CurrentUser();
        const { searchParams } = new URL(req.url)

        const cursor = searchParams.get("cursor")
        const conversationId = searchParams.get("conversationId")

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!conversationId) {
            return NextResponse.json({ error: "ConversationId is required" }, { status: 400 })
        }

        let messages: DirectMessage[] = []

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: Message_Batch,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }
        else {
            messages = await db.directMessage.findMany({
                take: Message_Batch,
                where: {
                    conversationId: conversationId as string
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }

        let NextCursor = null;

        if (messages.length == Message_Batch) {
            NextCursor = messages[messages.length - 1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor: NextCursor
        })

    } catch (error) {
        console.log("Error in Post: ", error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
