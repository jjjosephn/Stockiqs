"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  Cell,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, Package, ShoppingBag } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for the weekly sales summary
const weeklySalesData = [
  { day: "Mon", sales: 5000 },
  { day: "Tue", sales: 7000 },
  { day: "Wed", sales: 6500 },
  { day: "Thu", sales: 8000 },
  { day: "Fri", sales: 9500 },
  { day: "Sat", sales: 11000 },
  { day: "Sun", sales: 7500 },
]

// Mock data for the purchase summary
const purchaseSummaryData = [
  { category: "Electronics", value: 35000 },
  { category: "Clothing", value: 28000 },
  { category: "Home & Garden", value: 22000 },
  { category: "Sports", value: 15000 },
  { category: "Books", value: 10000 },
]

// Mock data for sneakers inventory
const sneakersInventory = [
  { name: "Air Max 90", quantity: 250, value: "$37,500" },
  { name: "Jordan 1 Retro High", quantity: 180, value: "$36,000" },
  { name: "Yeezy Boost 350", quantity: 150, value: "$45,000" },
  { name: "Adidas Ultraboost", quantity: 200, value: "$30,000" },
  { name: "Nike Dunk Low", quantity: 160, value: "$24,000" },
  { name: "New Balance 990", quantity: 120, value: "$18,000" },
  { name: "Converse Chuck Taylor", quantity: 300, value: "$15,000" },
  { name: "Vans Old Skool", quantity: 250, value: "$12,500" },
  { name: "Reebok Classic", quantity: 180, value: "$9,000" },
  { name: "Puma Suede", quantity: 140, value: "$7,000" },
].sort((a, b) => b.quantity - a.quantity) // Sort by quantity, descending

const overviewCards = [
  {
    title: "Total Customers",
    value: "24,563",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Revenue",
    value: "$845.3K",
    change: "+18.7%",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Inventory Value",
    value: "$1.2M",
    change: "+5.2%",
    icon: Package,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {overviewCards.map((card) => (
          <Card key={card.title} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <Badge variant="secondary" className={`mt-1 ${card.color} ${card.bgColor}`}>
                {card.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-700">Weekly Sales Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderColor: "#e5e7eb",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                    name="Sales"
                  />
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c4b5fd" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fillOpacity={1} fill="url(#salesGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 md:row-span-2">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center justify-between">
              <span>Sneakers Inventory</span>
              <ShoppingBag className="w-4 h-4 text-gray-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[800px] pr-4">
              {sneakersInventory.map((sneaker, index) => (
                <div key={sneaker.name} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{sneaker.name}</p>
                    <p className="text-sm text-gray-500">{sneaker.quantity} pairs</p>
                  </div>
                  <Badge variant="outline" className="text-indigo-600">
                    {sneaker.value}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-700">Purchase Summary by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={purchaseSummaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderColor: "#e5e7eb",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Purchase Value">
                    {purchaseSummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`rgba(139, 92, 246, ${0.5 + index * 0.1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

