import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGetPurchasesQuery } from '@/app/state/api'

const RecentPurchasesCard = () => {
   const { data: purchases, isLoading, isError } = useGetPurchasesQuery()
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 5

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

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Recent Purchases</CardTitle>
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
                        <>
                           {group.purchases.map((purchase, index) => (
                              <TableRow key={purchase.purchaseId}>
                                 {index === 0 && (
                                    <TableCell 
                                       className="font-medium" 
                                       rowSpan={group.purchases.length}
                                    >
                                       {group.date}
                                    </TableCell>
                                 )}
                                 <TableCell>{purchase.productStock.product?.name}</TableCell>
                                 <TableCell>{purchase.productStock.size}</TableCell>
                                 <TableCell>{purchase.productStock.quantity}</TableCell>
                                 <TableCell>${purchase.productStock.price.toFixed(2)}</TableCell>
                                 <TableCell>
                                    ${(purchase.productStock.price * purchase.productStock.quantity).toFixed(2)}
                                 </TableCell>
                              </TableRow>
                           ))}
                           <TableRow className="border-t-2 bg-gray-100">
                              <TableCell colSpan={5} className="text-right font-semibold">
                                 Daily Total:
                              </TableCell>
                              <TableCell className="font-semibold">
                                 ${group.purchases.reduce((total, purchase) => 
                                    total + (purchase.productStock.price * purchase.productStock.quantity), 0).toFixed(2)}
                              </TableCell>
                           </TableRow>
                        </>
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