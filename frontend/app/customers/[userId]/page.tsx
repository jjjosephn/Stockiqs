'use client'

import { useState } from 'react'
import { redirect, useParams, useRouter } from 'next/navigation'
import { useDeleteCustomerMutation, useGetCustomerQuery, useUpdateCustomerMutation } from '../../state/api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Phone, Instagram, MapPin, ArrowLeft, Edit, Trash2, ChevronRight } from 'lucide-react'
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
import EditCustomerModal from '@/components/Modals/EditCustomerModal'

type CustomerDetailProps = {
  name: string
  phoneNumber: string
  instagram: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

const CustomerDetail = () => {
  const { userId } = useParams()
  const router = useRouter()
  const { data, isLoading, isError } = useGetCustomerQuery(userId as string)
  const [ deleteCustomer ] = useDeleteCustomerMutation()
  const [isDeleting, setIsDeleting] = useState(false)
  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false)
  const [updateCustomer] = useUpdateCustomerMutation()

  if (isLoading) {
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

  if (isError || !data) {
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
      await deleteCustomer(userId as string).unwrap()
      router.back()
    } catch (error) {
      console.error('Failed to delete customer:', error)
      setIsDeleting(false)
    }
  }

  const handleSubmit = async (data: CustomerDetailProps) => {
    await updateCustomer({ userId: userId as string, ...data })
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${data?.name}`} />
              <AvatarFallback>{data.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">{data?.name}</CardTitle>
              <CardDescription className='text-gray-400 hidden md:block'>{data?.phoneNumber || 'N/A'}</CardDescription>
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
              onClick={() => router.push(`/customers/${userId}/details`)}
            >
              <p className='text-gray-900'>View Details</p>
              <ChevronRight className="ml-2 h-4 w-4 text-gray-900" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 hidden md:block">
          <div className="flex items-center space-x-2 text-gray-900">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className='text-gray-900'>{data?.phoneNumber || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-900">
            <Instagram className="h-4 w-4 text-muted-foreground" />
            <span>{data?.instagram || 'N/A'}</span>
          </div>
          <div className="flex items-start space-x-2 text-gray-900">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <span>
              {data?.streetAddress}<br />
              {data?.city}, {data?.state} {data?.zipCode}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className='bg-white border-gray-300 hover:bg-gray-200' variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4 text-gray-900" /> 
            <p className='text-gray-900'>Back to Customers</p>
          </Button>
        </CardFooter>
      </Card>

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        customer={data}
      />
    </div>
  )
}

export default CustomerDetail