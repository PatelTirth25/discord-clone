"use client"
import { useState, useEffect } from "react"
import CreateServerModal from "../modals/createServerModal"
import InviteServerModal from "../modals/inviteServerModal"
import ServerSettingModal from "../modals/serverSettingModal"
import ManageMemberModal from "../modals/manageMemberModal"
import CreateChannelModal from "../modals/createChannelModal"
import LeaveServerModal from "../modals/leaveServerModal"
import DeleteServerModal from "../modals/deleteServerModal"
import DeleteChannelModal from "../modals/deleteChannelModal"
import EditChannelModal from "../modals/editChannelModal"
import MessageFileModal from "../modals/messageFileModal"
import DeleteMessageModal from "../modals/deleteMessageModal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }
    return (
        <>
            <CreateServerModal />
            <InviteServerModal />
            <ServerSettingModal />
            <ManageMemberModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteChannelModal />
            <DeleteServerModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </>
    )
}
