"use client"

import OverViewCards from "@/components/DashboardComponents/OverViewCards"
import SalesSummary from "@/components/DashboardComponents/SalesSummary"
import InventoryDisplay from "@/components/DashboardComponents/InventoryDisplay"
import PurchaseSummary from "@/components/DashboardComponents/PurchaseSummary"
import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useCreateOrUpdateUserMutation } from "../state/api"


export default function Dashboard() {
   const [createOrUpdateUser] = useCreateOrUpdateUserMutation()
   const {userId} = useAuth()

   useEffect(() => {
      if (userId) {
         createOrUpdateUser({userId})
      }
   }, [userId, createOrUpdateUser])

   return (
      <>
         <div className="min-h-screen bg-gray-50 p-8">
            <OverViewCards />
            <div className="grid gap-6 md:grid-cols-3">
               <SalesSummary />
               <InventoryDisplay />
               <PurchaseSummary  />
            </div> 
         </div>
      </>
   )
}