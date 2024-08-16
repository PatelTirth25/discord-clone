import CurrentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const url = new URL(req.url)
        const serverId = url.searchParams.get("serverId")

        const profile = await CurrentUser();

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!serverId) {
            return NextResponse.json({ error: "Server not found" }, { status: 400 });
        }

        if (!params.channelId) {
            return NextResponse.json({ error: "Channel not found" }, { status: 400 });
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
                    delete: {
                        id: params.channelId
                    }
                }
            }
        })

        return NextResponse.json(newServer)

    } catch (error) {
        return NextResponse.json({ error: "Error in Server Delete" }, { status: 500 })
    }
}


export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const data = await req.json()
        const profile = await CurrentUser();
        const url = new URL(req.url)
        const serverId = url.searchParams.get("serverId")

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!serverId) {
            return NextResponse.json({ error: "Server not found" }, { status: 400 });
        }

        if (!params.channelId) {
            return NextResponse.json({ error: "Channel not found" }, { status: 400 });
        }

        if (data.name == "general") {
            return NextResponse.json({ error: "'general' channel name cannot be updated" }, { status: 400 })
        }

        console.log("Channelid: ", params.channelId)
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
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            }
                        },
                        data: {
                            name: data.name,
                            type: data.type
                        }
                    }
                }
            }
        })

        return NextResponse.json(newServer)

    } catch (error) {
        console.log("Error: ", error)
        return NextResponse.json({ error: "Error in Channel Update" }, { status: 500 })
    }
}
