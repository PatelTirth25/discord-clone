"use client"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ToolTip } from "../toolTip"

interface NavigationItemProps {
    id: string,
    imgUrl: string,
    name: string
}

export const NavigationItem = ({ id, imgUrl, name }: NavigationItemProps) => {
    const params = useParams()
    const router = useRouter()

    const onclick = () => {
        router.push(`/server/${id}`)
    }

    return (
        <ToolTip label={name} side="right" align='start'>
            <button
                className="group flex items-center"
                onClick={onclick}
            >
                <div className={cn(
                    "transition-all bg-black dark:bg-white rounded-r-full w-[4px]",
                    id != params?.serverId && "group-hover:h-[35px]",
                    id == params?.serverId ? "h-[40px]" : "h-[17px]"

                )} />
                <div className={cn(
                    "transition-all mx-3 overflow-hidden h-[48px] w-[48px] relative",
                    id != params?.serverId && "group-hover:rounded-xl rounded-full",
                    id == params?.serverId && "rounded-xl"
                )}>
                    <Image src={imgUrl} fill alt="server image" />
                </div>
            </button>
        </ToolTip>
    )
}
