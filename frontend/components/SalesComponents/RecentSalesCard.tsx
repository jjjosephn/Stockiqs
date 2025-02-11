import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const recentSales = [
   {
     id: "1",
     date: "2023-06-01",
     customerId: "1",
     shoeId: "1",
     size: 9,
     quantity: 1,
     purchasePrice: 120,
     soldPrice: 200,
   },
   {
     id: "2",
     date: "2023-06-02",
     customerId: "2",
     shoeId: "2",
     size: 8,
     quantity: 2,
     purchasePrice: 220,
     soldPrice: 350,
   },
 ]

const RecentSalesCard = () => {
   return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Shoe</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Sold Price</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => {
                // const shoe = shoes.find((s) => s.id === sale.shoeId)
                // const customer = customers.find((c) => c.id === sale.customerId)
                const profit = (sale.soldPrice - sale.purchasePrice) * sale.quantity
                const profitMargin = ((profit / (sale.soldPrice * sale.quantity)) * 100).toFixed(2)

                return (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.date}</TableCell>
                    {/* <TableCell>{customer?.name}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* <Image
                          src={shoe?.image || "/placeholder.svg"}
                          alt={shoe?.name || ""}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        {shoe?.name} */}
                      </div>
                    </TableCell>
                    <TableCell>{sale.size}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.purchasePrice}</TableCell>
                    <TableCell>${sale.soldPrice}</TableCell>
                    <TableCell>${profit}</TableCell>
                    <TableCell>{profitMargin}%</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>  
   )
}

export default RecentSalesCard