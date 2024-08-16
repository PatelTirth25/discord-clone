"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import qs from 'query-string'
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChannelType } from "@prisma/client"

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }).refine(name => name !== 'general', { message: "Channel name cannot be 'general'" }),
    type: z.nativeEnum(ChannelType)
})

const CreateChannelModal = () => {
    const { isOpen, close: modalClose, type: modalType } = useModalStore()
    let isModalOpen = isOpen && modalType === "createChannel"

    const router = useRouter()
    const params = useParams()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT
        }
    })

    const loading = form.formState.isSubmitting
    type formSchemaType = z.infer<typeof formSchema>

    const onSubmit = async (values: formSchemaType) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params.serverId
                }
            })

            await axios.post(url, values)

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
                    <DialogTitle>Create Your Channel</DialogTitle>
                    <DialogDescription>
                        Give your channel name and type.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                < FormItem >
                                    <FormLabel>Channel Name</FormLabel>
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
                            name="type"
                            control={form.control}
                            render={({ field }) => (
                                < FormItem >
                                    <FormLabel>Channel Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Channel Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ChannelType.TEXT}>Text</SelectItem>
                                                <SelectItem value={ChannelType.AUDIO}>Audio</SelectItem>
                                                <SelectItem value={ChannelType.VIDEO}>Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={loading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default CreateChannelModal
