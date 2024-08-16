"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FileUploader from "../modals/fileUpload"
import { useRouter } from "next/navigation"
import axios from "axios"

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

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }),
    imgUrl: z.string().url().min(1, { message: "Server image is required" }),
})

const CreateServer = () => {

    const router = useRouter()

    type formSchemaType = z.infer<typeof formSchema>

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imgUrl: "",
        }
    })

    const loading = form.formState.isSubmitting

    const onSubmit = async (values: formSchemaType) => {
        try {
            await axios.post('/api/servers', values)

            form.reset()
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log("Error in post: ", error)
        }
    }

    return (
        <Dialog open>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Your Server</DialogTitle>
                    <DialogDescription>
                        Give your server name and image.
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
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default CreateServer
