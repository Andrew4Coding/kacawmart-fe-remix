// modules/KacawPayModule/components/BuyVoucherModal.tsx
import { Voucher } from "../type";

interface BuyVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucher: Voucher | null;
  walletBalance: number;
}

export default function BuyVoucherModal({
  isOpen,
  onClose,
  onConfirm,
  voucher,
  walletBalance,
}: BuyVoucherModalProps) {
  if (!isOpen || !voucher) return null;

  const isBalanceEnough = walletBalance >= voucher.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isBalanceEnough ? "Confirm Purchase" : "Insufficient Balance"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {isBalanceEnough ? (
          <>
            <p>Are you sure you want to buy this voucher?</p>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold">{voucher.discount.code}</h3>
              <p>Price: Rp {voucher.price.toLocaleString('id-ID')}</p>
              <p>Your balance: Rp {walletBalance.toLocaleString('id-ID')}</p>
              <p className="mt-2">
                Balance after purchase: Rp {(walletBalance - voucher.price).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm Purchase
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Sorry, your balance is not enough to purchase this voucher.</p>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold">{voucher.discount.code}</h3>
              <p>Price: Rp {voucher.price.toLocaleString('id-ID')}</p>
              <p>Your balance: Rp {walletBalance.toLocaleString('id-ID')}</p>
              <p className="mt-2 text-red-500">
                You need additional Rp {(voucher.price - walletBalance).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}