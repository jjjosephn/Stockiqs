'use client'

import ExpenseSummaryCard from '@/components/DashboardComponents/ExpenseSummaryCard'
import PopularProductsCard from '@/components/DashboardComponents/PopularProductsCard'
import PurchaseSummaryCard from '@/components/DashboardComponents/PurchaseSummaryCard'
import SalesSummaryCard from '@/components/DashboardComponents/SalesSummaryCard'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows'>
      {/* <PopularProductsCard /> */}
      <SalesSummaryCard />
      <PurchaseSummaryCard />
      <ExpenseSummaryCard />
    </div>
  )
}

export default Dashboard