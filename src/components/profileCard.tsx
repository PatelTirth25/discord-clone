import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import Image from "next/image"
import Profile from "@/lib/profile"

const ProfileCard = async () => {
    const profile = await Profile()
    return (
        <HoverCard>
            <HoverCardTrigger className="w-[48px] h-[48px] relative rounded-full overflow-hidden hover:rounded-2xl transition-all duration-700"><Image src={profile?.imgUrl} fill alt="Profile" /></HoverCardTrigger>
            <HoverCardContent>
                <p className="text-center text-sm dark:text-gray-400">{profile?.name}</p>
                <p className="text-center text-sm dark:text-gray-400">{profile?.email}</p>
                <p className="text-center text-xs text-muted-foreground">
                    Joined At: &nbsp;
                    {profile?.createdAt.toLocaleDateString()}
                </p>
            </HoverCardContent>
        </HoverCard>
    )
}

export default ProfileCard
