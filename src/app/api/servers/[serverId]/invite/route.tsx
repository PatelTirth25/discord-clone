import { NextResponse } from "next/server";
import CurrentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { v4 as uuid4 } from 'uuid'

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {

    try {
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
            },
            data: {
                inviteCode: uuid4()
            }
        })

        return NextResponse.json(newServer)

    } catch (error) {
        console.log("Error: ", error)
        return NextResponse.json({ error: "Error in Invite link" }, { status: 500 })
    }

}
