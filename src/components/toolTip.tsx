"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipProps {
    label: string,
    side: "top" | "bottom" | "left" | "right",
    align: "start" | "center" | "end",
    children: React.ReactNode
}

export const ToolTip = ({ label, side, align, children }: TooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
