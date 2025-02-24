'use client'

import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import StoreProvider, { useAppSelector } from './redux'
import { RedirectToSignIn, SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { Sign } from 'crypto'

const DashboardLayout = ({ children } : { children: React.ReactNode}) => {
  const isSideBarCollapsed = useAppSelector((state) => 
    state.global.isSideBarCollapsed
  )

  const isDarkMode = useAppSelector((state) => 
    state.global.isDarkMode
  )

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className={`${isDarkMode ? 'dark' : 'light'} flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
      <Sidebar />
      <main className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 
        ${isSideBarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <Navbar />
        {children}
      </main>
    </div>
  )
}

const DashboardWrapper = ({ children } : { children: React.ReactNode}) => {
  return (
    <StoreProvider>
      <SignedOut>
        {children}
      </SignedOut>
      <SignedIn>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </SignedIn>
    </StoreProvider>
  )
}

export default DashboardWrapper