// modules/KacawPayModule/index.tsx
import { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import TopUpModal from "./components/TopUpModal";
import VoucherCard from "./components/VoucherCard";
import { loader } from "./loader";

export default function KacawPayModule() {
  const { wallet, vouchers } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState('wallet');
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Handle case when wallet data is not available
  if (!wallet) {
    return (
      <main className="px-4 py-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">KacawPay</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-500">Wallet data not available</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">KacawPay</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'wallet' ? 'border-b-2 border-primary font-semibold' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          My Wallet
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'vouchers' ? 'border-b-2 border-primary font-semibold' : ''}`}
          onClick={() => setActiveTab('vouchers')}
        >
          My Vouchers
        </button>
      </div>

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Wallet Balance</h2>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-green-500 text-black px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Top Up
            </button>
          </div>
          
          <div className="text-4xl font-bold mb-2">
            {/* Add null check before toLocaleString */}
            Rp {wallet?.balance?.toLocaleString('id-ID') || '0'}
          </div>
          
          {wallet?.lastTopUpDate && (
            <p className="text-gray-600">
              Last top up: {new Date(wallet.lastTopUpDate).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Vouchers</h2>
          
          {vouchers?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map((voucher: any) => (
                <VoucherCard 
                  key={voucher.id}
                  voucher={voucher}
                  isOwned={true}
                  dateAcquired={voucher.createdAt}
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
        walletBalance={wallet?.balance || 0}
        isLoading={false}
      />
    </main>
  );
}