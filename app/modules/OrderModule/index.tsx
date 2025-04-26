"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import OrderCard from "./components/card";
import Pagination from "./components/pagination";
import { Link } from "@remix-run/react";
import { useState } from "react";

interface OrderProduct {
  id: string;
  amount: number;
  price: number;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    ratingCount: number;
    productRating: number;
    stock: number;
  } | null;
}

interface Order {
  id: string;
  deliveryStatus: string;
  totalPrice: number;
  totalProduct: number;
  transactionId: string;
  discountId: string | null;
  createdAt: string;
  updatedAt: string;
  product: OrderProduct[] | null;
}

export default function OrderModule({ orders }: { orders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Add additional check to prevent mapping on undefined
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen pt-40 p-20">
        <div className="flex justify-between mb-10">
          <h1 className="font-libre font-bold text-2xl">Orders</h1>
        </div>
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      </div>
    );
  }

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryStatus.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-40 p-20 space-y-10">
      <div className="flex justify-between">
        <h1 className="font-libre font-bold text-2xl">All Orders</h1>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search orders..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <Pagination
        currentPage={1}
        totalPages={Math.ceil(orders.length / 9)}
        onPageChange={(page) => {
          console.log(`Page changed to: ${page}`);
        }}
      />
    </div>
  );
}
