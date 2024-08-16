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
        const { conversationId } = req.query;

        if (!profile) {
            res.status(401).json({ message: 'Unauthorized' })
        }

        if (!conversationId) {
            res.status(400).json({ message: 'ConversationId required' })
        }

        if (!content) {
            res.status(400).json({ message: 'Content required' })
        }

        const conversation = await db.conversation.findUnique({
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
            res.status(404).json({ message: 'Conversation not found' })
        }

        const member = conversation?.memberOne?.profileId !== profile?.id ? conversation?.memberTwo : conversation?.memberOne

        if (!member) {
            res.status(404).json({ message: 'Member not found' })
        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                memberId: member?.id as string,
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

        const channelKey = `chat:${conversationId}:messages`

        res?.socket?.server?.io?.emit(channelKey, message)

        res.status(200).json({ message })

    } catch (error) {
        console.log("Error in socket: ", error);
        res.status(500).json({ message: 'Internal server error' })
    }
}
