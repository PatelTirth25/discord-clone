'use client'

import { UseChatQuery } from "@/hooks/use-chat-query"
import { Member, Message, Profile } from "@prisma/client"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment, useEffect } from "react"
import { ChatItem } from "./chat-item"
import { useSocket } from "../providers/socket-provider"

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    type: "channel" | "conversation"
}

export const ChatMessages = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`
    const { socket } = useSocket()

    const {
        data,
        status,
        isFetchingNextPage,
        hasNextPage,
        refetch,
        fetchNextPage
    } = UseChatQuery({
        paramKey,
        paramValue,
        apiUrl,
        queryKey
    })

    useEffect(() => {
        if (!socket) return;

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            refetch()
        })

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            refetch()
        })

        return () => {
            socket.off(updateKey)
            socket.off(addKey)
        }
    }, [addKey, updateKey, refetch, socket])

    if (status == 'pending') {
        return (
            <div className="text-xl text-gray-400 flex h-full flex-col gap-y-2 items-center justify-center">
                <div className="animate-spin"><Loader2 className="w-10 h-10" /></div>
                <div>Loading...</div>
            </div>
        )
    }

    if (status == 'error') {
        return (
            <div className="text-xl text-gray-400 flex h-full flex-col gap-y-2 items-center justify-center">
                <div><ServerCrash className="text-rose-500 w-10 h-10" /></div>
                <div>Server Crashed!</div>
            </div>
        )
    }

    return (
        <div className=" h-[calc(100%-9rem)] w-full ">
            <div className="overflow-y-scroll flex w-full flex-col-reverse mt-auto h-[100%] mb-3">
                {data?.pages.map((d, i) => {
                    return (
                        <Fragment key={i}>
                            {d.items?.map((message: MessageWithMemberWithProfile) => (
                                <ChatItem
                                    key={message.id}
                                    currentMember={member}
                                    content={message.content}
                                    fileUrl={message.fileUrl}
                                    deleted={message.delete}
                                    timestamp={new Date(message.createdAt).toLocaleString()}
                                    id={message.id}
                                    member={message.member}
                                    isUpdated={message.createdAt !== message.updatedAt}
                                    socketUrl={socketUrl}
                                    socketQuery={socketQuery}
                                />
                            ))}
                        </Fragment>
                    )
                })}
                {!hasNextPage && (
                    <div className="text-md self-center text-gray-500 my-2">No messages :(</div>
                )}
                {hasNextPage && (
                    <div className="flex justify-center w-full">
                        {isFetchingNextPage ? (
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin " />
                        ) : (
                            <button
                                className="text-md self-center text-gray-500 my-2"
                                onClick={() => fetchNextPage()}
                            >
                                Load more
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

