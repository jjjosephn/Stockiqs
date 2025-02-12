"use client"

import { type FormEvent, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { v4 } from "uuid"
import {
  useNewSaleMutation,
  useUpdateProductStockAfterSaleMutation,
  useDeleteProductStockAfterSaleMutation,
  useGetProductsQuery,
  useGetSalesQuery,
} from "@/app/state/api"
import { Label } from "@/components/ui/label"

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

type NewSalesCardProps = {
  customers: Customer[]
  products: Product[]
}

type SalesFormData = {
  saleId: string
  archiveId: string
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
    archiveId: '',
    stockId: selectedSize?.stockId || "",
    userId: selectedCustomer?.userId || "",
    quantity: 0,
    salesPrice: 0,
    timestamp: new Date().toISOString(),
  })
  const [addNewSale] = useNewSaleMutation()
  const [updateStock] = useUpdateProductStockAfterSaleMutation()
  const [deleteStock] = useDeleteProductStockAfterSaleMutation()
  const {refetch} = useGetSalesQuery()

  const handleCustomerSelect = (userId: string) => {
    const customer = customers.find((customer) => customer.userId === userId) || null
    setSelectedCustomer(customer)
    setFormData((prev) => ({ ...prev, userId: customer?.userId || "" }))
  }

  const handleShoeSelect = (productId: string) => {
    const shoe = products.find((product) => product.productId === productId) || null
    setSelectedShoe(shoe)
    setSelectedSize(null)
    setFormData((prev) => ({ ...prev, stockId: "" }))
  }

  const handleSizeSelect = (size: string) => {
    if (selectedShoe) {
      const sizeData = selectedShoe.stock.find((stock) => stock.size.toString() === size) || null
      setSelectedSize(sizeData)
      setFormData((prev) => ({ ...prev, stockId: sizeData?.stockId || "" }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedSize || !selectedCustomer || formData.quantity <= 0) return

    await addNewSale(formData)

    if (selectedSize.quantity === formData.quantity) {
      await deleteStock({ stockId: selectedSize.stockId })
      await refetch()
    } else {
      await updateStock({
        stockId: selectedSize.stockId,
        quantity: selectedSize.quantity - formData.quantity,
      })
    }

    setFormData({
      saleId: v4(),
      archiveId: '',
      stockId: "",
      userId: "",
      quantity: 0,
      salesPrice: 0,
      timestamp: new Date().toISOString(),
    })

    setSelectedCustomer(null)
    setSelectedShoe(null)
    setSelectedSize(null)
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: selectedCustomer?.userId || "",
      stockId: selectedSize?.stockId || "",
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
      <CardTitle className="text-2xl font-bold text-gray-800">Add New Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-select" className={selectedCustomer ? "text-sm text-gray-500" : "sr-only"}>
                Select Customer
              </Label>
              <Select onValueChange={handleCustomerSelect} value={selectedCustomer?.userId || ""}>
                <SelectTrigger id="customer-select">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="shoe-select" className={selectedShoe ? "text-sm text-gray-500" : "sr-only"}>
                Select Shoe
              </Label>
              <Select onValueChange={handleShoeSelect} value={selectedShoe?.productId || ""}>
                <SelectTrigger id="shoe-select">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="size-select" className={selectedSize ? "text-sm text-gray-500" : "sr-only"}>
                Select Size
              </Label>
              <Select onValueChange={handleSizeSelect} value={selectedSize?.size.toString() || ""}>
                <SelectTrigger id="size-select">
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
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 space-y-2">
                <Label htmlFor="quantity-input" className={formData.quantity > 0 ? "text-sm text-gray-500" : "sr-only"}>
                  Quantity
                </Label>
                <Input
                  id="quantity-input"
                  type="number"
                  name="quantity"
                  value={formData.quantity || ""}
                  min={0}
                  max={selectedSize?.quantity}
                  placeholder="Quantity"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2 space-y-2">
                <Label htmlFor="price-input" className={formData.salesPrice > 0 ? "text-sm text-gray-500" : "sr-only"}>
                  Sale Price/pair
                </Label>
                <Input
                  id="price-input"
                  type="number"
                  name="salesPrice"
                  value={formData.salesPrice || ""}
                  placeholder="Sale Price/pair"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Add Sale
            </Button>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg relative">
            {selectedCustomer && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                {getCustomerInitials(selectedCustomer.name)}
              </div>
            )}
            {selectedShoe ? (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Image
                    src="/placeholder.svg"
                    alt={selectedShoe.name}
                    width={100}
                    height={100}
                    className="rounded-lg shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-xl mb-1">{selectedShoe.name}</h3>
                    <p className="text-sm text-gray-600">ID: {selectedShoe.productId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-600">
                      {selectedSize ? "Purchase Price:" : "Total Stock Price:"}
                    </p>
                    <p className="text-lg">
                      {selectedSize
                        ? `$${selectedSize.price.toFixed(2)}/pair`
                        : `$${selectedShoe.stock.reduce((curr, shoe) => curr + shoe.price * shoe.quantity, 0).toFixed(2)}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Stock:</p>
                    <p className="text-lg">
                      {selectedSize
                        ? `${selectedSize.quantity} pairs`
                        : `${selectedShoe.stock.reduce((curr, shoe) => curr + shoe.quantity, 0)} total`}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-gray-600 mb-2">Available Sizes:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedShoe.stock.map((stock) => (
                      <span key={stock.stockId} className="px-2 py-1 bg-gray-200 rounded-md text-sm">
                        {stock.size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-[100px] h-[100px] rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NewSalesCard

