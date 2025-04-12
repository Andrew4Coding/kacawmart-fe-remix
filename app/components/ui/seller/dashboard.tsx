// The main container component for the dashboard
// Manages the active page state (Products or Orders) and renders the appropriate page component
// Controls the overall layout and navigation between main sections

"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ProductsPage } from "./products-page"
import { OrdersPage } from "./orders-page"

export default function Dashboard() {
  const [activePage, setActivePage] = useState<"products" | "orders">("products")

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-auto">{activePage === "products" ? <ProductsPage /> : <OrdersPage />}</div>
    </div>
  )
}