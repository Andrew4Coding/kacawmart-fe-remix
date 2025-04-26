import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { toast } from "sonner";
import AvailableVouchersModal from "./components/AvailableVouchersModal";
import BuyVoucherModal from "./components/BuyVoucherModal";
import TopUpModal from "./components/TopUpModal";
import VoucherCard from "./components/VoucherCard";
import { loader } from "./loader";
import { Voucher } from "./type";

export default function KacawPayModule() {
  const { wallet, vouchers } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("wallet");
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showBuyVoucherModal, setShowBuyVoucherModal] = useState(false);
  const [showAvailableVouchersModal, setShowAvailableVouchersModal] =
    useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const submit = useSubmit();

  const handleBuyVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowBuyVoucherModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedVoucher) return;

    setIsProcessing(true);

    const response = await fetch(`/api/voucher/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: document.cookie,
      },
      credentials: "include",
      body: JSON.stringify({
        voucherId: selectedVoucher.id,
      }),
    });

    setIsProcessing(false);

    if (!response.ok) {
      return toast.error("Error!");
    }

    // Tutup modal pembelian
    setShowBuyVoucherModal(false);

    // Tampilkan modal success
    setShowSuccessModal(true);

    // Reset selected voucher
    setSelectedVoucher(null);
  };

  // Handle case when wallet data is not available
  if (!wallet) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">KacawPay</h1>
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-600">Wallet data not available</p>
        </div>
      </div>
    );
  }

  // Ensure vouchers is an array
  const voucherList = Array.isArray(vouchers) ? vouchers : [];

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">KacawPay</h1>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === "wallet" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("wallet")}
        >
          My Wallet
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "vouchers" ? "border-b-2 border-blue-500 font-bold" : ""}`}
          onClick={() => setActiveTab("vouchers")}
        >
          My Vouchers
        </button>
      </div>

      {/* Wallet Tab */}
      {activeTab === "wallet" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Wallet Balance</h2>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-green-500 text-black px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Top Up
            </button>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold">
              Rp{" "}
              {typeof wallet.balance === "number"
                ? wallet.balance.toLocaleString("id-ID")
                : "0"}
            </p>
          </div>

          {wallet.lastTopUpDate && (
            <div className="mt-2 text-gray-600 text-sm">
              Last top up: {new Date(wallet.lastTopUpDate).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === "vouchers" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Vouchers</h2>
            <button
              onClick={() => setShowAvailableVouchersModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Buy Voucher
            </button>
          </div>

          {voucherList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voucherList.map((item, index) => (
                <VoucherCard
                  key={item.id || `voucher-${index}`}
                  voucher={item}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No vouchers available</p>
          )}
        </div>
      )}

      {/* Show processing state */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg">Processing your purchase...</p>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        walletBalance={wallet.balance || 0}
      />

      {/* Available Vouchers Modal */}
      <AvailableVouchersModal
        isOpen={showAvailableVouchersModal}
        onClose={() => setShowAvailableVouchersModal(false)}
        onSelectVoucher={handleBuyVoucher}
        walletBalance={wallet.balance || 0}
      />

      {/* Buy Voucher Confirmation Modal */}
      <BuyVoucherModal
        isOpen={showBuyVoucherModal}
        onClose={() => {
          setShowBuyVoucherModal(false);
          setSelectedVoucher(null);
        }}
        onConfirm={confirmPurchase}
        voucher={selectedVoucher}
        walletBalance={wallet.balance || 0}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Purchase Voucher Success
              </h2>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="mb-6 flex justify-center items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600">
                Your voucher has been successfully purchased!
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowAvailableVouchersModal(false);
                  setShowSuccessModal(false);
                  setActiveTab("vouchers");
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
