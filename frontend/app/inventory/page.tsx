"use client"

import { useState } from "react"
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "../state/api"
import Header from "@/components/Header"
import { PlusCircle, Search, Loader2 } from "lucide-react"
import AddSneakerModal from "@/components/SneakerModals/AddSneakerModal"
import SneakerInfoModal from "@/components/SneakerModals/SneakerInfoModal"
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
        {data.map((product) => (
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

