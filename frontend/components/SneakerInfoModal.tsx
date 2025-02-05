import React from 'react'
import { X, Star, DollarSign, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
   productId: string;
   name: string;
   price: number;
   stockQuantity: number;
   rating: number;
}

type SneakerInfoModalProps = {
   isOpen: boolean,
   onClose: () => void,
   onDelete: () => void,
   product: Product
}

const SneakerInfoModal = ({ isOpen, onClose, onDelete, product }: SneakerInfoModalProps) => {
   if (!isOpen) return null

   const handleDeleteandClose = () => {
      onDelete()
      onClose()
   }

   return (
      <div className='fixed inset-0 bg-[#475569] bg-opacity-50 overflow-y-auto h-full w-full z-20 flex items-center justify-center'>
         <Card className='w-full max-w-md bg-white shadow-xl'>
            <CardHeader className='relative'>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className='absolute right-2 top-2'
                  onClick={onClose}
               >
                  <X className="h-4 w-4" />
               </Button>
               <CardTitle className='text-2xl font-bold text-[#475569]'>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
               <div className='aspect-square overflow-hidden rounded-md'>
                  image
               </div>
               <div className='grid grid-cols-2 gap-4 text-[#334155]'>
                  <div className='flex items-center'>
                     <DollarSign className='w-5 h-5 mr-2 text-[#0EA5E9]' />
                     <span className='font-semibold'>${product.price.toFixed(2)}</span>
                  </div>
                  <div className='flex items-center'>
                     <Package className='w-5 h-5 mr-2 text-[#0EA5E9]' />
                     <span>Stock: {product.stockQuantity}</span>
                  </div>
               </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
               <Button variant="outline" onClick={onClose}>Close</Button>
               <Button 
                  variant="destructive" 
                  onClick={handleDeleteandClose}
                  className='bg-red-500 hover:bg-red-600 text-white'
               >
                  Delete Sneaker
               </Button>
            </CardFooter>
         </Card>
      </div>
   )
}

export default SneakerInfoModal