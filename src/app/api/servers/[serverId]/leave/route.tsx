import { NextResponse } from "next/server";
import CurrentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {

    try {
        const profile = await CurrentUser();

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!params.serverId) {
            return NextResponse.json({ error: "Server not found" }, { status: 400 });
        }

        const user = await db.profile.findUnique({
            where: {
                id: profile.id
            },
            include: {
                member: {
                    where: {
                        serverId: params.serverId,
                        role: {
                            in: [Role.USER, Role.MODERATOR]
                        }
                    },
                    orderBy: {
                        id: "asc"
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Not part of this group" })
        }

        const newServer = await db.server.update({
            where: {
                id: params.serverId
            },
            data: {
                member: {
                    delete: {
                        id: user.member[0].id
                    }
                }
            }
        })


        return NextResponse.json(newServer)

    } catch (error) {
        console.log("Error: ", error)
        return NextResponse.json({ error: "Error in Leave link" }, { status: 500 })
    }

}
