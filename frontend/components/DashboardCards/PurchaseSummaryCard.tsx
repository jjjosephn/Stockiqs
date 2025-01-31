import { useGetDashboardMetricsQuery } from '@/app/state/api'
import { TrendingDown, TrendingUp } from 'lucide-react'
import numeral from 'numeral'
import React from 'react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, AreaChart, Area } from 'recharts'


const PurchaseSummaryCard = () => {
   const { data, isLoading, isError } = useGetDashboardMetricsQuery()
   const purchaseData = data?.purchaseSummary || []

   const lastPurchased = purchaseData[purchaseData.length - 1] || null

   if (isError){
      return <div className='m-5'> Error fetching data </div>
   }

  return (
      <div className='row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 
         bg-white flex flex-col justify-between shadow-md rounded-2xl'
      >
         {isLoading ? (
            <div className='m-5'>
               Loading...
            </div>
         ): (
            <>
               <div>
                  <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>Purchase Summary</h2>
                  <hr />
               </div>
               
               <div>
                  <div className='flex justify-between items-center mb-6 px-7'>
                     <div className='text-lg font-medium'>
                        <p className='text-xs text-gray-400'>Last Purchased</p>
                        <span className='text-2xl font-extrabold'>
                           {lastPurchased ? numeral(lastPurchased.totalPurchased).format('$0.00a') : '$0.00'}
                        </span>
                        {lastPurchased && (
                           <span className={`text-sm ml-2 ${
                              lastPurchased.changePercentage! >= 0 
                                 ? 'text-green-500'
                                 : 'text-red-500'
                              } 
                           `}>
                              {lastPurchased.changePercentage! >= 0 ? (
                                 <TrendingUp className='inline w-4 h-4 mr-1'/>
                              ) : (
                                 <TrendingDown className='inline w-4 h-4 mr-1'/>
                              )}
                              {Math.abs(lastPurchased.changePercentage!).toFixed(2)}%
                           </span>
                        )}
                     </div>
                  </div>
                  <ResponsiveContainer width='100%' height={200} className='px-5'>
                     <AreaChart
                        data={purchaseData}
                        margin={{top: 0, right: 3, left: -57, bottom: 60}}
                     >
                        <XAxis 
                           dataKey='date' 
                           tick={false}
                           axisLine={false}
                        />
                        <YAxis 
                           tick={false}
                           tickLine={false}
                           axisLine={false}
                        />
                        <Tooltip formatter={(value: number) => [
                           `$${value.toLocaleString('en-US')}`
                        ]}
                        labelFormatter={(label) => {
                           const date = new Date(label)
                           return date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric'})
                        }}
                        />
                        <Area 
                           type='linear'
                           dataKey='totalPurchased' 
                           stroke='#8884d8' 
                           dot={true}
                           fill='#8884d8'
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </>
         )}
      </div>
  )
}

export default PurchaseSummaryCard