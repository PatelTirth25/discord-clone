import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useSocket } from '@/components/providers/socket-provider'

interface UseChatQueryProps {
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    paramValue: string
}

export const UseChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: UseChatQueryProps) => {
    const { isConnected } = useSocket()

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue
            }
        }, { skipNull: true })

        const res = await fetch(url)
        return res.json()
    }

    const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000
    })

    return {
        data, fetchNextPage, refetch, hasNextPage, isFetchingNextPage, status
    }
}

