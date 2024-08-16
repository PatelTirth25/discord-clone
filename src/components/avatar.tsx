import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

const AvatarImg = ({ src, className }: { src?: string; className?: string }) => {
    return (
        <Avatar className={cn(
            "w-8 h-8",
            className
        )}>
            <AvatarImage src={src} />
        </Avatar>
    )
}

export default AvatarImg
