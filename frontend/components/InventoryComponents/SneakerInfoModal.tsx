"use client"

import React, { useState, useEffect, useCallback } from "react"
import { X, DollarSign, Package, Edit, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateProductMutation, useDeleteProductStockMutation, useGetProductsQuery, useGetPurchasesQuery, useGetSalesQuery, useUpdateProductMutation } from "@/app/state/api"
import { v4 } from "uuid"

type StockItem = {
productId: string
quantity: number
size: number
stockId: string
price: number
}

type Product = {
productId: string
name: string
stock: StockItem[]
}

type SneakerInfoModalProps = {
isOpen: boolean
onClose: () => void
onDelete: () => void
product: Product
}

const SneakerInfoModal = ({ isOpen, onClose, onDelete, product }: SneakerInfoModalProps) => {
const [selectedSize, setSelectedSize] = useState<string | null>(null)
const [isEditing, setIsEditing] = useState(false)
const [editedProduct, setEditedProduct] = useState<Product>(product)
const [updateProduct] = useUpdateProductMutation()
const [newStock, setNewStock] = useState<Partial<StockItem>>({ size: 0, quantity: 0, price: 0 })
const [deleteProductStock] = useDeleteProductStockMutation()
const { data: productsData, refetch: refetchProducts } = useGetProductsQuery()
const { data: salesData, refetch: refetchSales } = useGetSalesQuery()
const {refetch: refetchPurchases} = useGetPurchasesQuery()

const refreshData = useCallback(async () => {
   if (refetchProducts) {
      await refetchProducts()
   }
   if (refetchSales) {
      await refetchSales()
   }
}, [refetchProducts, refetchSales])

useEffect(() => {
   if (isOpen) {
      refreshData()
   }
}, [isOpen, refreshData])

useEffect(() => {
   if (productsData) {
      const updatedProduct = productsData.find(p => p.productId === product.productId)
      if (updatedProduct) {
      setEditedProduct(updatedProduct)
      }
   }
}, [productsData, product.productId])

if (!isOpen) return null

const handleDeleteandClose = () => {
   onDelete()
   onClose()
}

const handleSizeChange = (value: string) => {
   setSelectedSize(value)
}

const selectedStockItem = selectedSize
   ? editedProduct.stock.find((item) => item.size.toString() === selectedSize)
   : null

const handleDeleteSize = async () => {
   if (!selectedStockItem?.stockId || !editedProduct?.productId) {
      console.error("Missing productId or stockId.")
      return
   }

   try {
      await deleteProductStock({ 
      productId: editedProduct.productId, 
      stockId: selectedStockItem.stockId 
      })
      
      await refreshData()

      const updatedStock = editedProduct.stock.filter(item => item.stockId !== selectedStockItem.stockId)
      setEditedProduct(prev => ({
      ...prev,
      stock: updatedStock
      }))

      if (updatedStock.length > 0) {
      const sortedSizes = updatedStock.map(item => item.size).sort((a, b) => a - b)
      const nextSize = sortedSizes.find(size => size > selectedStockItem.size) || sortedSizes[0]
      setSelectedSize(nextSize.toString())
      } else {
      setSelectedSize(null)
      }
   } catch (error) {
      console.error("Error deleting stock item:", error)
   }
}

const handleEdit = () => {
   setIsEditing(true)
}

const handleSave = async () => {
   try {
      const { productId, name, stock } = editedProduct

      await updateProduct({
      productId,
      name,
      stock: stock.map(({ stockId, productId, size, quantity, price }) => ({
         stockId,
         productId,
         size,
         quantity,
         price,
      })),
      }).unwrap()

      await refetchPurchases()
      await refreshData()

      setIsEditing(false)
      setSelectedSize(null)
      onClose()
   } catch (error) {
      console.error("Failed to update product:", error)
   }
}

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target
   setEditedProduct((prev) => ({ ...prev, [name]: value }))
}

const handleStockItemChange = (stockId: string, field: keyof StockItem, value: string) => {
   setEditedProduct((prev) => ({
      ...prev,
      stock: prev.stock.map((item) =>
      item.stockId === stockId
         ? { ...item, [field]: field === "size" ? Number.parseFloat(value) : Number.parseInt(value, 10) }
         : item
      ),
   }))
}

const handleNewStockChange = (field: keyof StockItem, value: string) => {
   setNewStock((prev) => ({
      ...prev,
      [field]: field === "size" ? Number.parseFloat(value) : Number.parseInt(value, 10),
   }))
}

