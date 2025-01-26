import React from 'react'
import { Menu, Bell, Sun, Settings, Moon } from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setIsDarkMode, setIsSideBarCollapsed } from '@/app/state'

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
      <div className='flex justify-between items-center w-full mb-7'>
         {/* Left */}
         <div className='flex justify-between items-center gap-5'>
            <button 
               className='px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100'
               onClick={handleToggleSidebar}
            >
               <Menu className='w-4 h-4'/>
            </button>
         </div>

         <div className='relative'>
            <input 
               type='search'
               placeholder='Search'
               className='pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 
               bg-white rounded-lg focus:outline-none focus:border-blue-500'
            />
            
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
               <Bell className='text-gray-500' size={20}/>
            </div>
         </div>
         {/* Right */}

         <div className='flex justify-between items-center gap-5'>
            <div className='hidden md:flex justify-between items-center gap-5'>
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
                  <div className='w-9 h-9'>image</div>
                  <span className='font-semibold'>Joseph Nguyen</span>
               </div>
            </div>
            <Link href='/settings'>
               <Settings className='cursor-pointer text-gray-500' size={24} />
            </Link>
         </div>
      </div>
   )
}

export default Navbar