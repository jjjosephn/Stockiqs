import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
   productId: string,
   name: string,
   price: number,
   rating?: number,
   stockQuantity: number,
}

export interface NewProduct {
   name: string,
   price: number,
   rating?: number,
   stockQuantity: number,
}

export interface SaleSummary {
   saleSummaryId: string,
   totalValue: number,
   changePercentage?: number,
   date: string
}

export interface PurchaseSummary {
   purchaseSummaryId: string,
   totalPurchased: number,
   changePercentage?: number,
   date: string
}

export interface ExpenseSummary {
   expenseSummaryId: string,
   totalExpenses: number,
   date: string
}

export interface ExpenseByCategorySummary {
   expenseByCategorySummaryId: string,
   category: string,
   amount: string,
   date: string
}

export interface DashboardMetrics {
   popularProducts: Product[],
   saleSummary: SaleSummary[],
   purchaseSummary: PurchaseSummary[],
   expenseSummary: ExpenseSummary[],
   expenseByCategorySummary: ExpenseByCategorySummary[]
}

export interface Customers {
   userId: string,
   name: string,
   email: string
}

export interface NewCustomer {
   name: string,
   email: string
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
   reducerPath: "api",
   tagTypes: ['DashboardMetrics', 'Products', 'Customers'],
   endpoints: (build) => ({
      getDashboardMetrics: build.query<DashboardMetrics, void>({
         query: () => '/dashboard',
         providesTags: ['DashboardMetrics']
      }),
      getProducts: build.query<Product[], string | void>({
         query: (search) => ({
            url: '/products',
            params: search ? { search } : {}
         }),
         providesTags: ['Products']
      }),
      createProduct: build.mutation<Product, NewProduct>({
         query: (newProduct) => ({
            url: '/products',
            method: 'POST',
            body: newProduct
         }),
         invalidatesTags: ['Products']
      }),
      deleteProduct: build.mutation<void, string>({
         query: (productId) => ({
            url: `/products/${productId}`,
            method: 'DELETE'
         }),
         invalidatesTags: ['Products']
      }),
      getCustomers: build.query<Customers[], void>({
         query: () => '/customers',
         providesTags: ['Customers']
      }),
      createCustomer: build.mutation<Customers[], NewCustomer>({
         query: (newCustomer) => ({
            url: '/customers',
            method: 'POST',
            body: newCustomer
         }),
         invalidatesTags: ['Customers']
      }),
   }),
})

export const { 
   useGetDashboardMetricsQuery, 
   useGetProductsQuery, 
   useCreateProductMutation, 
   useDeleteProductMutation,
   useGetCustomersQuery,
   useCreateCustomerMutation
} = api;