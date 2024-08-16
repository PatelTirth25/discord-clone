'use client'

import { useEffect, useState } from "react"
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface MediaRoomProps {
    chatId: string,
    audio: boolean,
    video: boolean,
    name: string
}

export const MediaRoom = ({ chatId, audio, video, name }: MediaRoomProps) => {
    const [token, setToken] = useState("")
    const router = useRouter()

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await res.json()
                setToken(data.token)
            } catch (error) {
                console.log("Error: ", error)
            }
        })()
    }, [chatId, router, name])

    if (token == "") {
        return (
            <div className="flex h-full w-full justify-center items-center flex-col">
                <Loader2 className="h-7 w-7 animate-spin text-zinc-500" />
                <p className="text-md text-zinc-600 dark:text-zinc-300">Connecting...</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme='default'
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            audio={audio}
            video={video}
        >
            <VideoConference />
        </LiveKitRoom>
    )

}
