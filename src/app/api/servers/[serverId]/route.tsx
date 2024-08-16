import CurrentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await CurrentUser();

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!params.serverId) {
            return NextResponse.json({ error: "Server not found" }, { status: 400 });
        }

        const newServer = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        })

        return NextResponse.json(newServer)


    } catch (error) {
        return NextResponse.json({ error: "Error in Server Delete" }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const data = await req.json()
        const profile = await CurrentUser();

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!params.serverId) {
            return NextResponse.json({ error: "Server not found" }, { status: 400 });
        }

        const newServer = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name: data.name,
                imgUrl: data.imgUrl
            }
        })

        return NextResponse.json(newServer)

    } catch (error) {
        return NextResponse.json({ error: "Error in Server Update" }, { status: 500 })
    }
}
