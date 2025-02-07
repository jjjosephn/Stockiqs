"use client"

import { useState } from "react"
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "../state/api"
import Header from "@/components/Header"
import { PlusCircle, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import AddSneakerModal from "@/components/Modals/AddSneakerModal"
import SneakerInfoModal from "@/components/Modals/SneakerInfoModal"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type ProductFormData = {
  name: string
  price: number
  stockQuantity: number
  rating: number
}

const Inventory = () => {
  const [search, setSearch] = useState("")
  const [addSneakerModalOpen, setAddSneakerModalOpen] = useState(false)
  const [sneakerInfoModalOpen, setSneakerInfoModalOpen] = useState(false)
  const { data, isError, isLoading } = useGetProductsQuery(search)
  const [addSneaker] = useCreateProductMutation()
  const [deleteSneaker] = useDeleteProductMutation()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const handleAddSneaker = async (data: ProductFormData) => {
    await addSneaker(data)
  }

  const handleDeleteSneaker = async (productId: string) => {
    await deleteSneaker(productId)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (isError || !data) {
    return <div className="text-center text-red-500 py-4">Error fetching products</div>
  }

  const filteredProducts = data.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Header name="Inventory" />
        <Button
          onClick={() => setAddSneakerModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Sneaker
        </Button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search sneaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentProducts.map((product) => (
          <motion.div
            key={product.productId}
            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              setSneakerInfoModalOpen(true)
              setSelectedProduct(product)
            }}
          >
            <div className="p-4">
              <div className="bg-gray-200 h-48 mb-4 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Image Placeholder</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">${product.price.toFixed(2)}</p>
              <div className="text-gray-600">Stock: {product.stockQuantity}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className='bg-gray-900 hover:bg-gray-300'
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 text-gray-50" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            className='bg-gray-900 hover:bg-gray-300'
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4 text-gray-50" />
          </Button>
        </div>
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
  )
}

export default Inventory