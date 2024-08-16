import Sidebar from "@/components/navigation/sideBar"

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="bg-gray-200 dark:bg-gray-700 h-full flex w-full">
      <div className='bg-gray-100 dark:bg-gray-900 h-full w-[80px] max-[768px]:hidden z-100'>
        <Sidebar />
      </div>
      <main className='h-full w-full'>
        {children}
      </main>
    </div>
  )
}

export default MainLayout 
