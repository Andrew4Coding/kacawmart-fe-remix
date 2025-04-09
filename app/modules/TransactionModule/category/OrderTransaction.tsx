import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Package } from 'lucide-react';
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import { formatCurrency, formatDate } from "~/lib/utils";
import { TransactionData } from "../interface";

export function OrderTransactions({ transactionData }: { transactionData: TransactionData[] }) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    // Filter order transactions
    const orderTransactions = Object.values(transactionData)
        .filter(transaction => transaction.OrderTransaction && transaction.OrderTransaction.length > 0)
        .filter(transaction => !statusFilter || transaction.status === statusFilter)
        .filter(transaction =>
            !searchQuery ||
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.OrderTransaction.some(order =>
                order.product?.some(p =>
                    p.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        );

    const totalPages = Math.ceil(orderTransactions.length / itemsPerPage);
    const paginatedTransactions = orderTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return "bg-green-100 text-green-800 hover:bg-green-100";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "FAILED":
                return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        }
    };

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-800 hover:bg-green-100";
            case "ON_DELIVERY":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        }
    };

    const calculateTotalPrice = (order: any) => {
        if (!order.product || order.product.length === 0) return 0;

        return order.product.reduce((total: number, item: any) => {
            const productPrice = item.product?.price || 0;
            const amount = item.amount || 0;
            return total + (productPrice * amount);
        }, 0);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search by ID or product name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Delivery Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((transaction) => (
                                <>
                                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleRowExpansion(transaction.id)}
                                            >
                                                {expandedRows[transaction.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-medium">{transaction.id.substring(0, 10)}...</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                <span>{formatDate(transaction.createdAt)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(transaction.status)}>
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.OrderTransaction[0]?.totalProduct || 0} items
                                        </TableCell>
                                        <TableCell>
                                            {transaction.OrderTransaction[0]?.deliveryStatus && (
                                                <Badge className={getDeliveryStatusColor(transaction.OrderTransaction[0].deliveryStatus)}>
                                                    {transaction.OrderTransaction[0].deliveryStatus}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(calculateTotalPrice(transaction.OrderTransaction[0]))}
                                        </TableCell>
                                    </TableRow>

                                    {expandedRows[transaction.id] && transaction.OrderTransaction.map((order, orderIndex) => (
                                        <TableRow key={`${transaction.id}-expanded-${orderIndex}`} className="bg-gray-50">
                                            <TableCell colSpan={7} className="p-0">
                                                <div className="p-4">
                                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                        <Package size={16} />
                                                        Order Details
                                                    </h4>
                                                    <div className="rounded-md border overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Product</TableHead>
                                                                    <TableHead>Quantity</TableHead>
                                                                    <TableHead className="text-right">Price</TableHead>
                                                                    <TableHead className="text-right">Subtotal</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {order.product?.map((item, itemIndex) => (
                                                                    <TableRow key={`${order.id}-product-${itemIndex}`}>
                                                                        <TableCell>
                                                                            <div className="font-medium">{item.product?.name.substring(0, 40)}...</div>
                                                                        </TableCell>
                                                                        <TableCell>{item.amount}</TableCell>
                                                                        <TableCell className="text-right">{formatCurrency(item.product?.price || 0)}</TableCell>
                                                                        <TableCell className="text-right">{formatCurrency((item.product?.price || 0) * item.amount)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                                <TableRow>
                                                                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                                                                    <TableCell className="text-right font-bold">{formatCurrency(calculateTotalPrice(order))}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No order transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, orderTransactions.length)} of {orderTransactions.length} transactions
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <div className="text-sm">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
