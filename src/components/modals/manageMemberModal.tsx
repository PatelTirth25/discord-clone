"use client"

import { useModalStore } from "@/hooks/use-modal-store"
import AvatarImg from "../avatar"
import qs from 'query-string'

import {
    DropdownMenu,
    DropdownMenuSub,
    DropdownMenuItem,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { ScrollArea } from "../ui/scroll-area"
import { Crown, Dot, Layers3, Loader2, MoreVertical, Shield, Trash, UserRound } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { Role } from "@prisma/client"
import { useRouter } from "next/navigation"
import { ServerWithMemberWithProfile } from "@/type"

const ManageMemberModal = () => {
    const router = useRouter()
    const { isOpen, close: modalClose, open: modalOpen, type: modalType, data: { Server } } = useModalStore()
    const [loadingId, setLoadingId] = useState("")

    let isModalOpen = isOpen && modalType === "manageMembers"

    interface roleIconType {
        [key: string]: JSX.Element,
    }

    const roleIcon: roleIconType = {
        "ADMIN": <Crown className="text-rose-600 h-4 w-4" />,
        "MODERATOR": <Shield className="h-4 w-4 text-green-500" />,
        "USER": <UserRound className="h-4 w-4 text-indigo-400" />
    }

    const onKick = async (memberId: string, profileId: string) => {
        try {
            setLoadingId(profileId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: Server?.id
                }
            })
            await axios.delete(url)
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("")
        }
    }

    const onRoleChange = async (role: Role, memberId: string, profileId: string) => {
        try {
            setLoadingId(profileId)
            await axios.patch(`/api/members/${memberId}`, { role, serverId: Server?.id })
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("")
        }
    }



    return (
        <Dialog open={isModalOpen} onOpenChange={modalClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                    <DialogDescription>
                        Members: {Server?.member?.length}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    <div className="flex-col space-y-5">

                        {Server?.member?.map(member => (
                            <div key={member.id} className="flex gap-5 items-center">
                                <AvatarImg src={member.profile.imgUrl} />
                                {member.profile.name}
                                {roleIcon[member.role]}
                                <div className="ml-auto">
                                    {member.profileId !== loadingId && member.profileId !== Server.profileId && (
                                        < DropdownMenu >
                                            <DropdownMenuTrigger className="focus:outline-none">
                                                <MoreVertical className="h-5 w-5" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <Layers3 className="w-4 h-4 mr-3" />
                                                        Role
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange("MODERATOR", member.id, member.profileId)}>
                                                            Moderator
                                                            {member.role == "MODERATOR" && <Dot className="ml-auto text-green-600" />}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange("USER", member.id, member.profileId)}>
                                                            User
                                                            {member.role == "USER" && <Dot className="text-indigo-600 ml-auto" />}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger onClick={() => onKick(member.id, member.profileId)} className="text-rose-600">
                                                        <Trash className="w-4 h-4 mr-3" />
                                                        Kick
                                                    </DropdownMenuSubTrigger>
                                                </DropdownMenuSub>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                    {loadingId === member.profileId && (
                                        <Loader2 className="w-5 h-5" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog >
    )
}

export default ManageMemberModal
