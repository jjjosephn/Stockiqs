"use client"

import Header from "@/components/Header"
import NewSalesCard from "@/components/SalesComponents/NewSalesCard"
import {useGetCustomersQuery, useGetProductsQuery } from "../state/api"
import RecentSalesCard from "@/components/SalesComponents/RecentSalesCard"
import { useAuth } from "@clerk/nextjs"

export default function SalesPage() {
  const {userId} = useAuth()
  const {data: customers, isLoading, isError} = useGetCustomersQuery({userId: userId || ''})
  const {data: products} = useGetProductsQuery({userId: userId || ''})

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching customers</div>
  return (
    <div className="container mx-auto p-4">
      <NewSalesCard 
        customers={customers || []} 
        products={products || []} 
      />

      <RecentSalesCard 
        customers={customers || []} 
        products={products || []} 
      />
    </div>
  )
}

