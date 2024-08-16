'use client'

import { Member, Profile } from "@prisma/client"
import AvatarImg from "../avatar"
import { Crown, Edit2, FileIcon, Shield, Trash, UserRound } from "lucide-react"
import { ToolTip } from "../toolTip"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import * as z from 'zod'
import axios from "axios"
import qs from 'query-string'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormItem,
    FormField
} from '@/components/ui/form'
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useModalStore } from "@/hooks/use-modal-store"
import { useParams, useRouter } from "next/navigation"

interface ChatItemProps {
    id: string,
    content: string,
    fileUrl: string | null,
    member: Member & {
        profile: Profile
    },
    timestamp: string,
    deleted: boolean,
    currentMember: Member,
    isUpdated: boolean,
    socketUrl: string,
    socketQuery: Record<string, string>
}

const memberIcon = {
    "ADMIN": <Crown className="text-rose-600 h-4 w-4" />,
    "MODERATOR": <Shield className="h-4 w-4 text-green-500" />,
    "USER": <UserRound className="h-4 w-4 text-indigo-400" />
}

const formSchema = z.object({
    content: z.string().min(1, { message: 'Please enter a message' }),
})

type formSchemaType = z.infer<typeof formSchema>

export const ChatItem = ({ id, content, fileUrl, member, deleted, timestamp, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {

    const router = useRouter()
    const params = useParams()
    const { open: ModalOpen } = useModalStore()

    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    })

    const isLoading = form.formState.isSubmitting

    const MemberClick = () => {
        if (currentMember.id === member.id) {
            return
        }
        router.push(`/server/${params?.serverId}/conversations/${member.id}`)
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                setIsEditing(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content, form])

    const [isEditing, setIsEditing] = useState(false)

    const fileType = fileUrl?.split('.')[fileUrl?.split('.').length - 1]

    const isAdmin = currentMember.role === 'ADMIN'
    const isModerator = currentMember.role === 'MODERATOR'
    const isOwner = currentMember.id === member.id
    const canDelete = !deleted && (isOwner || isAdmin || isModerator)
    const canEdit = !deleted && isOwner && !fileUrl

    const isPdf = fileUrl && fileType === 'pdf'
    const isImage = fileUrl && !isPdf

    const onSubmit = async (values: formSchemaType) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })
            await axios.patch(url, values)
            form.reset()
            setIsEditing(false)
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    return (
        <div className=" w-full hover:bg-gray-300 group p-4 dark:hover:bg-gray-800 relative">
            <div className="flex gap-x-8">
                <div className="flex gap-x-2 ">
                    <div onClick={MemberClick} className="hover:cursor-pointer">
                        <AvatarImg src={member.profile.imgUrl} className="w-5 h-5" />
                    </div>
                    <div onClick={MemberClick} className="hover:underline hover:underline-offset-4 hover:cursor-pointer text-sm dark:text-zinc-300 text-zinc-500">{member.profile.name}</div>
                    <ToolTip label={member.role} side="top" align="center">
                        <p>
                            {memberIcon[member.role]}
                        </p>
                    </ToolTip>
                </div>
                <div className="text-zinc-400 text-xs">{timestamp}</div>
            </div>
            <div className="mt-2 ml-6 ">
                {isImage && (
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square h-52 w-52 rounded-md flex items-center mt-2 overflow-hidden relative"
                    >
                        <Image src={fileUrl} fill alt={content} className="object-cover" />
                    </a>
                )}
                {isPdf && (
                    <div className="relative flex items-center p-1 mt-1">
                        <FileIcon className="w-8 h-8" />
                        <a href={fileUrl} target="_blank" rel="noreferrer noopener" className="mx-4 text-lg font-bold hover:text-indigo-500">PDF</a>
                    </div>
                )}
                {!isPdf && !isImage && !isEditing && (
                    <p className={cn(
                        "text-sm dark:text-zinc-300 text-zinc-800",
                        deleted && 'italic text-zinc-800 dark:text-zinc-300 text-xs'
                    )}>
                        {content}
                        {isUpdated && !deleted && (
                            <span className="text-xs mx-5 text-zinc-500">
                                (edited)
                            </span>
                        )}
                    </p>
                )}
                {canDelete && (
                    <div className="hidden group-hover:flex gap-x-2 items-center absolute p-1 top-1 right-5">
                        {canEdit && (
                            <ToolTip label="Edit" side="top" align="center">
                                <Edit2 onClick={() => setIsEditing(true)} className="cursor-pointer h-5 w-5 text-zinc-400 hover:text-zinc-500" />
                            </ToolTip>
                        )}

                        <ToolTip label="Delete" side="top" align="center">
                            <Trash onClick={() => ModalOpen('deleteMessage', { apiUrl: `${socketUrl}/${id}`, query: socketQuery })} className="cursor-pointer h-5 w-5 text-zinc-400 hover:text-zinc-500" />
                        </ToolTip>
                    </div>
                )}
                {!fileUrl && isEditing && (
                    <Form {...form}>
                        <form className="flex w-full gap-x-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name='content'
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl className="w-full">
                                            <div className="w-full">
                                                <Input disabled={isLoading} {...field} placeholder="Edit Message" />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isLoading} size='sm'>Save</Button>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    )
}

