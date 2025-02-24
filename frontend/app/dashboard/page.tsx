"use client"

import OverViewCards from "@/components/DashboardComponents/OverViewCards"
import SalesSummary from "@/components/DashboardComponents/SalesSummary"
import InventoryDisplay from "@/components/DashboardComponents/InventoryDisplay"
import PurchaseSummary from "@/components/DashboardComponents/PurchaseSummary"
import Header from "@/components/Header"


export default function Dashboard() {
   return (
      <>
         <Header name="Dashboard" />
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