import CurrentUserPages from "@/lib/currentUser-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'PATCH' && req.method !== 'DELETE') {
        res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { messageId, serverId, channelId } = req.query
        const { content } = req.body
        const profile = await CurrentUserPages(req)

        if (!profile) {
            res.status(401).json({ message: 'Unauthorized' })
        }
        if (!channelId) {
            res.status(400).json({ message: 'ChannelId required' })
        }
        if (!serverId) {
            res.status(400).json({ message: 'ServerId required' })
        }
        if (!messageId) {
            res.status(400).json({ message: 'MessageId required' })
        }

        const server = await db.server.findUnique({
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
            res.status(400).json({ message: 'Server Not Found' })
        }

        const channel = await db.channel.findUnique({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if (!channel) {
            res.status(400).json({ message: 'Channel Not Found' })
        }

        const member = server?.member.find(mem => (
            mem.profileId === profile?.id
        ))

        if (!member) {
            res.status(400).json({ message: 'Member Not Found' })
        }

        let message = await db.message.findUnique({
            where: {
                id: messageId as string,
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

        if (!message || message.delete) {
            res.status(400).json({ message: 'Message Not Found' })
        }

        const isMessageOwner = message?.member.id === member?.id
        const isAdmin = member?.role === 'ADMIN'
        const isModerator = member?.role === 'MODERATOR'
        const canModify = isMessageOwner || isAdmin || isModerator

        if (!canModify) {
            res.status(401).json({ message: 'You do not have permission to modify this message' })
        }

        console.log("Permission : ", canModify)

        if (req.method === 'PATCH') {
            if (!isMessageOwner) {
                res.status(401).json({ message: 'You do not have permission to modify this message' })
            }

            message = await db.message.update({
                where: {
                    id: messageId as string,
                    memberId: member?.id
                },
                data: {
                    content: content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        if (req.method === 'DELETE') {
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    fileUrl: null,
                    content: 'This message has been deleted',
                    delete: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${channelId}:messages:update`

        res?.socket?.server?.io?.emit(updateKey, message)

        res.status(200).json(message)

    } catch (error) {
        console.log("Error in request: ", error)
        res.status(500).json({ error: 'Inter Server Error' })
    }
}
