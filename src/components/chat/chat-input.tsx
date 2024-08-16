"use client"

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormControl, Form, FormItem, FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Plus } from 'lucide-react'
import EmojiPicker from '../emoji-picker'

import axios from 'axios'
import qs from 'query-string'
import { useModalStore } from '@/hooks/use-modal-store'
import { useRouter } from 'next/navigation'
import { UseChatQuery } from '@/hooks/use-chat-query'

interface ChatInputProps {
    apiUrl: string,
    name: string,
    type: "conversation" | "channel",
    query: Record<string, any>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    chatId: string,
    chatUrl: string
}

const formSchema = z.object({
    content: z.string().min(1, { message: 'Please enter a message' }),
})


const ChatInput = ({ chatUrl, apiUrl, paramKey, chatId, paramValue, name, type, query }: ChatInputProps) => {
    const queryKey = `chat:${chatId}`

    const router = useRouter()
    const { open: modalOpen } = useModalStore()

    type formSchemaType = z.infer<typeof formSchema>

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })

    const {
        refetch
    } = UseChatQuery({
        paramKey,
        paramValue,
        apiUrl: chatUrl,
        queryKey
    })


    const loading = form.formState.isSubmitting

    const handleSubmit = async (values: formSchemaType) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })

            await axios.post(url, values)

            form.reset()
            router.refresh()
            refetch()

        } catch (error) {
            console.log("Error: ", error)
        }
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField control={form.control} name="content"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <div className='relative pb-[0.8rem] p-3'>
                                        <button onClick={() => modalOpen('messageFile', { apiUrl, query })} disabled={loading} type='button' className='bg-zinc-700 rounded-full dark:bg-zinc-200 hover:bg-zinc-400 dark:hover:bg-zinc-500 transition-all absolute left-8 bottom-5'>
                                            <Plus className='p-1 w-10 h-10 dark:text-black text-white' />
                                        </button>
                                        <Input {...field} disabled={loading} className='h-14 pl-20' placeholder={`Message ${type === 'conversation' ? name : `#${name}`}`} />
                                        <div className='absolute right-10 bottom-5'>
                                            <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} />
                                        </div>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )
                    }}
                />
            </form>
        </Form>
    )
}

export default ChatInput
