import { redirect } from "next/navigation"
import CurrentUser from "@/lib/currentUser"
import { db } from "@/lib/db"

const ServerPage = async ({ params }: { params: { serverId: string } }) => {
    const profile = await CurrentUser()
    if (!profile) {
        return redirect('/signup')
    }

    if (!params.serverId) {
        return redirect('/')
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            member: {
                some: {
                    profileId: profile.id
                }
            },
        },
        include: {
            channel: {
                where: {
                    name: 'general'
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    })

    const generalChannel = server?.channel[0]

    if (generalChannel?.name !== 'general') {
        return redirect('/')
    }

    return redirect(`/server/${params.serverId}/channels/${generalChannel.id}`)

}

export default ServerPage
