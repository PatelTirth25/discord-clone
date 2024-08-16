import { Hash, Mic, Video } from "lucide-react"
import MobileToggle from "../mobile-toggle"
import AvatarImg from "../avatar"
import SocketIndicator from "../socket-indicator"
import { ChatVideoButton } from "./chat-video-button"

interface ChannelheaderProps {
    name: string,
    imgUrl?: string,
    serverId: string,
    type: "AUDIO" | "VIDEO" | "TEXT" | "MEMBER"
}


const iconMap = {
    "TEXT": <Hash className="ml-4 h-5 w-5 text-zinc-500" />,
    "AUDIO": <Mic className="ml-4 h-5 w-5 text-zinc-500" />,
    "VIDEO": <Video className="ml-4 h-5 w-5 text-zinc-500" />,
}

const Channelheader = ({ name, imgUrl, serverId, type }: ChannelheaderProps) => {

    const icon = type !== "MEMBER" ? iconMap[type] : <AvatarImg src={imgUrl} />

    return (
        <div className="sticky top-0 left-0 z-50 bg-gray-200 dark:bg-gray-700 flex items-center w-full h-14 border-b-black border-b p-2 ">
            <MobileToggle serverId={serverId} />
            {icon}
            <p className="ml-2 text-lg font-bold">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type === 'MEMBER' && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}

export default Channelheader
