'use client'

import { Channel, Role } from "@prisma/client"
import { Edit3, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ToolTip } from "../toolTip"
import { ModalType, useModalStore } from "@/hooks/use-modal-store"
import { ServerWithMemberWithProfile } from "@/type"

interface SidebarSectionProps {
    channel: Channel,
    server: ServerWithMemberWithProfile,
    role?: Role
}

const iconMap = {
    "TEXT": <Hash className="h-5 w-5 text-zinc-500" />,
    "AUDIO": <Mic className="h-5 w-5 text-zinc-500" />,
    "VIDEO": <Video className="h-5 w-5 text-zinc-500" />,
}

const ServerChannel = ({ channel, server, role }: SidebarSectionProps) => {
    const params = useParams()
    const router = useRouter()

    const { open: modalOpen } = useModalStore()

    const Icon: React.ReactNode = iconMap[channel.type]

    const onClick = () => {
        router.push(`/server/${params.serverId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation()
        modalOpen(action, { Server: server, Channel: channel })
    }

    return (
        <button onClick={() => onClick()} className={cn("my-3 group flex gap-x-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 w-full p-2 rounded-lg items-center", params?.channelId == channel.id && "bg-zinc-200 dark:bg-zinc-700")}>
            {Icon}
            <div className="items-center text-zinc-700 dark:text-zinc-200 flex w-full justify-between" >
                {channel.name}
                <div>
                    {role != Role.USER && channel.name != "general" && (
                        <div className="flex gap-x-2">
                            <ToolTip label="Edit Channel" side="top" align="center">
                                <Edit3 onClick={(e) => onAction(e, 'editChannel')} className="group-hover:block hidden h-4 w-5 hover:text-zinc-400 dark:hover:text-zinc-900" />
                            </ToolTip>
                            <ToolTip label="Delete Channel" side="top" align="center">
                                <Trash onClick={(e) => onAction(e, 'deleteChannel')} className="group-hover:block hidden h-4 w-5 hover:text-zinc-400 dark:hover:text-zinc-900" />
                            </ToolTip>
                        </div>
                    )}
                    {channel.name == "general" && (
                        <Lock className="group-hover:block hidden h-4 w-5" />
                    )}
                </div>
            </div >
        </button >
    )
}

export default ServerChannel
