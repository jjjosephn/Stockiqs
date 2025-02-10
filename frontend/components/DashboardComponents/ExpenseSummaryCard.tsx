import { ExpenseByCategorySummary, useGetDashboardMetricsQuery } from '@/app/state/api'
import { TrendingUp } from 'lucide-react'
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const colors = ['#00C49F', '#0088FE', '#FFBB28']
type ExpenseSum = {
   [category: string]: number
}

const ExpenseSummaryCard = () => {
   const { data, isLoading, isError } = useGetDashboardMetricsQuery()
   const expenseSummary = data?.expenseSummary || []
   const expenseByCategorySummary = data?.expenseByCategorySummary || []

   const expenseSum = expenseByCategorySummary.reduce(
      (acc: ExpenseSum, item: ExpenseByCategorySummary) => {
         const category = item.category + ' Expenses'
         const amount = parseInt(item.amount, 10)
         if (!acc[category]) acc[category] = 0
         acc[category] += amount
         return acc
      }, {}
   )

   const expenseCategories = Object.entries(expenseSum).map(
      ([name, value]) => ({
         name,
         value
      })
   )

   const totalExpenses = expenseCategories.reduce((acc, curr) => acc + curr.value, 0)

   if(isError){
      return <div className='m-5'> Error fetching data </div>
   }

   return (
      <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
        {isLoading ? (
          <div className="m-5">Loading...</div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                Expense Summary
              </h2>
              <hr />
            </div>
            <div className="xl:flex justify-between pr-7">
              <div className="relative basis-3/5">
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      innerRadius={50}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                  <span className="font-bold text-xl">
                    ${(totalExpenses || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
                {expenseCategories.map((entry, index) => (
                  <li
                    key={`legend-${index}`}
                    className="flex items-center text-xs"
                  >
                    <span
                      className="mr-2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></span>
                    {entry.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <hr />
               {expenseSummary && (
                  <div className='mt-3 flex justify-between items-center px-7 mb-4'>
                     <div className='pt-2'>
                        <p className='text-sm'>
                           Average: &nbsp;
                           <span className='font-semibold'>${((totalExpenses)/expenseSummary.length).toFixed(2)}</span>
                        </p>
                     </div>
                  </div>
               )}
            </div>
          </>
        )}
      </div>
    );
  };
  

export default ExpenseSummaryCard