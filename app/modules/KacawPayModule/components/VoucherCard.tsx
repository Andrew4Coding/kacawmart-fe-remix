// modules/KacawPayModule/components/VoucherCard.tsx
import { useState } from "react";

// Define TypeScript interfaces based on your schema
interface Discount {
  id: string;
  code: string;
  value: number;
  expiredAt: string;
  maxUsage: number;
  usageCount: number;
}

interface Voucher {
  id: string;
  price: number;
  discountId: string;
  discount: Discount;
}

interface Transaction {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface VoucherTransaction {
  id: string;
  voucherId: string;
  transactionId: string;
  voucher: Voucher;
  transaction: Transaction;
}

interface VoucherCardProps {
  voucher: Voucher | VoucherTransaction;
}

export default function VoucherCard({ voucher }: VoucherCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Safety check
  if (!voucher) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        Invalid voucher data
      </div>
    );
  }
  
  // Handle both possible data structures
  // 1. It could be a VoucherTransaction with voucher property
  // 2. It could be a direct Voucher object
  const actualVoucher = 'voucher' in voucher ? voucher.voucher : voucher;
  const transaction = 'transaction' in voucher ? voucher.transaction : null;
  
  // Get discount safely
  const discount = actualVoucher.discount || {};
  
  // Calculate if voucher is expired
  const expiredAt = discount.expiredAt ? new Date(discount.expiredAt) : null;
  const isExpired = expiredAt ? expiredAt < new Date() : false;
  
  // Transaction data
  const isPurchased = !!transaction;
  const purchaseDate = transaction?.createdAt ? new Date(transaction.createdAt) : null;
  
  // Discount usage
  const maxUsage = discount.maxUsage || 0;
  const usageCount = discount.usageCount || 0;
  const remaining = maxUsage - usageCount;
  
  // Format discount value
  const discountValue = discount.value ? `Rp ${discount.value.toLocaleString('id-ID')}` : 'N/A';

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${isExpired ? 'opacity-60' : ''}`}>
      <div className="bg-blue-100 p-4">
        <h3 className="text-lg font-semibold">Voucher</h3>
        {discount.code && (
          <p className="text-sm font-mono bg-gray-100 p-1 rounded mt-1">{discount.code}</p>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Discount Value:</span>
          <span className="font-semibold">{discountValue}</span>
        </div>
        
        {actualVoucher.price !== undefined && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold">
              Rp {actualVoucher.price.toLocaleString('id-ID')}
            </span>
          </div>
        )}
        
        {expiredAt && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Expires:</span>
            <span className={`font-semibold ${isExpired ? 'text-red-500' : ''}`}>
              {expiredAt.toLocaleDateString()}
            </span>
          </div>
        )}
        
        {maxUsage > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Available:</span>
            <span className="font-semibold">{remaining} of {maxUsage}</span>
          </div>
        )}
        
        {isPurchased && purchaseDate && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Purchased:</span>
              <span>{purchaseDate.toLocaleDateString()}</span>
            </div>
            
            {transaction?.status && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Status:</span>
                <span className={transaction.status === 'SUCCESS' ? 'text-green-600' : 'text-yellow-600'}>
                  {transaction.status}
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 flex justify-between">
          <div>
            {actualVoucher.id && (
              <p className="text-xs text-gray-500">ID: {actualVoucher.id.substring(0, 8)}...</p>
            )}
          </div>
          {/* <button 
            className="text-blue-500 text-sm"
            onClick={() => setShowTopUpModal ? setShowTopUpModal(true) : null}
          >
            Use Voucher
          </button> */}
        </div>
      </div>
    </div>
  );
}