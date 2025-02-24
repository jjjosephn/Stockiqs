import { useAppDispatch, useAppSelector } from '../app/redux'
import { setIsSideBarCollapsed } from '../app/state'
import { Archive, Icon, Layout, Menu, Users, ClipboardList , CircleDollarSign } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import logo from '../assets/businesslogo.png';
import React from 'react'
import { Sigmar } from 'next/font/google'

interface SidebarLinkProps {
   href: string
   icon: React.ElementType
   label: string
   isCollapsed: boolean
}

const sigmar = Sigmar({
   weight: '400',
   subsets: ['latin'],
 })

const SidebarLink = ({ href, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
   const pathname = usePathname()
   const isActive = pathname === href || (pathname === '/' && href === '/dashboard')

   return (
      <Link href={href}>
         <div 
            className={`cursor-pointer flex items-center hover:text-blue-500 
            hover:bg-blue-50 gap-3 transition-colors
            ${isCollapsed ? 'justify-center py-4' : 'justify-start px-8 py-4'}
            ${isActive ? 'bg-blue-200 text-white' : ''}
            `}
         >
            <Icon className='w-6 h-6 !text-gray-700'/>
            <span 
               className={`${isCollapsed ? 'hidden' : 'block'} font-medium text-gray-700`}
            >
               {label}
            </span>
         </div>
      </Link>
   )
}

const Sidebar = () => {
   const dispatch = useAppDispatch()

   const isSideBarCollapsed = useAppSelector((state) => 
      state.global.isSideBarCollapsed
   )

   const handleToggleSidebar = () => { 
      dispatch(setIsSideBarCollapsed(!isSideBarCollapsed))
   }

   const sidebarClassNames = `fixed flex flex-col ${
      isSideBarCollapsed ? 'w-0 md:w-16' : 'w-72 md:w-64'
   } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`

   return (
      <div className={sidebarClassNames}>
         <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8 
            ${isSideBarCollapsed ? 'px-5' : 'px-8'}`}
         >
            <Image src={logo} alt='logo' width={40} height={40}/>
            <h1 className={`${sigmar.className} text-2xl
               ${isSideBarCollapsed ? 'hidden' : 'block'}`}
            >
               Stockiqs
            </h1>
            <button 
               className='md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100'
               onClick={handleToggleSidebar}
            >
               <Menu className='w-4 h-4'/>
            </button>
         </div>

         <div className='flex-grow mt-8'>
            <SidebarLink 
               href='/dashboard' 
               icon={Layout} 
               label='Dashboard' 
               isCollapsed={isSideBarCollapsed}
            />

            <SidebarLink 
               href='/purchases' 
               icon={ClipboardList} 
               label='Purchases' 
               isCollapsed={isSideBarCollapsed}
            />

            <SidebarLink 
               href='/sales' 
               icon={CircleDollarSign} 
               label='Sales' 
               isCollapsed={isSideBarCollapsed}
            />

            <SidebarLink 
               href='/customers' 
               icon={Users} 
               label='Customers' 
               isCollapsed={isSideBarCollapsed}
            />

            <SidebarLink 
               href='/inventory' 
               icon={Archive} 
               label='Inventory' 
               isCollapsed={isSideBarCollapsed}
            />
         </div>

         {/*Footer */}
         <div className={`${isSideBarCollapsed ? 'hidden' : 'block'} pb-8`}>
            <p className='text-center text-xs text-gray-500'>&copy; 2025 Stockiqs</p>
         </div>
      </div>
   )
}

export default Sidebar