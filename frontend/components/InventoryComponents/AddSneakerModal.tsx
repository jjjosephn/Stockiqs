// 'use client'

// import React, { ChangeEvent, FormEvent, useState } from 'react'
// import { v4 } from 'uuid'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { X, Plus, Minus } from 'lucide-react'

// type StockItem = {
//   stockId: string
//   price: number
//   size: number
//   quantity: number
// }

// type ProductFormData = {
//   productId: string
//   name: string
//   stock: StockItem[]
// }

// type SneakerModalProps = {
//   isOpen: boolean
//   onClose: () => void
//   onCreate: (formData: ProductFormData) => void
// }

// const AddSneakerModal = ({ isOpen, onClose, onCreate}: SneakerModalProps) => {
//   const [formData, setFormData] = useState<ProductFormData>({
//     productId: v4(),
//     name: '',
//     stock: [{ stockId: v4(), price: 0, size: 0, quantity: 0 }]
//   })

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     onCreate(formData)
//     setFormData({
//       productId: v4(),
//       name: '',
//       stock: [{ stockId: v4(), price: 0, size: 0, quantity: 0 }]
//     })
//     onClose()
//   }

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleStockChange = (index: number, field: keyof StockItem, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       stock: prev.stock.map((item, i) => 
//         i === index ? { ...item, [field]: field === 'size' ? parseFloat(value) : parseInt(value, 10) } : item
//       )
//     }))
//   }

//   const addStockItem = () => {
//     setFormData(prev => ({
//       ...prev,
//       stock: [...prev.stock, { stockId: v4(), price: 0, size: 0, quantity: 0 }]
//     }))
//   }

//   const removeStockItem = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       stock: prev.stock.filter((_, i) => i !== index)
//     }))
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-[#475569] bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <Card className="w-full max-w-md">
//         <CardHeader className="relative">
//           <CardTitle className="text-2xl font-bold text-gray-900">Add New Sneaker</CardTitle>
//           <Button 
//             variant="ghost" 
//             className="absolute right-4 top-4" 
//             onClick={onClose}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2 text-gray-900">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="Enter sneaker name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             {formData.stock.map((item, index) => (
//               <div key={item.stockId} className="space-y-2 p-4 border rounded-md">
//                 <div className="flex justify-between items-center">
//                   <Label>Stock Item {index + 1}</Label>
//                   {index > 0 && (
//                     <Button type="button" variant="ghost" onClick={() => removeStockItem(index)}>
//                       <Minus className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <Label htmlFor={`size-${index}`}>Size</Label>
//                     <Input
//                       id={`size-${index}`}
//                       type="number"
//                       step="0.5"
//                       value={item.size}
//                       onChange={(e) => handleStockChange(index, 'size', e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor={`price-${index}`}>Price</Label>
//                     <Input
//                       id={`price-${index}`}
//                       type="number"
//                       step="0.01"
//                       value={item.price}
//                       onChange={(e) => handleStockChange(index, 'price', e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor={`quantity-${index}`}>Quantity</Label>
//                   <Input
//                     id={`quantity-${index}`}
//                     type="number"
//                     value={item.quantity}
//                     onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//             ))}
//             <Button type="button" onClick={addStockItem} className="w-full">
//               <Plus className="h-4 w-4 mr-2" /> Add Stock Item
//             </Button>
//           </CardContent>
//           <CardFooter className="flex justify-end space-x-2">
//             <Button className='bg-gray-50 hover:bg-gray-200' variant="outline" onClick={onClose}>
//               <p className='text-gray-900'>Cancel</p>
//             </Button>
//             <Button className='bg-gray-900 hover:bg-gray-500' type="submit">
//               <p className='text-gray-50'>Add Sneaker</p>
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

// export default AddSneakerModal