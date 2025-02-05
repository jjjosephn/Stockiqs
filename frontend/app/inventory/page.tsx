'use client'

import React, { useState } from 'react'
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../state/api'
import Header from '@/components/Header'
import { PlusCircle, Search } from 'lucide-react'
import AddSneakerModal from '@/components/AddSneakerModal'
import SneakerInfoModal from '@/components/SneakerInfoModal'

type ProductFormData = {
   name: string,
   price: number,
   stockQuantity: number,
   rating: number
}

const Inventory = () => {
   const [search, setSearch] = useState('')
   const [addSneakerModalOpen, setAddSneakerModalOpen] = useState(false)
   const [sneakerInfoModalOpen, setSneakerInfoModalOpen] = useState(false)
   const { data, isError, isLoading } = useGetProductsQuery(search)
   const [ addSneaker ] = useCreateProductMutation()
   const [ deleteSneaker ] = useDeleteProductMutation()
   const [selectedProduct, setSelectedProduct] = useState<any>(null)


   const handleAddSneaker = async (data: ProductFormData) => {
      await addSneaker(data)
   }

   const handleDeleteSneaker = async (productId: string) => {
      await deleteSneaker(productId)
   }

   if (isLoading) {
      return <div className='text-center py-4'>Loading...</div>
   }
   if (isError || !data) {
      return <div className='text-center text-red-500 py-4'>Error fetching products</div>
   }

   return (
      <>
         <div className='flex justify-between items-center mb-6'>
            <Header name='Inventory'/>
         </div>
         <div className='mx-auto pb-5 w-full'>
            <div className='mb-6'>
               <div className='flex items-center border-2 border-gray-200 rounded'>
                  <Search className='m-2 w-5 h-5 text-gray-500'/>
                  <input 
                     className='w-full py-2 px-4 rounded bg-white' 
                     placeholder='Search sneaker...'
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>
            <div className='mb-6'>
               <button className='flex items-center bg-blue-500 hover:bg-blue-700 
                  text-white font-bold py-2 px-4 rounded'
                  onClick={() => setAddSneakerModalOpen(true)}
               >
                  <PlusCircle className='w-5 h-5 mr-2 !text-white'/>
                  Add Sneaker
               </button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 justify-between'>
               {isLoading ? (
                  <div className='m-5'>Loading...</div>
               ) : (
                  data.map((product) => (
                     <div 
                        key={product.productId} 
                        className='border shadow rounded-md p-4 max-w-full w-full mx-auto hover:bg-gray-300'
                        onClick={() => {
                           setSneakerInfoModalOpen(true)
                           setSelectedProduct(product)
                           console.log(selectedProduct)
                        }}
                     >
                        <div className='flex flex-col items-center'>
                           image
                           <h3 className='text-lg text-gray-900 font-semibold text-center'>
                              {product.name}
                           </h3>
                           <p className='text-gray-800'>${product.price}</p>
                           <div className='text-sm text-gray-600 mt-1'>
                              Stock: {product.stockQuantity} 
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>
            
            <AddSneakerModal 
               isOpen={addSneakerModalOpen} 
               onClose={() => setAddSneakerModalOpen(false)}
               onCreate={handleAddSneaker}
            />

            {selectedProduct && (
               <SneakerInfoModal
                  isOpen={sneakerInfoModalOpen} 
                  onClose={() => setSneakerInfoModalOpen(false)}
                  onDelete={() => handleDeleteSneaker(selectedProduct.productId)}
                  product={selectedProduct} 
               />
            )}
         </div>
      </>
   )
}

export default Inventory