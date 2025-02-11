"use client"

import Header from "@/components/Header"
import NewSalesCard from "@/components/SalesComponents/NewSalesCard"
import {useGetCustomersQuery, useGetProductsQuery } from "../state/api"
import RecentSalesCard from "@/components/SalesComponents/RecentSalesCard"

export default function SalesPage() {
  const {data: customers, isLoading, isError} = useGetCustomersQuery()
  const {data: products} = useGetProductsQuery()

  return (
    <div className="container mx-auto p-4">
      <Header name='Sales Management' />

      <NewSalesCard 
        customers={customers || []} 
        products={products || []} 
      />

      <RecentSalesCard />
    </div>
  )
}

