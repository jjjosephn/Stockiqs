import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Package, TrendingUp, TrendingDown } from "lucide-react"
import { useGetCustomersQuery, useGetProductsQuery, useGetSalesQuery } from '@/app/state/api'
import { link } from 'fs'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

const isCurrentWeek = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)))
  startOfWeek.setHours(0, 0, 0, 0)
  return date >= startOfWeek
}

const getRevenueChange = (sales: any[]) => {
  const thisWeekRevenue = sales
    .filter(sale => isCurrentWeek(sale.timestamp))
    .reduce((acc, sale) => acc + (sale.quantity * sale.salesPrice), 0)

  const lastWeekRevenue = sales
    .filter(sale => !isCurrentWeek(sale.timestamp))
    .reduce((acc, sale) => acc + (sale.quantity * sale.salesPrice), 0)

  const percentageChange = lastWeekRevenue ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 : 0
  return percentageChange
}

const formatCurrency = (value: number) => {
   return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
 };

const OverviewCards = () => {
  const {userId} = useAuth()
  const { data: customers } = useGetCustomersQuery({userId: userId || ''})
  const { data: sales, isLoading, isError } = useGetSalesQuery({userId: userId || ''})
  const { data: products } = useGetProductsQuery({userId: userId || ''})

  const totalRevenue = sales?.reduce((acc, sale) => acc + (sale.quantity * sale.salesPrice), 0) || 0  
  const totalPrice = products?.reduce((total, product) => 
      total + product.stock.reduce((sum, item) => sum + (item.quantity * item.price), 0), 0) || 0
  
  const revenueChange = sales ? getRevenueChange(sales) : 0

  const overviewCards = [
      {
        title: "Total Customers",
        link: "/customers",
        value: customers?.length,
        subtitle: "Active accounts",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        gradient: "from-blue-500 to-blue-600"
      },
      {
        title: "Total Revenue",
        link: "/sales",
        value: `${formatCurrency(totalRevenue)}`,
        change: revenueChange ? `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%` : null,
        subtitle: "All time sales",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-100",
        gradient: "from-green-500 to-green-600"
      },
      {
        title: "Inventory Value",
        link: "/inventory",
        value: `${formatCurrency(totalPrice)}`,
        subtitle: "Current stock",
        icon: Package,
        color: "text-indigo-600",
        bgColor: "bg-indigo-100",
        gradient: "from-purple-500 to-purple-600"
      },
    ]
  
  if (isLoading) {
    return <div className="grid gap-6 mb-6 md:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse bg-gray-100">
          <div className="h-32"></div>
        </Card>
      ))}
    </div>
  }

  return (
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {overviewCards.map((card) => (
          <Link href={card.link} key={card.title}>
            <Card 
              key={card.title} 
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg group shadow-md"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${card.gradient} transition-opacity duration-300`} />
              
              <CardHeader className="relative flex flex-row items-center justify-between pb-2 space-y-0">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-500 group-hover:text-white transition-colors duration-300">
                    {card.title}
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-200 transition-colors duration-300">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${card.bgColor} group-hover:bg-white/20 transition-colors duration-300`}>
                  <card.icon className={`w-5 h-5 ${card.color} group-hover:text-white transition-colors duration-300`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold group-hover:text-white transition-colors duration-300">
                    {card.value || '—'}
                  </span>
                  {card.change && (
                    <div className="flex items-center gap-1">
                      {revenueChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 group-hover:text-white transition-colors duration-300" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                      )}
                      <span className={`text-sm ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'} group-hover:text-white transition-colors duration-300`}>
                        {card.change} vs last week
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
  )
}

export default OverviewCards