import CurrentUser from "@/lib/currentUser"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"


export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const { searchParams } = new URL(req.url)
        const profile = await CurrentUser()
        const serverId = searchParams.get("serverId")

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!serverId) {
            return NextResponse.json({ error: "ServerId is required" }, { status: 400 })
        }

        const server = await db.server.findUnique({
            where: {
                id: serverId
            }
        })


        if (server?.profileId !== profile.id) {
            return NextResponse.json({ error: "Only admins can remove members" }, { status: 401 })
        }

        const member = await db.member.findUnique({
            where: {
                id: params.memberId
            }
        })

        if (member?.profileId === profile.id) {
            return NextResponse.json({ error: "You can't remove yourself" }, { status: 400 })
        }

        const newServer = await db.server.update({
            where: {
                id: serverId
            },
            data: {
                member: {
                    delete: {
                        id: params.memberId
                    }
                }
            }
        })
        return NextResponse.json(newServer)
    } catch (error) {
        console.log("Error in path: ", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {

        const data = await req.json()
        const profile = await CurrentUser()

        const { role, serverId } = data

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!role) {
            return NextResponse.json({ error: "Role is required" }, { status: 400 })
        }
        if (!serverId) {
            return NextResponse.json({ error: "ServerId is required" }, { status: 400 })
        }

        const server = await db.server.findUnique({
            where: {
                id: serverId
            }
        })

        if (server?.profileId !== profile.id) {
            return NextResponse.json({ error: "Only admins can change roles" }, { status: 401 })
        }

        const newServer = await db.server.update({
            where: {
                id: serverId
            },
            data: {
                member: {
                    update: {
                        where: {
                            id: params.memberId
                        },
                        data: {
                            role: role
                        }
                    }
                }
            }
        })
        return NextResponse.json(newServer)
    } catch (error) {
        console.log("Error in path: ", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
