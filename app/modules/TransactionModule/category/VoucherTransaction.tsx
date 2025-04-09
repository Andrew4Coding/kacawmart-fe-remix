import { Calendar, ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
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

export function VoucherTransactions({ transactionData }: {
    transactionData: TransactionData[];
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    // Filter voucher transactions
    const voucherTransactions = Object.values(transactionData)
        .filter(transaction => transaction.VoucherTransaction && transaction.VoucherTransaction.length > 0)
        .filter(transaction => !statusFilter || transaction.status === statusFilter)
        .filter(transaction =>
            !searchQuery ||
            transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.VoucherTransaction.some(voucher =>
                voucher.voucherId.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

    const totalPages = Math.ceil(voucherTransactions.length / itemsPerPage);
    const paginatedTransactions = voucherTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search by transaction ID or voucher ID..."
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
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Voucher ID</TableHead>
                            <TableHead>Discount ID</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((transaction) => (
                                <TableRow key={transaction.id} className="hover:bg-gray-50">
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
                                        <div className="flex items-center gap-2">
                                            <Ticket size={14} />
                                            <span>{transaction.VoucherTransaction[0]?.voucherId.substring(0, 10)}...</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {transaction.VoucherTransaction[0]?.voucher?.discountId.substring(0, 10)}...
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(transaction.VoucherTransaction[0]?.voucher?.price || 0)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No voucher transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, voucherTransactions.length)} of {voucherTransactions.length} transactions
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
