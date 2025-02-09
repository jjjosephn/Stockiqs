"use client"

import type React from "react"
import { useState } from "react"
import { X, DollarSign, Package, Edit, Plus } from "lucide-react"
import { v4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateProductMutation, useUpdateProductStockMutation } from "@/app/state/api"

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
const [updateStock] = useUpdateProductStockMutation()

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

      setIsEditing(false)
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
         : item,
      ),
   }))
}
console.log(newStock)

const handleNewStockChange = (field: keyof StockItem, value: string) => {
   setNewStock((prev) => ({
      ...prev,
      [field]: field === "size" ? Number.parseFloat(value) : Number.parseInt(value, 10),
   }))
}

const handleAddNewStock = async () => {
   if (newStock.size && newStock.quantity && newStock.price) {
      const newStockItem: StockItem = {
      productId: editedProduct.productId,
      stockId: v4(),
      size: newStock.size,
      quantity: newStock.quantity,
      price: newStock.price,
      }

      const res = await updateStock({
         productId: editedProduct.productId,
         stock: newStockItem
      }).unwrap()

      if (res) {
      setEditedProduct((prev) => ({
         ...prev,
         stock: [...prev.stock, newStockItem],
      }))
      setNewStock({ size: 0, quantity: 0, price: 0 })
      }
   }
}



return (
   <div className="fixed inset-0 bg-[#475569] bg-opacity-50 overflow-y-auto h-full w-full z-20 flex items-center justify-center">
      <Card className={`bg-white shadow-xl ${isEditing ? "w-full max-w-2xl" : "w-full max-w-md"}`}>
      <CardHeader className="relative">
         <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => {
            onClose()
            setSelectedSize(null)
            setIsEditing(false)
            setNewStock({ size: 0, quantity: 0, price: 0 })
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
         </div>
         {isEditing && (
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Stock</h3>
            <div className="grid grid-cols-3 gap-4">
               <Input
                  type="number"
                  placeholder="Size"
                  value={newStock.size || ""}
                  onChange={(e) => handleNewStockChange("size", e.target.value)}
               />
               <Input
                  type="number"
                  placeholder="Quantity"
                  value={newStock.quantity || ""}
                  onChange={(e) => handleNewStockChange("quantity", e.target.value)}
               />
               <Input
                  type="number"
                  placeholder="Price"
                  value={newStock.price || ""}
                  onChange={(e) => handleNewStockChange("price", e.target.value)}
               />
            </div>
            <Button onClick={handleAddNewStock} className="w-full">
               <Plus className="mr-2 h-4 w-4" /> Add New Stock
            </Button>
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
            setNewStock({ size: 0, quantity: 0, price: 0 })
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

