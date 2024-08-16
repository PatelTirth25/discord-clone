"use client"

import { useState } from "react"
import { ServerWithMemberWithProfile } from "@/type"
import { Role } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ArrowRightToLine, ChevronDown, ChevronUp, PlusCircle, Settings, Trash2, UserPlus, Users } from "lucide-react"
import { useModalStore } from "@/hooks/use-modal-store"

const SidebarHeader = ({ server, role }: { server: ServerWithMemberWithProfile, role?: Role }) => {
    const [chevron, setChevron] = useState(false)
    const isAdmin = role === Role.ADMIN
    const isModerator = isAdmin || role === Role.MODERATOR

    const { open: ModalOpen } = useModalStore()

    return (
        <DropdownMenu onOpenChange={() => setChevron(chevron => !chevron)}>
            <DropdownMenuTrigger asChild className="focus:outline-none">
                <button className="h-14 w-full border-b-black border-b p-2 flex justify-between items-center">{server.name} {!chevron && <ChevronDown className="max-[768px]:hidden" />}{chevron && <ChevronUp className="max-[768px]:hidden" />}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
                {isModerator &&
                    <DropdownMenuItem className="text-blue-600 dark:text-indigo-400 cursor-pointer p-2 text-md flex justify-between" onClick={() => ModalOpen('inviteServer', { Server: server })}>Invite People <UserPlus className="w-5" /> </DropdownMenuItem>}
                {isModerator &&
                    <DropdownMenuItem className=" cursor-pointer p-2 text-md flex justify-between" onClick={() => ModalOpen('createChannel', { Server: server })} >Create Channel <PlusCircle className="w-5" /> </DropdownMenuItem>}
                {isAdmin &&
                    <DropdownMenuItem className=" cursor-pointer p-2 text-md flex justify-between" onClick={() => ModalOpen('manageMembers', { Server: server })}>Manage Members <Users className="w-5" /> </DropdownMenuItem>}
                {isAdmin &&
                    <DropdownMenuItem className=" cursor-pointer p-2 text-md flex justify-between" onClick={() => ModalOpen('serverSetting', { Server: server })} >Server Settings <Settings className="w-5" /> </DropdownMenuItem>}
                {isModerator &&
                    <DropdownMenuSeparator />}
                {isAdmin &&
                    <DropdownMenuItem className=" cursor-pointer p-2 text-md flex justify-between text-rose-500 dark:text-rose-500" onClick={() => ModalOpen('deleteServer', { Server: server })} >Delete Server <Trash2 className="w-5" /> </DropdownMenuItem>}
                {!isAdmin &&
                    <DropdownMenuItem className=" cursor-pointer p-2 text-md flex justify-between text-rose-500 dark:text-rose-500" onClick={() => ModalOpen('leaveServer', { Server: server })}>Leave Server <ArrowRightToLine className="w-5" /> </DropdownMenuItem>}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SidebarHeader
