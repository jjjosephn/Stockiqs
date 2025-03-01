import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"
import { useGetPurchasesQuery } from "@/app/state/api"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@clerk/nextjs"

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps): React.ReactElement | null => {
  if (active && payload && payload.length) {
    const thisWeek = payload[0].value
    const pastWeek = payload[1].value
    const difference = thisWeek - pastWeek
    const percentChange = ((difference) / (pastWeek || 1) * 100).toFixed(1)

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500 opacity-80" />
            <span>This Week: {formatCurrency(thisWeek)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-80" />
            <span>Past Week: {formatCurrency(pastWeek)}</span>
          </div>
          {pastWeek > 0 && (
            <div className={`text-sm mt-2 ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {difference >= 0 ? '↑' : '↓'} ${Math.abs(difference).toLocaleString()} ({percentChange}%)
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const getNiceRoundedMax = (value: number): number => {
  if (value <= 0) return 100;
  
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const nextNiceNumber = Math.ceil(value / magnitude) * magnitude
  
  if (nextNiceNumber / value < 1.1) {
    return nextNiceNumber
  }
  
  return Math.ceil(value / (magnitude / 4)) * (magnitude / 4)
}

interface DailySummary {
  day: string;
  thisWeek: number;
  pastWeek: number;
}

interface ProductStock {
  price: number;
  quantity: number;
}

interface PSArchive {
  price: number;
  quantity: number;
}

interface Purchase {
  timestamp: string;
  productStock?: ProductStock;
  psArchive?: PSArchive;
}

interface Totals {
  thisWeekTotal: number;
  pastWeekTotal: number;
}

const PurchaseSummary = (): JSX.Element => {
  const {userId} = useAuth()
  const { data: purchases, isLoading, isError } = useGetPurchasesQuery({userId: userId || ''})

  const purchaseSummaryData = useMemo((): DailySummary[] => {
    if (!purchases) return []

    const now = new Date()
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const startOfPastWeek = new Date(startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000)

    const dailyTotals: DailySummary[] = daysOfWeek.map((day) => ({
      day,
      thisWeek: 0,
      pastWeek: 0,
    }))

    purchases.forEach((purchase: Purchase) => {
      const purchaseDate = new Date(purchase.timestamp)
      const dayIndex = purchaseDate.getDay()
      const price = ((purchase.productStock?.price ?? 0) * (purchase.productStock?.quantity ?? 0)) || 
         ((purchase.psArchive?.price ?? 0) * (purchase.psArchive?.quantity ?? 0)) || 0

      if (purchaseDate >= startOfThisWeek) {
        dailyTotals[dayIndex].thisWeek += price
      } else if (purchaseDate >= startOfPastWeek) {
        dailyTotals[dayIndex].pastWeek += price
      }
    })

    return dailyTotals
  }, [purchases])

  const totals = useMemo((): Totals => {
    if (!purchaseSummaryData.length) return { thisWeekTotal: 0, pastWeekTotal: 0 }
    
    const thisWeekTotal = purchaseSummaryData.reduce((sum, day) => sum + day.thisWeek, 0)
    const pastWeekTotal = purchaseSummaryData.reduce((sum, day) => sum + day.pastWeek, 0)

    return { thisWeekTotal, pastWeekTotal }
  }, [purchaseSummaryData])

  const maxValue = useMemo((): number => {
    if (!purchaseSummaryData.length) return 100;
    
    return Math.max(
      ...purchaseSummaryData.map((day) => Math.max(day.thisWeek, day.pastWeek))
    );
  }, [purchaseSummaryData]);
  
  const roundedMaxValue = getNiceRoundedMax(maxValue);
  
  const yAxisTicks = useMemo((): number[] => {
    return Array.from({ length: 6 }, (_, i) => Math.round(i * roundedMaxValue / 5));
  }, [roundedMaxValue]);

  if (isLoading) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Loading purchase data...</p>
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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an error loading the purchase data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="md:col-span-2 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-700">Purchase Summary</CardTitle>
        <CardDescription className="flex gap-8">
          <div>
            <span className="text-gray-500">This Week: </span>
            <span className="font-medium">{formatCurrency(totals.thisWeekTotal)}</span>
          </div>
          <div>
            <span className="text-gray-500">Past Week: </span>
            <span className="font-medium">{formatCurrency(totals.pastWeekTotal)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={purchaseSummaryData}
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickLine={{ stroke: "#6b7280" }}
              />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                tick={{ fill: "#6b7280" }}
                tickLine={{ stroke: "#6b7280" }}
                domain={[0, roundedMaxValue]}
                width={80}
                ticks={yAxisTicks}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px"
                }}
              />
              <Bar
                dataKey="thisWeek"
                name="This Week"
                fill="#8b5cf6"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pastWeek"
                name="Past Week"
                fill="#3b82f6"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default PurchaseSummary