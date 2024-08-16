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

const DeleteMessageModal = () => {

    const [isloading, setLoading] = useState(false)

    const { isOpen, close: modalClose, type: modalType, data: { apiUrl, query } } = useModalStore()

    let isModalOpen = isOpen && modalType === "deleteMessage"

    const handleCreate = async () => {
        try {
            setLoading(true)
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            })
            await axios.delete(url)
            modalClose()
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
                    <DialogTitle>Delete Message</DialogTitle>
                </DialogHeader>
                <div className="my-2 dark:text-gray-100 mx-auto">
                    Are you sure you want to delete Message?
                </div>
                <Button onClick={handleCreate} disabled={isloading} variant="destructive" className="bg-rose-500 w-full">Delete<Trash className="ml-5 w-5 h-5" /></Button>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteMessageModal
