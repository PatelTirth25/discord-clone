"use client"
import { ToolTip } from "../toolTip"
import { Plus } from "lucide-react"
import { useModalStore } from "@/hooks/use-modal-store"

export const NavigationAction = () => {
    const { open: modalOpen } = useModalStore()
    return (
        <ToolTip label="Create Server" side="right" align='start'>
            <button onClick={() => modalOpen('createServer')} className="flex items-center justify-center w-14 h-14 dark:bg-violet-900 bg-violet-400 rounded-full hover:dark:bg-purple-900 hover:bg-purple-400 hover:rounded-xl transition-all duration-150"><Plus /></button>
        </ToolTip>
    )
}
