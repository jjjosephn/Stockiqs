'use client'

import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetProductsArchiveQuery, useGetSalesQuery } from "@/app/state/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"

type Customer = {
  userId: string
  name: string
}

type PSArchive = {
  archiveId: string
  stockId: string
  productId: string
  size: number
  quantity: number
  price: number
  timestamp: string
}

type Product = {
  productId: string
  name: string
  stock: ProductStock[]
  psArchive: PSArchive[]
}

type ProductStock = {
  stockId: string
  productId: string
  size: number
  quantity: number
  price: number
}

type RecentSalesCardProps = {
  customers: Customer[]
  products: Product[]
}

const RecentSalesCard = ({ customers, products }: RecentSalesCardProps) => {
  const { data: sales, isLoading: salesLoading } = useGetSalesQuery()
  const { data: productsArchive, isLoading: archiveLoading } = useGetProductsArchiveQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const isLoading = salesLoading || archiveLoading || !sales || !productsArchive

  const sortedSales = useMemo(() => {
    if (!sales || !productsArchive) return []
    return [...sales].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [sales, productsArchive])

  const getProductInfo = (sale: any) => {
    if (sale.stockId) {
      const stock = products
        .flatMap((product) => product.stock)
        .find((productStock) => productStock.stockId === sale.stockId)
      const product = products.find((p) => p.productId === stock?.productId)
      
      if (stock && product) {
        return {
          stock,
          product: { name: product.name, productId: product.productId }
        }
      }
    }

    if (sale.archiveId) {
      const stock = products
        .flatMap((product) => product.psArchive)
        .find((productStock) => productStock.archiveId === sale.archiveId)
      const product = products.find((p) => p.productId === stock?.productId)

      if (stock && product) {
        return {
          stock,
          product: { name: product.name, productId: product.productId }
        }
      }
    }

    if (sale.productsArchiveId && productsArchive) {
      const archivedProduct = productsArchive.find(
        (pa) => pa.productsArchiveId === sale.productsArchiveId
      )
      
      if (archivedProduct && archivedProduct.psArchive) {
        const archivedStock = sale.archiveId 
          ? archivedProduct.psArchive.find(ps => ps.archiveId === sale.archiveId)
          : archivedProduct.psArchive[0] 

        return {
          stock: archivedStock,
          product: { name: archivedProduct.name, productId: archivedProduct.productId }
        }
      }
    }

    return { stock: null, product: null }
  }

  const summaryStats = useMemo(() => {
    if (!sortedSales.length || !productsArchive) {
      return { 
        totalSales: 0, 
        totalRevenue: 0, 
        totalProfit: 0, 
        avgProfitMargin: 0 
      }
    }

    let totalSales = 0
    let totalRevenue = 0
    let totalProfit = 0

    sortedSales.forEach((sale: any) => {
      const { stock } = getProductInfo(sale)
      const purchasePrice = stock?.price || 0
      const soldPrice = sale.salesPrice
      const quantity = sale.quantity

      totalSales += quantity
      totalRevenue += soldPrice * quantity
      totalProfit += (soldPrice - purchasePrice) * quantity
    })

    const avgProfitMargin = (totalProfit / totalRevenue) * 100

    return {
      totalSales,
      totalRevenue,
      totalProfit,
      avgProfitMargin
    }
  }, [sortedSales, products, productsArchive])

  if (isLoading) return <div>Loading...</div>

  const totalPages = Math.ceil(sortedSales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSales = sortedSales.slice(startIndex, endIndex)

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Recent Sales</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Total Sales</p>
            <p className="text-2xl font-bold text-blue-800">{summaryStats.totalSales}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-800">${summaryStats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Total Profit</p>
            <p className="text-2xl font-bold text-purple-800">${summaryStats.totalProfit.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-yellow-600">Average Profit Margin</p>
            <p className="text-2xl font-bold text-yellow-800">{summaryStats.avgProfitMargin.toFixed(2)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-600">Date</TableHead>
              <TableHead className="font-semibold text-gray-600">Customer</TableHead>
              <TableHead className="font-semibold text-gray-600">Shoe</TableHead>
              <TableHead className="font-semibold text-gray-600">Size</TableHead>
              <TableHead className="font-semibold text-gray-600">Quantity</TableHead>
              <TableHead className="font-semibold text-gray-600">Purchase Price/Pair</TableHead>
              <TableHead className="font-semibold text-gray-600">Total Purchase Price</TableHead>
              <TableHead className="font-semibold text-gray-600">Sold Price/Pair</TableHead>
              <TableHead className="font-semibold text-gray-600">Total Sales Price</TableHead>
              <TableHead className="font-semibold text-gray-600">Profit</TableHead>
              <TableHead className="font-semibold text-gray-600">Profit Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSales.map((sale: any) => {
              const customer = customers.find((c) => c.userId === sale.userId)
              const { stock, product } = getProductInfo(sale)
              const purchasePrice = stock?.price || 0
              const soldPrice = sale.salesPrice
              const profit = (soldPrice - purchasePrice) * sale.quantity
              const profitMargin = ((profit / (sale.quantity * soldPrice)) * 100).toFixed(2)

              return (
                <TableRow key={sale.saleId}>
                  <TableCell className="font-medium">{new Date(sale.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/customers/${customer?.userId}`}>
                      {customer?.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/placeholder.svg?height=50&width=50`}
                        alt={product?.name || "Shoe"}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                      <span className="font-medium">{product?.name || "Unknown Shoe"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{stock?.size}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(purchasePrice)}</TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(sale.quantity * purchasePrice)}</TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(soldPrice)}</TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(sale.quantity * soldPrice)}</TableCell>
                  <TableCell className={cn(
                    "font-semibold",
                    profit > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(profit)}
                  </TableCell>
                  <TableCell className={cn(
                    "font-semibold",
                    parseFloat(profitMargin) > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {profitMargin}%
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4 bg-white border-t">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedSales.length)} of {sortedSales.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentSalesCard