'use client'

import PopularProductsCard from '@/components/DashboardCards/PopularProductsCard'
import PurchaseSummaryCard from '@/components/DashboardCards/PurchaseSummaryCard'
import SalesSummaryCard from '@/components/DashboardCards/SalesSummaryCard'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows'>
      <PopularProductsCard />
      <SalesSummaryCard />
      <PurchaseSummaryCard />
      <div className='row-span-3 bg-gray-500'/>
      <div className='md:row-span-1 xl:row-span-2 bg-gray-500'/>
      <div className='md:row-span-1 xl:row-span-2 bg-gray-500'/>
      <div className='md:row-span-1 xl:row-span-2 bg-gray-500'/>
    </div>
  )
}

export default Dashboard