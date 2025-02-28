import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetProductsArchiveQuery, useGetPurchasesQuery } from '@/app/state/api'
import { useAuth } from '@clerk/nextjs'

const RecentPurchasesCard = () => {
   const {userId} = useAuth()
   const { data: purchases, isLoading, isError } = useGetPurchasesQuery({userId: userId || ''})
   const { data: productsArchive } = useGetProductsArchiveQuery()
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 5


   const findProductInArchive = (productsArchiveId: string, stockId: string) => {
      const product = productsArchive?.find(p => p.productsArchiveId === productsArchiveId)
      if (product) {
         const stock = product.psArchive?.find(s => s.stockId === stockId)
         if (stock) {
            return {
               name: product.name,
               ...stock
            }
         }
      }
      return null
   }

   const groupedPurchases = useMemo(() => {
      if (!purchases) return []

      const grouped = purchases.reduce((acc, purchase) => {
         const date = new Date(purchase.timestamp).toLocaleDateString()
         if (!acc[date]) {
            acc[date] = []
         }
         acc[date].push(purchase)
         return acc
      }, {} as Record<string, typeof purchases>)

      return Object.entries(grouped).map(([date, purchases]) => ({
         date,
         purchases
      }))
   }, [purchases])

   const sortedPurchases = useMemo(() => {
      return [...groupedPurchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   }, [groupedPurchases])

   const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage)
   const currentPurchases = sortedPurchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

   const formatCurrency = (value: any) => {
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

   return (
      <Card className='shadow-lg'>
         <CardHeader className="border-b bg-white">
            <div className="flex items-center space-x-3">
               <CardTitle className="text-2xl font-bold text-gray-900">Recent Purchases</CardTitle>
            </div>
         </CardHeader>
         <CardContent>
         {isLoading ? (
            <div>Loading...</div>
         ) : isError ? (
            <div>Error fetching purchase data</div>
         ) : (
            <>
               <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {currentPurchases.map((group) => (
                        <React.Fragment key={group.date}>
                           {group.purchases.map((purchase, index) => {
                              let productData;
                              if (purchase.productStock) {
                                 productData = {
                                    name: purchase.productStock.product?.name,
                                    size: purchase.productStock.size,
                                    quantity: purchase.productStock.quantity,
                                    price: purchase.productStock.price
                                 }
                              } else if (purchase.psArchive?.productsArchiveId && purchase.psArchive?.stockId) {
                                 productData = findProductInArchive(purchase.psArchive.productsArchiveId, purchase.psArchive.stockId)
                              } else {
                                 productData = {
                                    name: purchase.psArchive?.product?.name,
                                    size: purchase.psArchive?.size,
                                    quantity: purchase.psArchive?.quantity,
                                    price: purchase.psArchive?.price
                                 }
                              }

                              return (
                                 <TableRow key={purchase.purchaseId}>
                                    {index === 0 && (
                                       <TableCell 
                                          className="font-medium" 
                                          rowSpan={group.purchases.length}
                                       >
                                          {group.date}
                                       </TableCell>
                                    )}
                                    <TableCell>{productData?.name || 'N/A'}</TableCell>
                                    <TableCell>{productData?.size || 'N/A'}</TableCell>
                                    <TableCell>{productData?.quantity || 'N/A'}</TableCell>
                                    <TableCell>{formatCurrency(productData?.price) || 'N/A'}</TableCell>
                                    <TableCell>
                                       {formatCurrency((productData?.price || 0) * (productData?.quantity || 0))}
                                    </TableCell>
                                 </TableRow>
                              )
                           })}
                           <TableRow className="border-t-2 bg-gray-100">
                              <TableCell colSpan={5} className="text-right font-semibold">
                                 Daily Total:
                              </TableCell>
                              <TableCell className="font-semibold">
                                 {formatCurrency(group.purchases.reduce((total, purchase) => {
                                    let productData;
                                    if (purchase.productStock) {
                                       productData = purchase.productStock
                                    } else if (purchase.psArchive?.productsArchiveId && purchase.psArchive?.stockId) {
                                       productData = findProductInArchive(purchase.psArchive.productsArchiveId, purchase.psArchive.stockId)
                                    } else {
                                       productData = purchase.psArchive
                                    }
                                    return total + ((productData?.price || 0) * (productData?.quantity || 0))
                                 }, 0))}
                              </TableCell>
                           </TableRow>
                        </React.Fragment>
                     ))}
                  </TableBody>
               </Table>
               </div>
               <div className="flex items-center justify-between mt-4">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                     disabled={currentPage === 1}
                  >
                     <ChevronLeft className="h-4 w-4 mr-2" />
                     Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                     Page {currentPage} of {totalPages}
                  </span>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                     disabled={currentPage === totalPages}
                  >
                     Next
                     <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
               </div>
            </>
         )}
         </CardContent>
      </Card>
   )
}

export default RecentPurchasesCard