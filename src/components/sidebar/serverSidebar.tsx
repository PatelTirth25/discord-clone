import CurrentUser from "@/lib/currentUser"
import { db } from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"
import SidebarHeader from "./sidebar-header"
import SearchBar from "./searchBar"
import { Crown, MicVocal, Shield, SquarePen, Tv, UserRound } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import ServerSection from "./serverSection"
import ServerChannel from "./serverChannel"
import ServerMember from "./serverMember"

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
    const profile = await CurrentUser()

    if (!profile) {
        return redirect('/signup')
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            member: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc"
                }
            },
            channel: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        },
    })

    if (!server) {
        return redirect('/')
    }

    const textChannels = server?.channel.filter(item => item.type === ChannelType.TEXT)
    const voiceChannels = server?.channel.filter(item => item.type === ChannelType.AUDIO)
    const videoChannels = server?.channel.filter(item => item.type === ChannelType.VIDEO)

    const members = server?.member.filter(item => item.profileId !== profile.id)
    const role = server?.member.find(item => item.profileId === profile.id)?.role

    const memberIcon = {
        "ADMIN": <Crown className="text-rose-600 h-4 w-4" />,
        "MODERATOR": <Shield className="h-4 w-4 text-green-500" />,
        "USER": <UserRound className="h-4 w-4 text-indigo-400" />
    }
    const channelIcon = {
        "TEXT": <SquarePen className=" h-4 w-4" />,
        "AUDIO": <MicVocal className=" h-4 w-4" />,
        "VIDEO": <Tv className=" h-4 w-4" />
    }

    return (
        <div>
            <SidebarHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <SearchBar
                    data={
                        [
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: [
                                    ...textChannels?.map(item => ({
                                        icon: channelIcon[item.type],
                                        name: item.name,
                                        id: item.id
                                    }))
                                ]
                            },
                            {
                                label: "Audio Channels",
                                type: "channel",
                                data: [
                                    ...voiceChannels?.map(item => ({
                                        icon: channelIcon[item.type],
                                        name: item.name,
                                        id: item.id
                                    })),
                                ]
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: [
                                    ...videoChannels?.map(item => ({
                                        icon: channelIcon[item.type],
                                        name: item.name,
                                        id: item.id
                                    })),
                                ]
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: [
                                    ...members?.map(item => ({
                                        icon: memberIcon[item.role],
                                        name: item.profile.name,
                                        id: item.id
                                    })),
                                ]
                            }
                        ]
                    }
                />
                <Separator className="bg-black w-full h-[1px]" />
                {!!textChannels?.length && (
                    <div>
                        <ServerSection label="Text Channels" type="TEXT" />
                        {textChannels?.map(channel => {
                            return <ServerChannel key={channel.id} role={role} channel={channel} server={server} />
                        })}
                    </div>
                )}

                {!!voiceChannels?.length && (
                    <div>
                        <ServerSection label="Audio Channels" type="AUDIO" />
                        {voiceChannels?.map(channel => {
                            return <ServerChannel key={channel.id} role={role} channel={channel} server={server} />
                        })}
                    </div>
                )}

                {!!videoChannels?.length && (
                    <div>
                        <ServerSection label="Video Channels" type="VIDEO" />
                        {videoChannels?.map(channel => {
                            return <ServerChannel key={channel.id} role={role} channel={channel} server={server} />
                        })}
                    </div>
                )}
                {!!members?.length && (
                    <div>
                        <ServerSection label="Members" type="MEMBER" />
                        {members?.map(member => {
                            return <ServerMember icon={memberIcon[member.role]} member={member} server={server} key={member.id} />
                        })}
                    </div>
                )}
            </ScrollArea>
        </div>

    )
}

export default ServerSidebar
