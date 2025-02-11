'use client'

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetSalesQuery } from "@/app/state/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const { data: sales, isLoading, isError } = useGetSalesQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching sales</div>

  const sortedSales = sales ? [...sales].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : []

  const totalPages = Math.ceil(sortedSales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSales = sortedSales.slice(startIndex, endIndex)

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Recent Sales</CardTitle>
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
              <TableHead className="font-semibold text-gray-600">Purchase Price</TableHead>
              <TableHead className="font-semibold text-gray-600">Sold Price</TableHead>
              <TableHead className="font-semibold text-gray-600">Profit</TableHead>
              <TableHead className="font-semibold text-gray-600">Profit Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSales.map((sale: any, index: number) => {
              const customer = customers.find((c) => c.userId === sale.userId)
              const stock = products
              .flatMap((product) => product.stock)
              .find((productStock) => productStock.stockId === sale.stockId) || 
              products
                .flatMap((product) => product.psArchive)
                .find((productStock) => productStock.archiveId === sale.archiveId)
              const product = products.find((p) => p.productId === stock?.productId)
              const purchasePrice = stock?.price || 0
              const soldPrice = sale.salesPrice
              const profit = (soldPrice - purchasePrice) * sale.quantity
              const profitMargin = ((profit / (soldPrice * sale.quantity)) * 100).toFixed(2)

              return (
                <TableRow 
                  key={sale.saleId}
                >
                  <TableCell className="font-medium">{new Date(sale.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{customer?.name}</TableCell>
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
                  <TableCell className="text-gray-600">${purchasePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-600">${soldPrice.toFixed(2)}</TableCell>
                  <TableCell className={cn(
                    "font-semibold",
                    profit > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    ${profit.toFixed(2)}
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