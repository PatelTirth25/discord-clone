"use client"

import { useParams, useRouter } from "next/navigation"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Search } from "lucide-react"
import { useState } from "react"

interface searchBarProps {
    data: {
        label: string,
        type: 'channel' | 'member',
        data: {
            icon: React.ReactNode,
            name: string,
            id: string
        }[] | undefined
    }[]
}

const SearchBar = ({ data }: searchBarProps) => {
    const [isOpen, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    const onClick = ({ id, type }: { id: string, type: 'channel' | 'member' }) => {
        setOpen(false)
        if (type === 'channel') {
            router.push(`/server/${params.serverId}/channels/${id}`)
        }
        if (type === 'member') {
            router.push(`/server/${params.serverId}/conversations/${id}`)
        }
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="flex gap-x-3 items-center w-full py-2 my-2 dark:hover:bg-gray-700 text-sm rounded-lg justify-center text-zinc-500 hover:bg-zinc-200 dark:text-gray-300">
                <Search className="dark:text-gray-400 text-gray-500 w-4 h-4" /> Search
            </button>
            <CommandDialog open={isOpen} onOpenChange={setOpen}>
                <CommandInput placeholder="Search channels and members" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ icon, name, id }) => {
                                    return (
                                        <CommandItem onSelect={() => onClick({ id, type })} key={id} className="flex gap-3">
                                            {icon}{name}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default SearchBar

