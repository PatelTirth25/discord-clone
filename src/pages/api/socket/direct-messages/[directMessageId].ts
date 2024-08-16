import CurrentUserPages from "@/lib/currentUser-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== 'PATCH' && req.method !== 'DELETE') {
        res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { directMessageId, conversationId } = req.query
        const { content } = req.body
        const profile = await CurrentUserPages(req)

        if (!profile) {
            res.status(401).json({ message: 'Unauthorized' })
        }
        if (!conversationId) {
            res.status(400).json({ message: 'ConversationId required' })
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile?.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile?.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        if (!conversation) {
            res.status(400).json({ message: 'Conversation Not Found' })
        }

        const member = conversation?.memberOne?.profileId !== profile?.id ? conversation?.memberTwo : conversation?.memberOne

        if (!member) {
            res.status(400).json({ message: 'Member Not Found' })
        }

        let message = await db.directMessage.findUnique({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
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

            message = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
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
            message = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
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

        const updateKey = `chat:${conversationId}:messages:update`

        res?.socket?.server?.io?.emit(updateKey, message)

        res.status(200).json(message)

    } catch (error) {
        console.log("Error in request: ", error)
        res.status(500).json({ error: 'Inter Server Error' })
    }
}
