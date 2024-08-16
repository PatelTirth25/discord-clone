"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FileUploader from "../modals/fileUpload"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useModalStore } from "@/hooks/use-modal-store"

import qs from 'query-string'
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

const formSchema = z.object({
    imgUrl: z.string().url().min(1, { message: "Attachment is required" }),
})

const MessageFileModal = () => {
    const { isOpen, data, close: modalClose, type: modalType } = useModalStore()
    let isModalOpen = isOpen && modalType === "messageFile"

    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imgUrl: "",
        }
    })

    const loading = form.formState.isSubmitting
    type formSchemaType = z.infer<typeof formSchema>

    const onSubmit = async (values: formSchemaType) => {
        try {

            const url = qs.stringifyUrl({
                url: data?.apiUrl as string,
                query: data?.query
            })

            await axios.post(url, { fileUrl: values.imgUrl, content: values.imgUrl })

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
                    <DialogTitle>Attach File</DialogTitle>
                    <DialogDescription>
                        image or pdf
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="imgUrl"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <FileUploader
                                                endpoint="messageFile"
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
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default MessageFileModal
