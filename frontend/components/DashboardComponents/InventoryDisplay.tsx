import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag, Package, Loader2, AlertCircle } from "lucide-react"
import { useGetProductsQuery } from "@/app/state/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

const InventoryDisplay = () => {
  const { data: sneakers, isLoading, isError } = useGetProductsQuery()

  if (isLoading) {
    return (
      <Card className="md:col-span-1 md:row-span-2">
        <CardHeader>
          <CardTitle className="text-gray-700 flex items-center justify-between">
            <span>Sneakers Inventory</span>
            <ShoppingBag className="w-4 h-4 text-gray-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[800px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">Loading inventory data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="md:col-span-1 md:row-span-2">
        <CardHeader>
          <CardTitle className="text-gray-700 flex items-center justify-between">
            <span>Sneakers Inventory</span>
            <ShoppingBag className="w-4 h-4 text-gray-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[800px]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an error loading the inventory data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const sneakersInventory = sneakers
    ? sneakers
        .map((sneaker) => {
          const totalQuantity = sneaker.stock.reduce((sum, item) => sum + item.quantity, 0)
          const totalValue = sneaker.stock.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const averagePrice = totalValue / totalQuantity
          return {
            name: sneaker.name,
            quantity: totalQuantity,
            value: totalValue,
            avgPrice: averagePrice,
            lowStock: totalQuantity < 5 
          }
        })
        .sort((a, b) => b.value - a.value)
    : []

  const totalPairs = sneakersInventory.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="md:col-span-1 md:row-span-2">
      <CardHeader>
        <CardTitle className="text-gray-700 flex items-center justify-between">
          <span>Sneakers Inventory</span>
          <ShoppingBag className="w-4 h-4 text-gray-500" />
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Pairs</p>
            <p className="text-lg font-semibold text-gray-700">
              {totalPairs.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[650px] pr-4">
          {sneakersInventory.map((sneaker, index) => (
            <div
               key={index}
               className="group flex justify-between items-start py-4 border-b last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-700">{sneaker.name}</p>
                  {sneaker.lowStock && (
                    <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">{sneaker.quantity} pairs</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Avg: ${sneaker.avgPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-200"
              >
                ${sneaker.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Badge>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default InventoryDisplay