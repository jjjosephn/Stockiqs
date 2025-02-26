'use client'

import React from 'react'
import AddSneakerCard from '@/components/PurchasesComponents/AddSneakerCard'
import RecentPurchasesCard from '@/components/PurchasesComponents/RecentPurchasesCard'

const PurchasePage = () => {

  return (
    <div className="container mx-auto p-4 space-y-8">      
      <AddSneakerCard />
      <RecentPurchasesCard />
    </div>
  )
}

export default PurchasePage