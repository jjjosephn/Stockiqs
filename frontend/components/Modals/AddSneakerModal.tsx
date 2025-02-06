import React, { ChangeEvent, FormEvent, useState } from 'react'
import { v4 } from 'uuid'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

type ProductFormData = {
   name: string,
   price: number,
   stockQuantity: number,
   rating: number
}

type SneakerModalProps = {
   isOpen: boolean,
   onClose: () => void,
   onCreate: (formData: ProductFormData) => void
}

const AddSneakerModal = ({ isOpen, onClose, onCreate}: SneakerModalProps) => {
   const [formData, setFormData] = useState({
      productId: v4(),
      name: '',
      price: 0,
      stockQuantity: 0,
      rating: 0
   })

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setFormData({
         productId: v4(),
         name: '',
         price: 0,
         stockQuantity: 0,
         rating: 0
      })
      onCreate(formData)
      onClose()
   }

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData({
         ...formData,
         [name]:
            name === 'price' || name === 'stockQuantity' || name === 'rating'
            ? parseFloat(value)
            : value
      })
   }

   if (!isOpen) return null

   return (
      <div className="fixed inset-0 bg-[#475569] bg-opacity-50 flex items-center justify-center p-4 z-50">
         <Card className="w-full max-w-md">
            <CardHeader className="relative">
               <CardTitle className="text-2xl font-bold">Add New Sneaker</CardTitle>
               <Button 
                  variant="ghost" 
                  className="absolute right-4 top-4" 
                  onClick={onClose}
               >
                  <X className="h-4 w-4" />
               </Button>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="name">Name</Label>
                     <Input
                        id="name"
                        name="name"
                        placeholder="Enter sneaker name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="price">Price</Label>
                     <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleChange}
                        min={0}
                        step={0.01}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="stockQuantity">Stock Quantity</Label>
                     <Input
                        id="stockQuantity"
                        name="stockQuantity"
                        type="number"
                        placeholder="Enter stock quantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        min={0}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="rating">Rating</Label>
                     <Input
                        id="rating"
                        name="rating"
                        type="number"
                        placeholder="Enter rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min={0}
                        max={5}
                        step={0.1}
                        required
                     />
                  </div>
               </CardContent>
               <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={onClose}>
                     Cancel
                  </Button>
                  <Button type="submit">
                     Add Sneaker
                  </Button>
               </CardFooter>
            </form>
         </Card>
      </div>
   )
}

export default AddSneakerModal