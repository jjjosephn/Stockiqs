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
  email: string
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
    email: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onCreate(formData)
    setFormData({
      userId: v4(),
      name: '',
      email: ''
    })
    onClose()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#475569] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold">Add New Customer</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter customer email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Customer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default AddCustomerModal