const handleAddNewStock = () => {
   if (newStock.size && newStock.quantity && newStock.price) {
      const newStockItem: StockItem = {
         productId: editedProduct.productId,
         stockId: v4(), 
         size: newStock.size,
         quantity: newStock.quantity,
         price: newStock.price,
      }
      setEditedProduct((prev) => ({
      ...prev,
      stock: [...prev.stock, newStockItem],
      }))

      setNewStock({ size: 0, quantity: 0, price: 0 })
   }
}

return (
   <div className="fixed inset-0 bg-[#475569] bg-opacity-50 overflow-y-auto h-full w-full z-20 flex items-center justify-center">
      <Card className={`bg-white shadow-xl ${isEditing ? "w-full max-w-xl" : "w-full max-w-md"}`}>
      <CardHeader className="relative">
         <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => {
            onClose()
            setSelectedSize(null)
            setIsEditing(false)
            }}
         >
            <X className="h-4 w-4" />
         </Button>
         {isEditing ? (
            <Input
            name="name"
            value={editedProduct.name}
            onChange={handleInputChange}
            className="text-2xl font-bold text-[#475569]"
            />
         ) : (
            <CardTitle className="text-2xl font-bold text-[#475569]">{editedProduct.name}</CardTitle>
         )}
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="aspect-square overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Image Placeholder</span>
         </div>
         <div className="grid grid-cols-2 gap-4 text-[#334155]">
            <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[#0EA5E9]" />
            {isEditing && selectedStockItem ? (
               <Input
                  type="number"
                  value={selectedStockItem.price}
                  onChange={(e) => handleStockItemChange(selectedStockItem.stockId, "price", e.target.value)}
                  className="w-24"
               />
            ) : (
               <span className="font-semibold">
                  {selectedStockItem
                  ? `$${selectedStockItem.price.toFixed(2)}/pair`
                  : `$${(editedProduct.stock.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}`}
               </span>
            )}
            </div>
            <div className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-[#0EA5E9]" />
            {isEditing && selectedStockItem ? (
               <Input
                  type="number"
                  value={selectedStockItem.quantity}
                  onChange={(e) => handleStockItemChange(selectedStockItem.stockId, "quantity", e.target.value)}
                  className="w-24"
               />
            ) : (
               <span>
                  {selectedStockItem
                  ? `Stock: ${selectedStockItem.quantity}`
                  : `Total Stock: ${editedProduct.stock.reduce((total, item) => total + item.quantity, 0)}`}
               </span>
            )}
            </div>
         </div>
         <div className="space-y-2">
            <label htmlFor="size-select" className="block text-sm font-medium text-[#475569]">
            Select Size
            </label>
            <div className="flex items-center space-x-2">
            <Select onValueChange={handleSizeChange} value={selectedSize || undefined}>
               <SelectTrigger id="size-select">
                  <SelectValue placeholder="Choose a size" />
               </SelectTrigger>
               <SelectContent>
                  {editedProduct.stock.map((item) => (
                  <SelectItem key={item.stockId} value={item.size.toString()}>
                     {item.size}
                  </SelectItem>
                  ))}
               </SelectContent>
            </Select>
            {isEditing && selectedSize && (
               <Button variant="destructive" size="sm" onClick={handleDeleteSize}>
                  Delete Size
               </Button>
            )}
            </div>
         </div>
         {isEditing && (
            <div className="space-y-2">
            <h3 className="text-md font-semibold">Add New Stock</h3>
            <div className="flex items-center space-x-2">
               <Input
                  type="number"
                  placeholder="Size"
                  value={newStock.size || ""}
                  onChange={(e) => handleNewStockChange("size", e.target.value)}
                  className="w-20"
               />
               <Input
                  type="number"
                  placeholder="Qty"
                  value={newStock.quantity || ""}
                  onChange={(e) => handleNewStockChange("quantity", e.target.value)}
                  className="w-20"
               />
               <Input
                  type="number"
                  placeholder="Price"
                  value={newStock.price || ""}
                  onChange={(e) => handleNewStockChange("price", e.target.value)}
                  className="w-24"
               />
               <Button size="sm" onClick={handleAddNewStock}>
                  <Plus className="h-4 w-4" /> Add Stock
               </Button>
            </div>
            </div>
         )}
      </CardContent>
      <CardFooter className="flex justify-between">
         <Button
            variant="outline"
            onClick={() => {
            setSelectedSize(null)
            setIsEditing(false)
            onClose()
            }}
         >
            Close
         </Button>
         <div className="space-x-2">
            {isEditing ? (
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
               Save Changes
            </Button>
            ) : (
            <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
               <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            )}
            <Button
            variant="destructive"
            onClick={handleDeleteandClose}
            className="bg-red-500 hover:bg-red-600 text-white"
            >
            Delete Sneaker
            </Button>
         </div>
      </CardFooter>
      </Card>
   </div>
)
}

export default SneakerInfoModal