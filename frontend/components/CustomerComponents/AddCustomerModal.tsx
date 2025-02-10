'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'
import { v4 } from 'uuid'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

type CustomerFormData = {
  name: string
  phoneNumber: string
  instagram: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

type AddCustomerModalProps = {
  isOpen: boolean,
  onClose: () => void,
  onCreate: (formData: CustomerFormData) => void
}

const AddCustomerModal = ({ isOpen, onClose, onCreate }: AddCustomerModalProps) => {
  const [formData, setFormData] = useState({
    userId: v4(),
    name: '',
    phoneNumber: '',
    instagram: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onCreate(formData)
    setFormData({
      userId: v4(),
      name: '',
      phoneNumber: '',
      instagram: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: ''
    })
    onClose()
  }

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
    setFormData({
      ...formData,
      [name]: name === "phoneNumber" ? formatPhoneNumber(value) : value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#475569] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-gray-900">Add New Customer</CardTitle>
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="Enter instagram username"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="phone">Phone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="address">Address</Label>
              <Input
                id="streetAddress"
                name="streetAddress"
                placeholder="Enter address"
                value={formData.streetAddress}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900" htmlFor="zip">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="Enter zip code"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button className='bg-gray-100 text-gray-900' variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className='bg-gray-900 text-gray-50' type="submit">
              Add Customer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default AddCustomerModal