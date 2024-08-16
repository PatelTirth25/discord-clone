import { v4 as uuid4 } from 'uuid'
import { Role } from '@prisma/client';
import CurrentUser from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, imgUrl } = await req.json();
        const profile = await CurrentUser();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const newServer = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imgUrl,
                inviteCode: uuid4(),
                channel: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                member: {
                    create: [
                        { profileId: profile.id, role: Role.ADMIN }
                    ]
                }
            }
        })

        return NextResponse.json(newServer)

    } catch (error) {
        console.log("Post request error: ", error)
        return new NextResponse("Server Error", { status: 500 })
    }
}
