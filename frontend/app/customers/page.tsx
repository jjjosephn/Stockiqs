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

   const columns: GridColDef[] = [
      { field: 'userId', headerName: 'ID', width: 300 },
      { field: 'name', headerName: 'Name', width: 300 },
      { field: 'email', headerName: 'Email', width: 300 },
   ]

   return (
      <div className='flex flex-col'>
         <Header name='Customers'/>
         <DataGrid 
            rows={data}
            columns={columns}
            getRowId={((row) => row.userId)}
            className='mt-6'
         />
      </div>
   )
}

export default Customers