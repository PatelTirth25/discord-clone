"use client"

import { useModalStore } from "@/hooks/use-modal-store"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"

const LeaveServerModal = () => {

    const [isloading, setLoading] = useState(false)

    const { isOpen, close: modalClose, type: modalType, data: { Server } } = useModalStore()

    let isModalOpen = isOpen && modalType === "leaveServer"

    const handleCreate = async () => {
        try {
            setLoading(true)
            await axios.patch(`/api/servers/${Server?.id}/leave`)
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
                    <DialogTitle>Leave Server</DialogTitle>
                </DialogHeader>
                <div className="my-2 dark:text-gray-100">
                    Are you sure you want to leave {Server?.name} ?
                </div>
                <Button onClick={handleCreate} disabled={isloading} variant="destructive" className="bg-rose-600 w-full">Leave<LogOut className="ml-5 w-5 h-5" /></Button>
            </DialogContent>
        </Dialog >
    )
}

export default LeaveServerModal
