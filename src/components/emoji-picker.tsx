"use client"

import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Smile } from 'lucide-react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

import { useTheme } from 'next-themes'

interface EmojiPickerProps {
    onChange: (emoji: string) => void
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { resolvedTheme } = useTheme()
    return (
        <Popover>
            <PopoverTrigger>
                <Smile className='hover:text-zinc-500 h-8 w-8' />
            </PopoverTrigger>
            <PopoverContent side='right' sideOffset={100} className='bottom-8  absolute shadow-none right-7 bg-transparent border-none'>
                <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
            </PopoverContent>
        </Popover>
    )
}

export default EmojiPicker
