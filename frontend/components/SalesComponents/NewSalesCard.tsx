import { FormEvent, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { v4 } from "uuid"
import { useNewSaleMutation } from "@/app/state/api"

type Customer = {
  userId: string
  name: string
}

type Product = {
  productId: string
  name: string
  stock: ProductStock[]
}

type ProductStock = {
  stockId: string
  productId: string
  size: number
  quantity: number
  price: number
}

type NewSalesCardProps = {
  customers: Customer[]
  products: Product[]
}

type SalesFormData = {
  saleId: string
  stockId: string
  userId: string
  quantity: number
  salesPrice: number
  timestamp: string
}

const NewSalesCard = ({ customers, products }: NewSalesCardProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedShoe, setSelectedShoe] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<ProductStock | null>(null)
  const [formData, setFormData] = useState<SalesFormData>({
    saleId: v4(),
    stockId: selectedSize?.stockId || '',
    userId: selectedCustomer?.userId || '',
    quantity: 0,
    salesPrice: 0,
    timestamp: new Date().toISOString(),
  })
  const [addNewSale] = useNewSaleMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  console.log(selectedSize)

  const handleCustomerSelect = (userId: string) => {
    setSelectedCustomer(customers.find((customer) => customer.userId === userId) || null)
  }

  const handleShoeSelect = (productId: string) => {
    setSelectedShoe(products.find((product) => product.productId === productId) || null)
    setSelectedSize(null)
  }

  const handleSizeSelect = (size: string) => {
    if (selectedShoe) {
      const sizeData = selectedShoe.stock.find((stock) => stock.size.toString() === size)
      setSelectedSize(sizeData || null)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (selectedSize && selectedCustomer && formData.quantity > 0) { 
      await addNewSale(formData)
      setFormData({
        saleId: v4(),
        stockId: selectedSize?.stockId || '',
        userId: selectedCustomer?.userId || '',
        quantity: 0,
        salesPrice: 0,
        timestamp: new Date().toISOString(),
      })
      setSelectedCustomer(null)
      setSelectedShoe(null)
      setSelectedSize(null)
    }

    
  }


  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: selectedCustomer?.userId || '',
      stockId: selectedSize?.stockId || '',
    }))
  }, [selectedCustomer, selectedSize])

  const getCustomerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="mb-8 mt-5">
      <CardHeader>
        <CardTitle>Add New Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select onValueChange={handleCustomerSelect} value={selectedCustomer?.userId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                {customers?.map((customer) => (
                  <SelectItem key={customer.userId} value={customer.userId}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleShoeSelect} value={selectedShoe?.productId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select Shoe" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.productId} value={product.productId}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleSizeSelect} value={selectedSize?.size.toString() || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {selectedShoe?.stock.map((stock) => (
                  <SelectItem key={stock.stockId} value={stock.size.toString()}>
                    {stock.size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-4">
              <Input 
                type="number" 
                name='quantity' 
                value={formData.quantity}
                min={0} max={selectedSize?.quantity} 
                placeholder="Quantity" 
                className="w-1/2" 
                onChange={handleChange}
                required 
              />
              <Input 
                type="number" 
                name='salesPrice' 
                value={formData.salesPrice}
                placeholder="Sale Price" 
                className="w-1/2" 
                onChange={handleChange}
                required
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">Add Sale</Button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg relative">
            {selectedCustomer && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                {getCustomerInitials(selectedCustomer.name)}
              </div>
            )}
            {selectedShoe ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image src="/placeholder.svg" alt={selectedShoe.name} width={80} height={80} className="rounded-md" />
                  <div>
                    <h3 className="font-bold text-lg">{selectedShoe.name}</h3>
                    <p className="text-sm text-gray-600">ID: {selectedShoe.productId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                     {selectedShoe && !selectedSize ? (
                        <>
                           <p>Total Price:</p> 
                           <p>${selectedShoe.stock.reduce((curr, shoe) => curr + (shoe.price * shoe.quantity), 0)}</p>
                        </>
                     ) : (
                        <>
                           <p>Price:</p>
                           <p>${selectedSize?.price}/pair</p>
                        </>
                     )}
                  </div>
                  <div>
                    <p className="font-semibold">Stock:</p>
                    <p>{selectedSize ? `${selectedSize.quantity} pairs` : "Select size"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Available Sizes:</p>
                    <p>{selectedShoe.stock.map((stock) => stock.size).join(", ")}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Total Stock:</p>
                    <p>{selectedShoe.stock.reduce((curr, shoe) => curr + shoe.quantity, 0)} pairs</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-[80px] h-[80px] rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewSalesCard
