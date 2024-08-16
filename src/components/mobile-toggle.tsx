import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import Sidebar from "./navigation/sideBar"
import ServerSidebar from "./sidebar/serverSidebar"

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className="p-0 flex gap-0">
                <div className="w-[80px]">
                    <Sidebar />
                </div>
                <div className="w-64 ">
                    <ServerSidebar serverId={serverId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileToggle
