"use client"
import { Package, ShoppingCart } from "lucide-react"
import { cn } from "~/lib/utils"

interface SidebarProps {
  activePage: "products" | "orders"
  setActivePage: (page: "products" | "orders") => void
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <div className="w-[200px] bg-white border-r h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-emerald-700">KACAWmart</h1>
      </div>
      <div className="flex flex-col p-4 space-y-2">
        <button
          className={cn(
            "flex items-center gap-2 p-2 rounded-md hover:bg-slate-100",
            activePage === "products" && "bg-slate-100",
          )}
          onClick={() => setActivePage("products")}
        >
          <Package className="h-4 w-4" />
          <span>Products</span>
        </button>
        <button
          className={cn(
            "flex items-center gap-2 p-2 rounded-md hover:bg-slate-100",
            activePage === "orders" && "bg-slate-100",
          )}
          onClick={() => setActivePage("orders")}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Orders</span>
        </button>
      </div>
    </div>
  )
}
