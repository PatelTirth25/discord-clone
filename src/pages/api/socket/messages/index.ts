import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/type";
import CurrentUserPages from "@/lib/currentUser-pages";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {

        const profile = await CurrentUserPages(req)
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) {
            res.status(401).json({ message: 'Unauthorized' })
        }

        if (!serverId) {
            res.status(400).json({ message: 'ServerId required' })
        }

        if (!channelId) {
            res.status(400).json({ message: 'ChannelId required' })
        }

        if (!content) {
            res.status(400).json({ message: 'Content required' })
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                member: {
                    some: {
                        profileId: profile?.id
                    }
                }
            },
            include: {
                member: true
            }
        })

        if (!server) {
            res.status(404).json({ message: 'Server not found' })
        }

        const channel = await db.channel.findUnique({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if (!channel) {
            res.status(404).json({ message: 'Channel not found' })
        }

        const member = server?.member.find((m) => m.profileId === profile?.id)

        if (!member) {
            res.status(404).json({ message: 'Member not found' })
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                memberId: member?.id as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${channelId}:messages`

        res?.socket?.server?.io?.emit(channelKey, message)

        res.status(200).json({ message })

    } catch (error) {
        console.log("Error in socket: ", error);
        res.status(500).json({ message: 'Internal server error' })
    }
}
