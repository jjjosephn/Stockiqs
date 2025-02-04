'use client'

import React from 'react'
import { useGetCustomersQuery } from '../state/api'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Header from '@/components/Header';

const Customers = () => {
   const { data, isError, isLoading } = useGetCustomersQuery()

   if(isLoading) {
      return <div className='text-center py-4'>Loading...</div>
   }

   if (isError || !data) {
      return <div className='text-center text-red-500 py-4'>Error fetching customers</div>
   }
   return (
      <div className='flex flex-col'>
         <Header name='Customers'/>
         <DataGrid 
            rows={data}
            columns={columns}
         />
      </div>
   )
}

export default Customers