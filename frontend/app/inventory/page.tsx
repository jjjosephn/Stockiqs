"use client"

import { useState, useMemo } from "react"
import { useDeleteProductMutation, useGetProductsArchiveQuery, useGetProductsQuery, useGetSalesQuery } from "../state/api"
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import SneakerInfoModal from "@/components/InventoryComponents/SneakerInfoModal"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import Image from 'next/image'

interface StockItem {
  productId: string;
  size: number;
  stockId: string;
  price: number;
  quantity: number;
}

interface Product {
  productId: string;
  name: string;
  image?: string;
  stock: StockItem[];
}

const Inventory = () => {
  const {userId} = useAuth()
  const [search, setSearch] = useState("")
  const [sneakerInfoModalOpen, setSneakerInfoModalOpen] = useState(false)
  const { data, isError, isLoading } = useGetProductsQuery({ search: search || '', userId: userId || '' })
  const [deleteProduct] = useDeleteProductMutation()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { refetch: refetchSales } = useGetSalesQuery({ userId: userId || '' });
  const { refetch: refetchProductsArchive } = useGetProductsArchiveQuery();
  const itemsPerPage = 12

  const handleDeleteSneaker = async (productId: string) => {
    await deleteProduct({ productId, userId: userId || '' })
    await refetchSales()
    await refetchProductsArchive()
  }

  const sortedAndFilteredProducts = useMemo(() => {
    if (!data) return []
    return data
      .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data, search])

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

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = sortedAndFilteredProducts.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="container mx-auto px-4 py-8">

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
        {currentProducts.map((product, index) => (
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
              <div className="h-48 mb-10 mt-6 rounded-md flex items-center justify-center">
              <Image 
                src={product.image || 'logo.png'} 
                alt={product.name}
                width={200}
                height={200}
                className="object-contain"
                priority={index < 4}
              />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">${(product.stock.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</p>
              <div className="text-gray-600">Stock: {product.stock.reduce((total, item) => total + item.quantity, 0)}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedAndFilteredProducts.length)} of {sortedAndFilteredProducts.length} products
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

      {selectedProduct && (
        <SneakerInfoModal
          isOpen={sneakerInfoModalOpen}
          onClose={() => {
            setSneakerInfoModalOpen(false)
            setSelectedProduct(null)
          }}
          onDelete={() => handleDeleteSneaker(selectedProduct.productId)}
          product={selectedProduct}
        />
      )}
    </div>
  )
}

export default Inventory