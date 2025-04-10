import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { OrderTransactions } from "./category/OrderTransaction";
import { VoucherTransactions } from "./category/VoucherTransaction";
import { WalletTransactions } from "./category/WalletTransaction";
import { TransactionData } from "./interface";

export default function TransactionModule() {
    const [activeTab, setActiveTab] = useState("orders");

    const data: TransactionData[] = useLoaderData();

    return (
        <div className="container mx-auto py-32">
            <Card className="border-none shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
                    <CardDescription>
                        View and manage all your transactions in one place
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="orders" className="text-sm md:text-base">
                                Order Transactions
                            </TabsTrigger>
                            <TabsTrigger value="vouchers" className="text-sm md:text-base">
                                Voucher Transactions
                            </TabsTrigger>
                            <TabsTrigger value="wallet" className="text-sm md:text-base">
                                Wallet Transactions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders" className="mt-0">
                            <OrderTransactions
                                transactionData={data}
                            />
                        </TabsContent>

                        <TabsContent value="vouchers" className="mt-0">
                            <VoucherTransactions
                                transactionData={data}
                            />
                        </TabsContent>

                        
                        <TabsContent value="wallet" className="mt-0">
                            <WalletTransactions
                                transactionData={data}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
