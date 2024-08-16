"use client"

import { useModalStore } from "@/hooks/use-modal-store"
import qs from "query-string"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"

const DeleteChannelModal = () => {

    const [isloading, setLoading] = useState(false)

    const { isOpen, close: modalClose, type: modalType, data: { Server, Channel } } = useModalStore()

    let isModalOpen = isOpen && modalType === "deleteChannel"

    const handleCreate = async () => {
        try {
            setLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/channels/${Channel?.id}`,
                query: {
                    serverId: Server?.id
                }
            })
            await axios.delete(url)
            window.location.reload()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={modalClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Channel</DialogTitle>
                </DialogHeader>
                <div className="my-2 dark:text-gray-100">
                    Are you sure you want to delete &apos;{Channel?.name}&apos; {Channel?.type.toLowerCase()} channel ?
                </div>
                <Button onClick={handleCreate} disabled={isloading} variant="destructive" className="bg-rose-500 w-full">Delete<Trash className="ml-5 w-5 h-5" /></Button>
            </DialogContent>
        </Dialog >
    )
}

export default DeleteChannelModal
