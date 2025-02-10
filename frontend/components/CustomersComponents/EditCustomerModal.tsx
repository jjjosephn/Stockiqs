'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

type CustomerDetailProps = {
  name: string
  phoneNumber: string
  instagram: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

type CustomerModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (customer: CustomerDetailProps) => void
  customer: CustomerDetailProps
}

const EditCustomerModal = ({ isOpen, onClose, onSubmit, customer }: CustomerModalProps) => {
    const [formData, setFormData] = useState({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      instagram: customer.instagram,
      streetAddress: customer.streetAddress,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode
    })

    const formatPhoneNumber = (value: string) => {
      const cleaned = value.replace(/\D/g, "");
    
      if (cleaned.length <= 3) {
        return `(${cleaned}`;
      } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prevData => ({
        ...prevData,
        [name]: name === 'phoneNumber' ? formatPhoneNumber(value) : value
      }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onSubmit(formData)
      onClose()
    }

    if (!isOpen) {
      return null
    }
    
    return (
      <div className="fixed inset-0 bg-[#475569] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold text-gray-900">Edit Customer</CardTitle>
            <Button 
              variant="ghost" 
              className="absolute right-4 top-4" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-gray-900">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 text-gray-900">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 text-gray-900">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 text-gray-900">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-900">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 text-gray-900">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button className='bg-gray-50 hover:bg-gray-200' variant="outline" onClick={onClose}>
                <p className='text-gray-900'>Cancel</p>
              </Button>
              <Button type="submit" className='bg-gray-900 hover:bg-gray-500'>
              <p className='text-gray-50'>Save Changes</p>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
}

export default EditCustomerModal