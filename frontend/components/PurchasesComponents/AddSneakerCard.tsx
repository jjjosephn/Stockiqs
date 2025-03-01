import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useCreateProductMutation, useGetPurchasesQuery } from "@/app/state/api"
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'

type StockItem = {
   stockId: string
   price: number
   size: number
   quantity: number
}

type ProductFormData = {
   productId: string
   userId: string
   name: string
   image: string
   stock: StockItem[]
}

type SneakerSuggestion = {
   title: string
   image: string
}

interface SneakerApiResponse {
  status: string;
  data?: Array<{
    title: string;
    image: string;
  }>;
}

const AddSneakerCard = () => {
   const {userId} = useAuth()
   const [addSneaker] = useCreateProductMutation()
   const {refetch} = useGetPurchasesQuery({userId: userId || ''})
   const [formData, setFormData] = useState<ProductFormData>({
      productId: uuidv4(),
      userId: userId || '',
      name: '',
      image: '',
      stock: [{ stockId: uuidv4(), price: 0, size: 0, quantity: 0 }]
   })
   const [suggestions, setSuggestions] = useState<SneakerSuggestion[]>([])
   const [showSuggestions, setShowSuggestions] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const suggestionRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (formData.name.length > 2) {
         fetchSuggestions(formData.name)
      } else {
         setSuggestions([])
         setShowSuggestions(false)
      }
   }, [formData.name])

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
            setShowSuggestions(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
         document.removeEventListener('mousedown', handleClickOutside)
      }
   }, [])

   const fetchSuggestions = async (query: string) => {
      const encodedQuery = query.replace(/ /g, '%20')
      const options = {
        method: 'GET',
        headers: { Authorization: process.env.NEXT_PUBLIC_SNEAKERS_API_KEY ?? '' }
      }
    
      try {
        const response = await fetch(`https://api.sneakersapi.dev/api/v3/stockx/products?query=${encodedQuery}`, options)
        const responseData: SneakerApiResponse = await response.json()
    
        if (responseData.status === 'success' && Array.isArray(responseData.data)) {
          setSuggestions(responseData.data.map((item) => ({ 
            title: item.title,
            image: item.image
          })))
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err)
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

   const handleAddSneaker = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      
      try {
        await addSneaker(formData)
        await refetch()
        
        setFormData({
          productId: uuidv4(),
          userId: userId || '',
          name: '',
          image: '',
          stock: [{ stockId: uuidv4(), price: 0, size: 0, quantity: 0 }]
        })
      } catch (error) {
        console.error("Error adding sneaker:", error)
      } finally {
        setIsSubmitting(false)
      }
   }
   
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
         ...prev,
         [name]: value
      }))
   }
   
   const handleStockChange = (index: number, field: keyof StockItem, value: string) => {
      const parsedValue = field === 'size' || field === 'price'
         ? parseFloat(value)
         : parseInt(value, 10);
   
      if (!isNaN(parsedValue)) {
         setFormData(prev => ({
            ...prev,
            stock: prev.stock.map((item, i) =>
               i === index ? { ...item, [field]: parsedValue } : item
            )
         }))
      }
   }
   
   const addStockItem = () => {
      setFormData(prev => ({
         ...prev,
         stock: [...prev.stock, { stockId: uuidv4(), price: 0, size: 0, quantity: 0 }]
      }))
   }
   
   const removeStockItem = (index: number) => {
      setFormData(prev => ({
         ...prev,
         stock: prev.stock.filter((_, i) => i !== index)
      }))
   }

   const handleSuggestionClick = (suggestion: SneakerSuggestion) => {
      setFormData(prev => ({ ...prev, name: suggestion.title, image: suggestion.image }))
      setShowSuggestions(false)
   }

   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.src = '/placeholder.svg';
   }

   const getTotalInventoryValue = () => {
      return formData.stock.reduce((total, item) => {
         return total + (item.price * item.quantity);
      }, 0).toFixed(2);
   }

   const getTotalInventoryCount = () => {
      return formData.stock.reduce((total, item) => {
         return total + item.quantity;
      }, 0);
   }

   return (
      <Card className="w-full shadow-lg">
         <CardHeader className="border-b bg-white">
            <div className="flex items-center space-x-3">
               <ShoppingBag className="text-gray-900 h-7 w-7" />
               <CardTitle className="text-2xl font-bold text-gray-900">Add New Sneakers to Inventory</CardTitle>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
               {/* Left Side - Form Fields */}
               <div className="md:col-span-2 p-6 space-y-6">
                  <form onSubmit={handleAddSneaker} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} className="space-y-6">
                     <div className="space-y-3 relative">
                        <Label htmlFor="name" className="text-lg font-medium">
                           Sneaker Name
                        </Label>
                        <Input
                           id="name"
                           name="name"
                           placeholder="Enter sneaker name or start typing to search..."
                           value={formData.name}
                           onChange={handleChange}
                           required
                           className="w-full h-12 text-lg"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                           <div 
                              ref={suggestionRef} 
                              className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto"
                           >
                              {suggestions.map((suggestion, index) => (
                                 <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                 >
                                    <div className="w-[50px] h-[50px] relative mr-4">
                                       <Image
                                          src={suggestion.image || "/placeholder.svg"}
                                          alt={suggestion.title}
                                          fill
                                          className="object-contain"
                                          onError={handleImageError}
                                       />
                                    </div>
                                    <span className="flex-1">{suggestion.title}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <h3 className="text-xl font-semibold text-gray-800">Inventory Details</h3>
                           <Button 
                              type="button" 
                              onClick={addStockItem}
                              variant="outline" 
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                           >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Size
                           </Button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                           {formData.stock.map((item, index) => (
                              <div 
                                 key={item.stockId} 
                                 className="p-5 border rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
                              >
                                 <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-blue-600">
                                       Size {item.size > 0 ? item.size : "#" + (index + 1)}
                                    </h3>
                                    {index > 0 && (
                                       <Button 
                                          type="button" 
                                          variant="ghost" 
                                          onClick={() => removeStockItem(index)} 
                                          className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                       >
                                          <Minus className="h-4 w-4" />
                                       </Button>
                                    )}
                                 </div>
                                 <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                       <Label htmlFor={`size-${index}`} className="text-sm font-medium text-gray-600">
                                          Size
                                       </Label>
                                       <Input
                                          id={`size-${index}`}
                                          type="number"
                                          step="0.5"
                                          value={item.size}
                                          onChange={(e) => handleStockChange(index, 'size', e.target.value)}
                                          required
                                          className="h-10"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <Label htmlFor={`price-${index}`} className="text-sm font-medium text-gray-600">
                                          Price ($)
                                       </Label>
                                       <Input
                                          id={`price-${index}`}
                                          type="number"
                                          step="0.01"
                                          value={item.price}
                                          onChange={(e) => handleStockChange(index, 'price', e.target.value)}
                                          required
                                          className="h-10"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <Label htmlFor={`quantity-${index}`} className="text-sm font-medium text-gray-600">
                                          Quantity
                                       </Label>
                                       <Input
                                          id={`quantity-${index}`}
                                          type="number"
                                          value={item.quantity}
                                          onChange={(e) => handleStockChange(index, 'quantity', e.target.value)}
                                          required
                                          className="h-10"
                                       />
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
                     >
                        {isSubmitting ? "Adding to Inventory..." : "Add Sneakers to Inventory"}
                     </Button>
                  </form>
               </div>

               {/* Right Side - Selected Sneaker Preview */}
               <div className="bg-gray-100 p-6 border-l">
                  <div className="h-full flex flex-col">
                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Selected Sneaker</h3>
                     
                     <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg p-6 shadow-sm mb-4">
                        {formData.image ? (
                           <div className="space-y-6 w-full flex flex-col items-center">
                              <div className="relative w-full h-56">
                                 <Image
                                    src={formData.image}
                                    alt={formData.name}
                                    fill
                                    className="object-contain"
                                    onError={handleImageError}
                                 />
                              </div>
                              <div className="text-center w-full">
                                 <h3 className="font-bold text-lg mb-1 text-gray-800">{formData.name}</h3>
                              </div>
                           </div>
                        ) : (
                           <div className="text-center text-gray-400">
                              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                 <ShoppingBag className="h-16 w-16 text-gray-400" />
                              </div>
                              <p>No sneaker selected yet</p>
                              <p className="text-sm mt-2">Start typing a name above to select a sneaker</p>
                           </div>
                        )}
                     </div>

                     {/* Inventory Summary */}
                     <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                        <h4 className="font-semibold text-gray-700">Inventory Summary</h4>
                        <div className="grid grid-cols-2 gap-2">
                           <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm text-gray-600">Total Items</p>
                              <p className="text-xl font-bold text-blue-600">{getTotalInventoryCount()}</p>
                           </div>
                           <div className="bg-green-50 p-3 rounded-md">
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="text-xl font-bold text-green-600">${getTotalInventoryValue()}</p>
                           </div>
                        </div>
                        <div className="pt-2">
                           <p className="text-xs text-gray-500">
                              {formData.stock.length} size{formData.stock.length > 1 ? 's' : ''} configured
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   )
}

export default AddSneakerCard