import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    count: number;
    loadMore: () => void;
    shouldLoadMore: boolean;
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    count,
    loadMore,
    shouldLoadMore
}: ChatScrollProps) => {
    const [hasinitialized, setHasinitialized] = useState(false)

    useEffect(() => {
        const topDiv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore()
            }
        }

        topDiv?.addEventListener('scroll', handleScroll)

        return () => topDiv?.removeEventListener('scroll', handleScroll)

    }, [loadMore, shouldLoadMore, chatRef])

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef?.current;
        const shouldAutoScroll = () => {
            if (!hasinitialized && bottomDiv) {
                setHasinitialized(true)
                return true;
            }
            if (!topDiv) {
                return false;
            }
            const distance = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
            return distance <= 100
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomDiv?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }

    }, [bottomRef, chatRef, hasinitialized, count])
}
