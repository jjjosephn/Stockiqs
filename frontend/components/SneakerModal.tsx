import React, { ChangeEvent, FormEvent, useState } from 'react'
import { v4 } from 'uuid'
import Header from './Header'

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

const labelStyles = 'block text-sm font-medium text-gray-700'
const inputStyles = 'block w-full mb-2 p-2 border-gray-500 border-2 rounded-md'

const SneakerModal = ({ isOpen, onClose, onCreate}: SneakerModalProps) => {
   const [formData, setFormData] = useState({
      productId: v4(),
      name: '',
      price: 0,
      stockQuantity: 0,
      rating: 0
   })

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
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
      <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20'>
         <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mb-5'>
               <Header name='Add Sneaker'/>
            </div>
            <form onSubmit={handleSubmit}>
               <label
                  htmlFor='name'
                  className={labelStyles}
               >
                  Name
               </label>
               <input 
                  type='text' 
                  name='name' 
                  placeholder='Name'
                  onChange={handleChange}
                  value={formData.name}
                  className={inputStyles}
                  required
               />

               <label
                  htmlFor='price'
                  className={labelStyles}
               >
                  Price
               </label>
               <input 
                  type='number' 
                  name='price' 
                  placeholder='Price'
                  onChange={handleChange}
                  value={formData.price}
                  className={inputStyles}
                  min={0}
                  required
               />

               <label
                  htmlFor='stockQuantity'
                  className={labelStyles}
               >
                  Stock Quantity
               </label>
               <input 
                  type='number' 
                  name='stockQuantity' 
                  placeholder='Stock Quantity'
                  onChange={handleChange}
                  value={formData.stockQuantity}
                  className={inputStyles}
                  min={0}
                  required
               />

               <label
                  htmlFor='rating'
                  className={labelStyles}
               >
                  Rating
               </label>
               <input 
                  type='number' 
                  name='rating' 
                  placeholder='Rating'
                  onChange={handleChange}
                  value={formData.rating}
                  className={inputStyles}
                  min={0}
                  required
               />

               <button 
                  type='submit' 
                  className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
               >
                  Add
               </button>
               <button 
                  type='button' 
                  className='ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700'
                  onClick={onClose}
               >
                  Cancel
               </button>
            </form>
         </div>
      </div>
   )
}

export default SneakerModal