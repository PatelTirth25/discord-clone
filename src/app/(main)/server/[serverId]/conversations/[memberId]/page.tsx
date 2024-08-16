import { db } from "@/lib/db"
import CurrentUser from "@/lib/currentUser"
import { redirect } from "next/navigation"
import { Conversation } from "@/lib/conversation"
import Channelheader from "@/components/chat/channel-header"
import ChatInput from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { MediaRoom } from "@/components/media-room"

interface ConversationPageParams {
    params: {
        serverId: string
        memberId: string
    },
    searchParams: {
        video?: boolean
    }
}

const ConversationPage = async ({ params, searchParams }: ConversationPageParams) => {
    const profile = await CurrentUser()

    if (!profile) {
        return redirect('/')
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) {
        return redirect('/')
    }

    const conversation = await Conversation(currentMember.id, params.memberId)

    if (!conversation) {
        return redirect('/')
    }

    const { memberOne, memberTwo } = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className="h-full w-full relative">
            <Channelheader name={otherMember.profile.name} imgUrl={otherMember.profile.imgUrl} serverId={params.serverId} type="MEMBER" />
            <div className="flex flex-col h-full mt-auto">
                {searchParams.video && (
                    <MediaRoom chatId={conversation.id} video={true} audio={true} name={currentMember.profile.name} />
                )}
                {!searchParams.video && (
                    <>
                        <ChatMessages
                            name={otherMember.profile.name}
                            member={currentMember}
                            type="conversation"
                            apiUrl="/api/direct-messages"
                            socketUrl="/api/socket/direct-messages"
                            socketQuery={{ conversationId: conversation.id }}
                            paramKey="conversationId"
                            paramValue={conversation.id}
                            chatId={conversation.id}
                        />
                        <ChatInput chatUrl='/api/direct-messages' name={otherMember.profile.name} paramKey="conversationId" paramValue={conversation.id} chatId={conversation.id} type="conversation" apiUrl="/api/socket/direct-messages" query={{ conversationId: conversation.id }} />
                    </>
                )}
            </div>
        </div>
    )
}

export default ConversationPage
