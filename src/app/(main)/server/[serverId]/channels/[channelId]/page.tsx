import CurrentUser from "@/lib/currentUser"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Channelheader from "@/components/chat/channel-header"
import ChatInput from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { MediaRoom } from "@/components/media-room"

interface ChannelPageParams {
    params: {
        serverId: string,
        channelId: string
    }
}

const ChannelPage = async ({ params }: ChannelPageParams) => {
    const profile = await CurrentUser()

    if (!profile) {
        return redirect('/')
    }

    if (!params.serverId || !params.channelId) {
        return redirect('/')
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    })

    if (!channel || !member) {
        return redirect('/')
    }

    return (
        <div className="h-full relative w-full ">
            <Channelheader serverId={channel.serverId} name={channel.name} type={channel.type} />
            <div className="flex flex-col mt-auto h-full ">
                {channel.type === 'TEXT' && (
                    <>
                        <ChatMessages
                            name={channel.name}
                            member={member}
                            type="channel"
                            apiUrl="/api/messages"
                            socketUrl="/api/socket/messages"
                            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
                            paramKey="channelId"
                            paramValue={channel.id}
                            chatId={channel.id}
                        />
                        <ChatInput chatUrl='/api/messages' paramKey="channelId" paramValue={channel.id} chatId={channel.id} name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{ channelId: channel.id, serverId: channel.serverId }} />
                    </>
                )}
                {channel.type === 'AUDIO' && (
                    <MediaRoom chatId={channel.id} audio={true} video={false} name={profile.name} />
                )}

                {channel.type === 'VIDEO' && (
                    <MediaRoom chatId={channel.id} audio={true} video={true} name={profile.name} />
                )}
            </div>
        </div>
    )
}

export default ChannelPage
