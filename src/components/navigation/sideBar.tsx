import CurrentUser from '@/lib/currentUser'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { NavigationItem } from './navigationItem'
import { ModeToggle } from '../mode-toggle'
import ProfileCard from '../profileCard'
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { NavigationAction } from './Navigation-action'
import { LogOut } from 'lucide-react'

const Sidebar = async () => {
    const profile = await CurrentUser()

    if (!profile) {
        return redirect('/signup')
    }

    const servers = await db.server.findMany({
        where: {
            member: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return (
        <div className='space-y-4 flex flex-col items-center py-3'>
            <NavigationAction />
            <Separator className='mx-auto rounded-full dark:bg-zinc-800 w-14 h-[3px]' />
            <ScrollArea className='w-full'>
                {servers.map(item => {
                    return (
                        <div key={item.id} className='mb-5'>
                            <NavigationItem id={item.id} imgUrl={item.imgUrl} name={item.name} />
                        </div>
                    )
                })}
            </ScrollArea>
            <div className='flex flex-col gap-y-4 absolute bottom-4 items-center'>
                <ModeToggle />
                <ProfileCard />
                <LogoutLink ><LogOut className='h-10 w-10' /></LogoutLink>
            </div>
        </div>
    )
}

export default Sidebar
