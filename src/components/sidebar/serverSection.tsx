import { AudioWaveform, Text, Tv, Users } from "lucide-react"

interface ServerSectionProps {
    label: string,
    type: "TEXT" | "AUDIO" | "VIDEO" | "MEMBER"
}

const Icon = {
    "TEXT": <Text className="w-5 h-5 text-zinc-400" />,
    "AUDIO": <AudioWaveform className="w-5 h-5 text-zinc-400" />,
    "VIDEO": <Tv className="w-5 h-5 text-zinc-400" />,
    "MEMBER": <Users className="w-5 h-5 text-zinc-400" />,
}

const ServerSection = ({
    label,
    type,
}: ServerSectionProps) => {
    return (
        <div className="flex items-center gap-x-3 w-full my-4 dark:text-zinc-300 text-gray-600">
            {Icon[type]}{label}
        </div>
    )
}

export default ServerSection
