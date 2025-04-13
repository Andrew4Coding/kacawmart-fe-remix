// modules/KacawPayModule/index.tsx
import { useState } from "react";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import TopUpModal from "./components/TopUpModal";
import VoucherCard from "./components/VoucherCard";
import { loader } from "./loader";
import AvailableVouchersModal from "./components/AvailableVouchersModal";
import BuyVoucherModal from "./components/BuyVoucherModal";
import { Voucher } from "./type";


export default function KacawPayModule() {
  const { wallet, vouchers } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('wallet');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showBuyVoucherModal, setShowBuyVoucherModal] = useState(false);
  const [showAvailableVouchersModal, setShowAvailableVouchersModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const fetcher = useFetcher();

  const handleBuyVoucher = (voucher: Voucher) => { // Added type annotation
    setSelectedVoucher(voucher);
    if (wallet.balance >= voucher.price) {
      setShowBuyVoucherModal(true);
    } else {
      setShowBuyVoucherModal(true);
    }
  };

  const confirmPurchase = () => {
    if (!selectedVoucher) return;
    
    fetcher.submit(
      JSON.stringify({ voucherId: selectedVoucher.id }), // Stringify the payload
      {
        method: "POST",
        action: "/api/vouchers/purchase",
        encType: "application/json", // Set content type
      }
    );
    setShowBuyVoucherModal(false);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">KacawPay</h1>
      
      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'wallet' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          My Wallet
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'vouchers' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('vouchers')}
        >
          My Vouchers
        </button>
      </div>

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
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
              Rp {typeof wallet.balance === 'number' ? wallet.balance.toLocaleString('id-ID') : '0'}
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
      {activeTab === 'vouchers' && (
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
        isOpen={showBuyVoucherModal} // Fixed: pass the state value, not the setter
        onClose={() => {
          setShowBuyVoucherModal(false);
          setSelectedVoucher(null);
        }}
        onConfirm={confirmPurchase}
        voucher={selectedVoucher}
        walletBalance={wallet.balance || 0}
      />
    </div>
  );
}

