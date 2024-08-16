'use client'

import { cn } from "@/lib/utils"
import { Member, Profile, Server } from "@prisma/client"
import { useRouter, useParams } from "next/navigation"
import AvatarImg from "../avatar"

interface ServerMemberProps {
    member: Member & { profile: Profile },
    server: Server,
    icon: React.ReactNode
}
const ServerMember = ({ member, server, icon }: ServerMemberProps) => {
    const router = useRouter()
    const params = useParams()

    return (
        <button onClick={() => router.push(`/server/${server.id}/conversations/${member.id}`)} className={cn("group flex gap-x-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 w-full px-2 rounded-lg items-center", params?.memberId == member.id && "bg-zinc-200 dark:bg-zinc-700")}>
            {icon}
            <div className="my-3 items-center text-zinc-700 dark:text-zinc-200 flex w-full text-md gap-x-4" >
                <AvatarImg src={member.profile.imgUrl} />
                {member.profile.name}
            </div >
        </button >
    )
}

export default ServerMember
