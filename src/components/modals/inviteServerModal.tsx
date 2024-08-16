"use client"

import { useModalStore } from "@/hooks/use-modal-store"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Check, Copy, RefreshCcw } from "lucide-react"
import { Button } from "../ui/button"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
import axios from "axios"

const InviteServerModal = () => {
    const origin = useOrigin()

    const [isloading, setLoading] = useState(false)
    const [isCopied, setCopied] = useState(false)

    const { isOpen, open: modalOpen, close: modalClose, type: modalType, data: { Server } } = useModalStore()

    let isModalOpen = isOpen && modalType === "inviteServer"

    const inviteLink = `${origin}/invite/${Server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 2000);
    }

    const handleCreate = async () => {
        try {
            setLoading(true)
            const res = await axios.patch(`/api/servers/${Server?.id}/invite`)
            modalOpen('inviteServer', { Server: res.data })
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
                    <DialogTitle>Invite Your Friends</DialogTitle>
                </DialogHeader>
                <div className="my-2 dark:text-gray-100">
                    Server Invite Link
                    <div className="my-3 flex items-center">
                        <Input readOnly disabled={isloading} className="dark:bg-gray-300/10" value={inviteLink} />
                        <button disabled={isloading} onClick={onCopy}>
                            {isCopied ? <Check className="ml-5 w-6 h-6" /> : <Copy className="ml-5 w-6 h-6 cursor-pointer" />}
                        </button>
                    </div>
                </div>
                <Button onClick={handleCreate} disabled={isloading} variant="outline" className="w-full">Create New Link <RefreshCcw className="ml-5 w-5 h-5" /></Button>
            </DialogContent>
        </Dialog >
    )
}

export default InviteServerModal
