import CurrentUser from '@/lib/currentUser'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import ServerSidebar from '@/components/sidebar/serverSidebar'

const ServerLayout = async ({ children, params }: { children: React.ReactNode, params: { serverId: string } }) => {
    const profile = await CurrentUser()
    if (!profile) {
        return redirect('/signup')
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (!server) {
        return redirect('/')
    }

    return (
        <div className='w-full h-full flex'>
            <div className='max-[768px]:hidden dark:bg-gray-800 bg-gray-50 flex-col h-full w-72 z-50'>
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className='overflow-x-hidden overflow-y-hidden h-full w-full'>
                {children}
            </main>
        </div>
    )
}

export default ServerLayout
