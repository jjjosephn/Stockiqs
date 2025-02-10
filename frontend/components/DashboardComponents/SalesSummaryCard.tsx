import { useGetDashboardMetricsQuery } from '@/app/state/api'
import { TrendingDown, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts'

const SalesSummaryCard = () => {
   const { data, isLoading, isError } = useGetDashboardMetricsQuery()
   const salesData = data?.saleSummary

   const totalValueSum = salesData?.reduce((acc, curr) => acc + curr.totalValue, 0) || 0
   const averageChangePercentage = salesData?.reduce((acc, curr, _, arr) => {
      return acc + (curr.changePercentage || 0) / arr.length
   }, 0) || 0

   const highestValueData = salesData?.reduce((acc, curr) => {
      return acc.totalValue > curr.totalValue ? acc : curr
   }, salesData[0] || {})

   const highestValueDate = highestValueData?.date ? 
      new Date(highestValueData.date).toLocaleDateString('en-US', {
         month: 'numeric',
         day: 'numeric',
         year: '2-digit'
      }) : 'N/A'

   if (isError){
      return <div className='m-5'> Error fetching data </div>
   }
   return (
      <div className='row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between'>
         {isLoading ? (
            <div className='m-5'>Loading...</div>
         ) : (
            <>
               <div>
                  <h2 className='text-lg font-semibold mb-2 px-7 pt-5'>Sales Summary</h2>
                  <hr />
               </div>
               <div>
                  <div className='flex justify-between items-center mb-6 px-7'>
                     <div className='text-lg font-medium'>
                        <p className='text-xs text-gray-400'>Value</p>
                        <span className='text-2xl font-extrabold'>
                           ${(totalValueSum / 1000000).toLocaleString('en-US', {maximumFractionDigits: 2})}m
                        </span>
                        {averageChangePercentage >= 0 ? (
                           <>
                              <span className='text-green-500 text-sm ml-2'>
                                 <TrendingUp className='inline w-4 h-4 mr-1'/>
                                 {averageChangePercentage.toFixed(2)}%
                              </span>
                           </>
                        ) : (
                           <>
                              <span className='text-red-500 text-sm ml-2'>
                                 <TrendingDown className='inline w-4 h-4 mr-1'/>
                                 {Math.abs(averageChangePercentage).toFixed(2)}%
                              </span>
                           </>
                        )}
                     </div>
                  </div>

                  <ResponsiveContainer width='100%' height={350} className='px-5'>
                     <BarChart
                        data={salesData}
                        margin={{top: 0, right: 0, left: -22, bottom: 0}}
                     >
                        <CartesianGrid strokeDasharray='' vertical={false}/>
                        <XAxis 
                           dataKey='date' 
                           tickFormatter={(value) => {
                              const date = new Date(value)
                              return `${date.getMonth() + 1}/${date.getDate()}`
                        }}/>
                        <YAxis 
                           tickFormatter={(value) => {
                              return `$${(value / 1000000).toFixed(0)}m`
                           }}
                           tick={{fontSize: 12, dx: - 1}}
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
                        <Bar dataKey='totalValue' fill='#3182ce' barSize={10} radius={[10,10,0,0]}/>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               
               <div>
                  <hr />
                  <div className='flex justify-between items-center mt-6 text-sm px-7 mb-4'>
                     <p>{salesData?.length || 0} days </p>
                     <p className='text-sm'>
                        Highest Sales Date: {''}
                        <span className='font-bold'>{highestValueDate}</span>
                     </p>
                  </div>
               </div>
            </>
         )}
      </div>
   )
}

export default SalesSummaryCard