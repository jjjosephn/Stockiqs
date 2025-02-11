"use client"

import Header from "@/components/Header"
import NewSalesCard from "@/components/SalesComponents/NewSalesCard"
import {useGetCustomersQuery, useGetProductsQuery } from "../state/api"
import RecentSalesCard from "@/components/SalesComponents/RecentSalesCard"

export default function SalesPage() {
  const {data: customers, isLoading, isError} = useGetCustomersQuery()
  const {data: products, refetch} = useGetProductsQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching customers</div>
  return (
    <div className="container mx-auto p-4">
      <Header name='Sales Management' />

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

