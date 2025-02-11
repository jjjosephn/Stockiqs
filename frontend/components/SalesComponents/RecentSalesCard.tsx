import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetSalesQuery } from "@/app/state/api"

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

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching sales</div>

  console.log(products)
  
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
            {sales?.map((sale: any) => {
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
                <TableRow key={sale.saleId}>
                  <TableCell>{new Date(sale.timestamp).toLocaleDateString()}</TableCell>
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
                      {product?.name || "Unknown Shoe"}
                    </div>
                  </TableCell>
                  <TableCell>{stock?.size}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>${purchasePrice.toFixed(2)}</TableCell>
                  <TableCell>${soldPrice.toFixed(2)}</TableCell>
                  <TableCell>${profit.toFixed(2)}</TableCell>
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

