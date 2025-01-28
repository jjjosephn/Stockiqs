import { useGetDashboardMetricsQuery } from '@/app/state/api'
import React from 'react'

const PopularProductsCard = () => {
   const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery()
   
   return (
      <div>PopularProductsCard</div>
   )
}

export default PopularProductsCard