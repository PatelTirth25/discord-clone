import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import CurrentUser from "@/lib/currentUser";
import { Message } from "@prisma/client";


const Message_Batch = 15;

export async function GET(req: NextRequest) {
    try {
        const profile = await CurrentUser();
        const { searchParams } = new URL(req.url)

        const cursor = searchParams.get("cursor")
        const channelId = searchParams.get("channelId")

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!channelId) {
            return NextResponse.json({ error: "ChannelId is required" }, { status: 400 })
        }

        let messages: Message[] = []

        if (cursor) {
            messages = await db.message.findMany({
                take: Message_Batch,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
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
            messages = await db.message.findMany({
                take: Message_Batch,
                where: {
                    channelId
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
