import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useGetSalesQuery } from "@/app/state/api"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@clerk/nextjs"

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const getWeekday = (dateString: string) => {
  const date = new Date(dateString)
  return weekdays[date.getDay()]
}

const getWeekRange = (date: Date) => {
  const sunday = new Date(date)
  sunday.setDate(date.getDate() - date.getDay())
  sunday.setHours(0, 0, 0, 0)

  const saturday = new Date(sunday)
  saturday.setDate(sunday.getDate() + 6)
  saturday.setHours(23, 59, 59, 999)

  return { start: sunday, end: saturday }
}

const isCurrentWeek = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const currentWeek = getWeekRange(now)
  return date >= currentWeek.start && date <= currentWeek.end
}

const groupSalesByWeekday = (sales: any[]) => {
  const groupedSales = sales.reduce((acc, sale) => {
    const weekday = getWeekday(sale.timestamp)
    const week = isCurrentWeek(sale.timestamp) ? "thisWeek" : "pastWeek"
    if (!acc[weekday]) {
      acc[weekday] = { thisWeek: 0, pastWeek: 0 }
    }
    acc[weekday][week] += sale.quantity * sale.salesPrice
    return acc
  }, {})

  return weekdays.map((day) => ({
    day,
    thisWeek: groupedSales[day]?.thisWeek || 0,
    pastWeek: groupedSales[day]?.pastWeek || 0,
    change:
      (((groupedSales[day]?.thisWeek || 0) - (groupedSales[day]?.pastWeek || 0)) / (groupedSales[day]?.pastWeek || 1)) *
      100,
  }))
}

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const thisWeek = payload[0].value
    const pastWeek = payload[1].value
    const difference = thisWeek - pastWeek

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
        {payload[0].payload.change && (
          <div className="mt-2 text-sm">
            <span className={payload[0].payload.change >= 0 ? "text-green-600" : "text-red-600"}>
              {payload[0].payload.change >= 0 ? '↑ ' : '↓ '}
              {formatCurrency(Math.abs(difference))} ({payload[0].payload.change.toFixed(1)}%) vs past week
            </span>
          </div>
        )}
      </div>
    )
  }
  return null
}

const getNiceRoundedMax = (value: number) => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const nextNiceNumber = Math.ceil(value / magnitude) * magnitude
  
  if (nextNiceNumber / value < 1.1) {
    return nextNiceNumber
  }
  
  return Math.ceil(value / (magnitude / 4)) * (magnitude / 4)
}

const SalesSummary = () => {
  const {userId} = useAuth()
  const { data: sales, isLoading, isError } = useGetSalesQuery({userId: userId || ''})

  if (isLoading) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Loading sales data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="h-[500px] flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              There was an error loading the sales data. Please try refreshing the page or contact support if the issue
              persists.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const weeklySalesData = groupSalesByWeekday(sales || [])
  const totalThisWeek = weeklySalesData.reduce((sum, day) => sum + day.thisWeek, 0)
  const totalPastWeek = weeklySalesData.reduce((sum, day) => sum + day.pastWeek, 0)
  
  const maxValue = Math.max(
    ...weeklySalesData.map((d) => Math.max(d.thisWeek, d.pastWeek))
  )
  
  const roundedMaxValue = getNiceRoundedMax(maxValue)

  return (
    <Card className="md:col-span-2 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-700">Weekly Sales</CardTitle>
        <CardDescription className="flex items-center gap-8">
         <span>
            Total This Week: {formatCurrency(totalThisWeek)}
         </span>
         <span>
            Total Past Week: {formatCurrency(totalPastWeek)}
         </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklySalesData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: "#6b7280" }} tickLine={{ stroke: "#6b7280" }} />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fill: "#6b7280" }}
                tickLine={{ stroke: "#6b7280" }}
                domain={[0, roundedMaxValue]}
                width={80}
                // Use ticks to control the exact values shown on the y-axis
                ticks={Array.from({ length: 6 }, (_, i) => Math.round(i * roundedMaxValue / 5))}
                />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
              />
              <defs>
                <linearGradient id="thisWeekGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="pastWeekGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="thisWeek"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#thisWeekGradient)"
                name="This Week"
              />
              <Area
                type="monotone"
                dataKey="pastWeek"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#pastWeekGradient)"
                name="Past Week"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesSummary