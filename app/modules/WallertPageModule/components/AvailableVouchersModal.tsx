import { useEffect, useState } from "react";
import { Voucher } from "../type";

export default function AvailableVouchersModal({
  isOpen,
  onClose,
  onSelectVoucher,
  walletBalance,
}: AvailableVouchersModalProps) {
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableVouchers();
    }
  }, [isOpen]);

  const fetchAvailableVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/voucher");
      const data = await response.json();

      // Convert object-with-numeric-keys to array
      const vouchers = Object.values(data) as Voucher[];
      setAvailableVouchers(vouchers);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* ... header ... */}

        {isLoading ? (
          <p>Loading vouchers...</p>
        ) : availableVouchers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {availableVouchers.map((voucher) => (
              <div key={voucher.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">
                  {voucher.discount?.code || "Voucher"}
                </h3>
                <p>Price: Rp {voucher.price.toLocaleString("id-ID")}</p>
                {voucher.discount && (
                  <>
                    <p>Value: {voucher.discount.value}</p>
                    <p>
                      Expires:{" "}
                      {new Date(
                        voucher.discount.expiredAt,
                      ).toLocaleDateString()}
                    </p>
                  </>
                )}
                <button
                  onClick={() => onSelectVoucher(voucher)}
                  className={`mt-2 px-4 py-2 rounded ${
                    walletBalance >= voucher.price
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Buy this voucher
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No vouchers available for purchase</p>
        )}
      </div>
    </div>
  );
}

interface AvailableVouchersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVoucher: (voucher: Voucher) => void;
  walletBalance: number;
}
