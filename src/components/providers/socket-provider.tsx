"use client"
import { createContext, useState, useEffect, useContext } from "react"
import { io as ClientIo } from "socket.io-client"

type SocketContextType = {
    socket: any | null,
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false })

export function useSocket() {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = new (ClientIo as any)(process.env.NEXT_PUBLIC_SITE_URL, {
            path: "/api/socket/io",
            addTrailingSlash: false
        })

        setSocket(socketInstance)

        socketInstance.on("connect", () => {
            setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket: socket, isConnected: isConnected }}>
            {children}
        </SocketContext.Provider>
    )

}
