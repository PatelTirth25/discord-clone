"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FileUploader from "../modals/fileUpload"
import { redirect, useRouter } from "next/navigation"
import axios from "axios"
import { useModalStore } from "@/hooks/use-modal-store"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Form, FormField, FormControl, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }),
    imgUrl: z.string().url().min(1, { message: "Server image is required" }),
})

const ServerSettingModal = () => {
    const { isOpen, close: modalClose, type: modalType, data: { Server } } = useModalStore()
    let isModalOpen = isOpen && modalType === "serverSetting"

    const router = useRouter()


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imgUrl: ""
        }
    })

    useEffect(() => {
        if (Server) {
            form.setValue("name", Server.name)
            form.setValue("imgUrl", Server.imgUrl)
        }
    }, [Server, form])

    const loading = form.formState.isSubmitting
    type formSchemaType = z.infer<typeof formSchema>

    const onSubmit = async (values: formSchemaType) => {
        try {
            await axios.patch(`/api/servers/${Server?.id}`, values)

            form.reset()
            router.refresh()
            modalClose()
        } catch (error) {
            console.log("Error in post: ", error)
        }
    }

    const handleClose = () => {
        form.reset()
        modalClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Server Settings</DialogTitle>
                    <DialogDescription>
                        Change your server image and name
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                < FormItem >
                                    <FormLabel>Server Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Enter server Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="imgUrl"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Server Image</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <FileUploader
                                                endpoint="imageUploader"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={loading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default ServerSettingModal
