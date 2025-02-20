'use client'

import React from 'react'
import AddSneakerCard from '@/components/PurchasesComponents/AddSneakerCard'
import RecentPurchasesCard from '@/components/PurchasesComponents/RecentPurchasesCard'

const PurchasePage = () => {
  const itemsPerPage = 5

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Purchase Management</h1>
      
      <AddSneakerCard />
      <RecentPurchasesCard />
    </div>
  )
}

export default PurchasePage