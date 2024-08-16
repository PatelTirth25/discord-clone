'use client'

import qs from 'query-string'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Video, VideoOff } from 'lucide-react'
import { ToolTip } from '../toolTip'

export const ChatVideoButton = () => {
    const searchparams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const isVideo = searchparams?.get('video')
    const Icon = isVideo ? VideoOff : Video
    const toolTipLabel = isVideo ? 'End Video Call' : 'Start Video Call'

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || '',
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true })

        router.push(url)
    }

    return (
        <ToolTip side='bottom' align='center' label={toolTipLabel}>
            <button onClick={() => onClick()} className='mr-4 hover:opacity-50 transition'>
                <Icon className='h-6 w-6 text-zinc-600 dark:text-zinc-300' />
            </button>
        </ToolTip>
    )
}
