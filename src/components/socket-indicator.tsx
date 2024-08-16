"use client"
import { useSocket } from "./providers/socket-provider"
import { Badge } from "./ui/badge"

export default function SocketIndicator() {
    const { isConnected } = useSocket()

    if (!isConnected) {
        return <Badge variant="outline" className="bg-rose-500">Fallback: Polling every sec</Badge>
    }

    return <Badge variant="outline" className="bg-emerald-500">Live: Real-time updates</Badge>
}
