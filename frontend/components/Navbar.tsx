import React from 'react'
import { Menu, Bell, Sun, Settings, Moon } from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../app/redux'
import { setIsDarkMode, setIsSideBarCollapsed } from '../app/state'
import { UserButton } from '@clerk/nextjs'
import { Sigmar } from 'next/font/google'

const sigmar = Sigmar({
  weight: '400',
  subsets: ['latin'],
})

const Navbar = () => {
   const dispatch = useAppDispatch()
   
   const isSideBarCollapsed = useAppSelector((state) => 
      state.global.isSideBarCollapsed
   )

   const isDarkMode = useAppSelector((state) => 
       state.global.isDarkMode
     )

   const handleToggleSidebar = () => { 
      dispatch(setIsSideBarCollapsed(!isSideBarCollapsed))
   }

   const handleToggleDarkMode = () => {
      dispatch(setIsDarkMode(!isDarkMode))
   }
  
   return (
      <div className='flex justify-between items-center w-full mb-7 bg-gray-50'>
         {/* Left */}
         <div className='flex justify-between items-center gap-5'>
            <button 
               className='px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100'
               onClick={handleToggleSidebar}
            >
               <Menu className='w-4 h-4'/>
            </button>
         </div>

         <Link href='/dashboard'>
            <h1 className={`${sigmar.className} text-5xl`}>Stockiqs</h1>
         </Link>

         <div className='flex justify-between items-center gap-5'>
            <div className='md:flex justify-between items-center gap-5'>
               <div>
                  <button onClick={handleToggleDarkMode}>
                     {isDarkMode ? (
                        <Sun className='cursor-pointer text-gray-500' size={24} />
                     ) : (
                        <Moon className='cursor-pointer text-gray-500' size={24} />
                     )}
                  </button>
               </div>
               <hr className='w-0 h-7 border border-solid border-l border-gray-300 mx-3'/>
               <div className='flex items-center gap-3 cursor-pointer'>
                  <UserButton 
                     showName={true} 
                     appearance={{
                        elements: {
                           userButtonAvatarBox: "w-10 h-10", 
                           userButtonPopoverCard: "bg-blue-100", 
                           userButtonPopoverActionButton: "text-red-600",
                           userButtonText: "text-gray-900"
                        },
                        variables: {
                           fontSize: '1rem'                        }
                     }}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Navbar