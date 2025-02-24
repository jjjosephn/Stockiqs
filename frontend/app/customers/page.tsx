'use client'

import { useState } from 'react'
import { useCreateCustomerMutation, useGetCustomersQuery } from '../state/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import AddCustomerModal from '@/components/CustomerComponents/AddCustomerModal'
import { useAuth } from '@clerk/nextjs'

type CustomerFormData = {
  name: string
  phoneNumber: string
  instagram: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

const Customers = () => {
  const {userId, isLoaded} = useAuth() 
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false)
  const [addCustomer] = useCreateCustomerMutation()
  if (!isLoaded || !userId) {
    return <div className="flex justify-center items-center h-screen">Loading auth...</div>
  }
  const { data, isError, isLoading } = useGetCustomersQuery({userId})
  const itemsPerPage = 10
  console.log(data)
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading customers...</div>
  }

  if (isError || !data) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error fetching customers</div>
  }

  const filteredCustomers = data.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleAddCustomer = async (data: CustomerFormData) => {
    await addCustomer(data)
  }

  console.log(window.location.href);
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Customers</CardTitle>
              <CardDescription>Manage your customer base</CardDescription>
            </div>
            <Button
              onClick={() => setAddCustomerModalOpen(true)}
              className='bg-gray-900 hover:bg-gray-400'
            >
              <UserPlus className="mr-2 h-4 w-4 text-gray-50" /> 
                <p className='text-gray-50'>Add New Customer</p>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-gray-300"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total Customers: {filteredCustomers.length}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='border-gray-300'>
                <TableHead>Customer</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer) => (
                <TableRow key={customer.customerId} className='hover:bg-gray-100 border-gray-300'>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${customer.name}`} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell className='text-gray-800'>{customer.phoneNumber}</TableCell>
                  <TableCell className='text-gray-800'>{customer.customerId}</TableCell>
                  <TableCell className='text-gray-900'>
                    <Button className='hover:bg-gray-300'variant="ghost" asChild onClick={() => {console.log(customer.customerId)}}>
                      <Link href={`/customers/${customer.customerId}`}>
                        <p className='text-gray-900'>View Details</p>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
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
              <div className="text-sm text-gray-900">
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
        </CardContent>
      </Card>

      <AddCustomerModal
        isOpen={addCustomerModalOpen}
        onClose={() => setAddCustomerModalOpen(false)}
        onCreate={handleAddCustomer}
      />

    </div>
  )
}

export default Customers