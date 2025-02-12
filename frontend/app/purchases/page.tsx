'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { useGetSalesQuery } from "@/app/state/api"
import AddSneakerCard from '@/components/PurchasesComponents/AddSneakerCard'
import RecentPurchasesCard from '@/components/PurchasesComponents/RecentPurchasesCard'

const PurchasePage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { data: sales, isLoading, isError } = useGetSalesQuery()


  const sortedSales = sales ? [...sales].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : []
  const totalPages = Math.ceil(sortedSales.length / itemsPerPage)
  const currentSales = sortedSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Purchase Management</h1>
      
      <AddSneakerCard />
      <RecentPurchasesCard />
    </div>
  )
}

export default PurchasePage