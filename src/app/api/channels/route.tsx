import CurrentUser from "@/lib/currentUser";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get("serverId")
        const profile = await CurrentUser()
        const { name, type } = await req.json()

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!serverId) {
            return NextResponse.json({ error: "ServerId is required" }, { status: 400 })
        }

        if (!name || !type) {
            return NextResponse.json({ error: "Value is required" }, { status: 400 })
        }

        if (name == "general") {
            return NextResponse.json({ error: "'general' name is not allowed" }, { status: 400 })
        }

        const newServer = await db.server.update({
            where: {
                id: serverId,
                member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [Role.MODERATOR, Role.ADMIN]
                        }
                    }
                }
            },
            data: {
                channel: {
                    create: [
                        {
                            profileId: profile.id,
                            name: name,
                            type: type,
                        }
                    ]
                }
            }
        })

        return NextResponse.json(newServer)

    } catch (error) {
        console.log("Error in post: ", error)
        return NextResponse.json({ error: "Error in post" }, { status: 500 })
    }
}
