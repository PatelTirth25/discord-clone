import { db } from "@/lib/db"
import CurrentUser from "@/lib/currentUser"
import { redirect } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteId: string } }) => {
    const profile = await CurrentUser();

    if (!profile) {
        return redirect('/')
    }

    if (!params.inviteId) {
        return redirect('/')
    }

    const checkServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteId,
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (checkServer) {
        return redirect(`/server/${checkServer.id}`)
    }

    const server = await db.server.findFirst({
        where: {
            inviteCode: params.inviteId
        }
    })

    if (!server) {
        return redirect('/')
    }

    const newServer = await db.server.update({
        where: {
            id: server.id,
            inviteCode: params.inviteId
        },
        data: {
            member: {
                create: [{
                    profileId: profile.id
                }]
            }
        }
    })

    return redirect(`/server/${newServer.id}`)

}

export default InvitePage
