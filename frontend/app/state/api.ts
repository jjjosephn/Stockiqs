import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import exp from "constants";


export interface Users {
   userId: String,
   timestamp: String,
}

export interface Customers {
   customerId: string,
   userId: string,
   name: string,
   phoneNumber: string,
   instagram: string,
   streetAddress: string,
   city: string,
   state: string,
   zipCode: string
}

export interface NewCustomer {
   name: string,
   userId: string,
   phoneNumber: string,
   instagram: string,
   streetAddress: string,
   city: string,
   state: string,
   zipCode: string
}

export interface Purchases {
   purchaseId: string,
   userId: string,
   stockId?: string,
   archiveId?: string,
   timestamp: string
   psArchive: PSArchive
   productStock: ProductStock
}

export interface Product {
   productId: string,
   userId: string,
   name: string,
   image?: string,
   stock: ProductStock[]
   psArchive: PSArchive[]
}

export interface ProductsArchive {
   productsArchiveId: string,
   productId: string,
   name: string,
   timestamp: string,
   psArchive?: PSArchive[]
}

export interface ProductStock {
   stockId: string,
   productId: string,
   size: number,
   quantity: number 
   price: number,
   product?: Product
}

export interface NewProduct {
   name: string;
   userId: string,
   productId?: string;
   image?: string;
   stock: {
      size: number;
      quantity: number;
      price: number;
   }[];
}

export interface PSArchive {
   archiveId: string,
   stockId: string,
   productId: string,
   productsArchiveId: string,
   size: number,
   quantity: number 
   price: number,
   timestamp: string
   product?: Product
}

export interface Sales {
   saleId: string,
   userId: string,
   stockId: string,
   archiveId: string,
   customerId: string,
   productsArchiveId: string,
   quantity: number,
   salesPrice: number,
   timestamp: string
   productStock: ProductStock,
   psArchive: PSArchive[],
}

export interface NewSale {
   stockId: string,
   userId: string,
   archiveId: string,
   customerId: string,
   quantity: number,
   salesPrice: number,
   timestamp: string
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
   reducerPath: "api",
   tagTypes: [ 'Products', 'Customers', 'Sales', 'Purchases'],
   endpoints: (build) => ({
      // Products
      getProducts: build.query<Product[], { search?: string; userId?: string }>({
         query: ({ search, userId } = {}) => ({
           url: `/products/${userId ?? ''}`,  
           params: search ? { search } : {} 
         }),
         providesTags: ['Products']
       }),
      getProductsArchive: build.query<ProductsArchive[], void>({
         query: () => '/products/archive',
         providesTags: ['Products']
      }),
      createProduct: build.mutation<Product, NewProduct>({
         query: (newProduct) => ({
            url: '/products',
            method: 'POST',
            body: {
               name: newProduct.name,
               stock: newProduct.stock,
               image: newProduct.image
            }
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
      updateProduct: build.mutation<Product, Partial<Product>>({
         query: ({ productId, ...updatedFields }) => ({
            url: `/products/${productId}`,
            method: 'PUT',
            body: updatedFields,
         }),
         invalidatesTags: ['Products']
      }),

      // Product Stocks
      updateProductStock: build.mutation<Product, { productId: string, stock: ProductStock[] }>({
         query: ({ productId, stock }) => ({
            url: `/products/${productId}/stock`,
            method: 'POST',
            body: { stock },
         }),
         invalidatesTags: ['Products'],
      }),
      deleteProductStock: build.mutation<Product, { productId: string, stockId: string }>({
         query: ({ productId, stockId }) => ({
            url: `/products/${productId}/stock/${stockId}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['Products'],
      }),
      updateProductStockAfterSale: build.mutation<Product, { stockId: string, quantity: number }>({
         query: ({ stockId, quantity }) => ({
            url: `/products/stock/${stockId}`,
            method: 'POST',
            body: { quantity },
         }),
         invalidatesTags: ['Products']
      }),
      deleteProductStockAfterSale: build.mutation<Product, { stockId: string }>({
         query: ({ stockId }) => ({
            url: `/products/stock/${stockId}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['Products']
      }),

      // Customers
      getCustomers: build.query<Customers[], { userId?: string }>({
         query: ({ userId = '' } = {}) => ({
           url: `/customers/${userId}`,
         }),
         providesTags: ['Customers'],
       }),
      getCustomer: build.query<Customers, { userId: string; customerId: string }>({
         query: ({ userId, customerId }) => ({
            url: `/customers/${userId}/${customerId}`,
         }),
      }),
      createCustomer: build.mutation<Customers[], NewCustomer>({
         query: (newCustomer) => ({
            url: '/customers',
            method: 'POST',
            body: newCustomer
         }),
         invalidatesTags: ['Customers']
      }),
      deleteCustomer: build.mutation<void, string>({
         query: (customerId) => ({
            url: `/customers/${customerId}`,
            method: 'DELETE'
         }),
         invalidatesTags: ['Customers']
      }),
      updateCustomer: build.mutation<Customers, Partial<Customers>>({
         query: ({ customerId, ...updatedFields }) => ({
            url: `/customers/${customerId}`,
            method: 'PUT',
            body: updatedFields
         }),
         invalidatesTags: ['Customers']
      }),

      // Sales
      newSale: build.mutation<Sales, NewSale>({
         query: (saleData) => ({
           url: '/sales',
           method: 'POST',
           body: saleData,
         }),
         invalidatesTags: ['Sales'],
      }),
      getSales: build.query<Sales[], void>({
         query: () => '/sales',
         providesTags: ['Sales'],
      }),

      //Purchases
      getPurchases: build.query<Purchases[], void>({
         query: () => '/purchases',
         providesTags: ['Purchases']
      }),
   }),
})

export const { 
   useGetProductsQuery, 
   useGetProductsArchiveQuery,
   useCreateProductMutation, 
   useDeleteProductMutation,
   useUpdateProductMutation,
   useUpdateProductStockMutation,
   useDeleteProductStockMutation,
   useUpdateProductStockAfterSaleMutation,
   useDeleteProductStockAfterSaleMutation,
   useGetCustomersQuery,
   useGetCustomerQuery,
   useDeleteCustomerMutation,
   useCreateCustomerMutation,
   useUpdateCustomerMutation,
   useNewSaleMutation,
   useGetSalesQuery,
   useGetPurchasesQuery
} = api;