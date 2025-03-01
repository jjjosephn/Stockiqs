'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDeleteCustomerMutation, useGetCustomerQuery, useGetProductsArchiveQuery, useGetSalesQuery, useUpdateCustomerMutation } from '../../state/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, Instagram, MapPin, ArrowLeft, Edit, Trash2, ChevronRight, DollarSign, ChevronLeft } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EditCustomerModal from '@/components/CustomerComponents/EditCustomerModal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from '@clerk/nextjs'

type CustomerDetailProps = {
  name: string
  phoneNumber: string
  instagram: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

interface Product {
  productId: string;
  userId: string;
  name: string;
  image: string;
}

interface ProductStock {
  stockId: string;
  price: number;
  productId: string;
  size: number;
  quantity: number;
  product?: Product;
}

interface PSArchive {
  productsArchiveId: string;
  archiveId: string;
}

interface Customer {
  customerId: string;
  userId: string;
  phoneNumber: string;
  name: string;
  instagram: string | null;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Sale {
  saleId: string;
  userId: string;
  stockId: string | null;
  archiveId: string | null;
  customerId: string;
  productsArchiveId: string | null;
  timestamp: string;
  quantity: number;
  salesPrice: number;
  customers?: Customer;
  productStock?: ProductStock;  
  psArchive?: PSArchive;
}

interface ProductArchive {
  productsArchiveId: string;
  name: string;
  psArchive?: {
    archiveId: string;
    size: number;
    price: number;
  }[];
}

const ITEMS_PER_PAGE = 5

const CustomerDetail = () => {
  const {userId} = useAuth()
  const { customerId } = useParams()
  const router = useRouter()
  const { data: customer, isLoading, isError } = useGetCustomerQuery({userId: userId || '', customerId: customerId as string})
  const { data: sales, isLoading: salesLoading } = useGetSalesQuery({userId: userId || ''})
  const { data: productsArchive, isLoading: productsArchiveLoading } = useGetProductsArchiveQuery()
  const [ deleteCustomer ] = useDeleteCustomerMutation()
  const [isDeleting, setIsDeleting] = useState(false)
  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false)
  const [updateCustomer] = useUpdateCustomerMutation()
  const [currentPage, setCurrentPage] = useState(1)

  const customerSales = useMemo(() => {
    if (!sales || !customerId) return []
    
    return sales
      .filter(sale => sale.customerId === customerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [sales, customerId])

  const totalPurchases = useMemo(() => 
    customerSales.reduce((total, sale) => total + (sale.salesPrice * sale.quantity), 0),
    [customerSales]
  )

  const totalPages = Math.max(1, Math.ceil(customerSales.length / ITEMS_PER_PAGE))
  const paginatedSales = customerSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getProductInfo = (sale: Sale) => {
    if (sale.productStock) {
      return {
        name: sale.productStock.product?.name || 'Unknown Product',
        size: sale.productStock.size,
        price: sale.productStock.price
      }
    } else if (sale.psArchive && sale.productsArchiveId && sale.archiveId) {
      const archivedProduct = productsArchive?.find(p => 
        p.productsArchiveId === sale.productsArchiveId
      )
      const archivedStock = archivedProduct?.psArchive?.find(s => 
        s.archiveId === sale.archiveId
      )
      
      return {
        name: archivedProduct?.name || 'Unknown Product',
        size: archivedStock?.size || 0,
        price: archivedStock?.price || 0
      }
    }
    
    return { name: 'Unknown Product', size: 0, price: 0 }
  }

  if (isLoading || salesLoading || productsArchiveLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !customer) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Error</CardTitle>
            <CardDescription>Unable to load customer details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>There was an error loading the customer information. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCustomer(customerId as string).unwrap()
      router.back()
    } catch (error) {
      console.error('Failed to delete customer:', error)
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (data: CustomerDetailProps) => {
    await updateCustomer({ customerId: customerId as string, ...data })
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${customer.name}`} />
              <AvatarFallback>{customer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">{customer.name}</CardTitle>
              <CardDescription className='text-gray-400 hidden md:block'>{customer.phoneNumber || 'N/A'}</CardDescription>
            </div>
          </div>
          <div className="space-x-2">
            <Button 
              className='bg-white border-gray-300 hover:bg-gray-200 hidden md:inline-flex' 
              variant="outline" 
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4 text-gray-900" /> 
              <p className='text-gray-900'>Edit</p>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className='bg-red-600 hidden md:inline-flex'>
                  <Trash2 className="mr-2 h-4 w-4 text-white" />
                  <p className='text-white'>Delete</p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the customer
                    and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button 
              className='bg-white border-gray-300 hover:bg-gray-200 md:hidden' 
              variant="outline" 
              onClick={() => router.push(`/customers/${customerId}/details`)}
            >
              <p className='text-gray-900'>View Details</p>
              <ChevronRight className="ml-2 h-4 w-4 text-gray-900" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Instagram className="h-4 w-4 text-muted-foreground" />
                <span>{customer.instagram || 'N/A'}</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-700">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span>
                  {customer.streetAddress}<br />
                  {customer.city}, {customer.state} {customer.zipCode}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-green-600 mb-1">Total Purchases</p>
                <div className="flex items-center justify-center space-x-2">
                  <DollarSign className="h-6 w-6 text-green-500" />
                  <span className="text-3xl font-bold text-green-700">{totalPurchases.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className='bg-white border-gray-300 hover:bg-gray-200' variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4 text-gray-900" /> 
            <p className='text-gray-900'>Back</p>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Purchase History</CardTitle>
          <CardDescription>
            {customerSales.length === 0 
              ? "No purchase history available for this customer." 
              : `Showing ${customerSales.length} purchase${customerSales.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customerSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              This customer has not made any purchases yet.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Size</TableHead>
                      <TableHead className="font-semibold">Quantity</TableHead>
                      <TableHead className="font-semibold">Product Price/Pair</TableHead>
                      <TableHead className="font-semibold">Sales Price/Pair</TableHead>
                      <TableHead className="font-semibold">Total Purchase Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.map((sale) => {
                      const productInfo = getProductInfo(sale)
                      
                      return (
                        <TableRow key={sale.saleId} className="hover:bg-gray-50">
                          <TableCell>{new Date(sale.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{productInfo.name}</TableCell>
                          <TableCell>{productInfo.size}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>${productInfo.price.toFixed(2)}</TableCell>
                          <TableCell>${sale.salesPrice.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold">${(sale.salesPrice * sale.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      )   
                    })}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        customer={customer}
      />
    </div>
  )
}

export default CustomerDetail