import { useState } from "react";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import TopUpModal from "./components/TopUpModal";
import VoucherCard from "./components/VoucherCard";

export default function KacawPayModule() {
  const { wallet, vouchers, ownedVouchers } = useLoaderData();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const navigation = useNavigation();

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
        <button
          className={`px-4 py-2 ${activeTab === 'buy' ? 'border-b-2 border-primary font-semibold' : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          Buy Vouchers
        </button>
      </div>

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Wallet Balance</h2>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            >
              Top Up
            </button>
          </div>
          
          <div className="text-4xl font-bold mb-2">
            Rp {wallet.balance.toLocaleString('id-ID')}
          </div>
          
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      )}

      {/* My Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">My Vouchers</h2>
          
          {ownedVouchers.length === 0 ? (
            <p className="text-gray-500">You don't have any vouchers yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedVouchers.map((voucher: any) => (
                <VoucherCard 
                  key={voucher.id} 
                  voucher={voucher.voucher} 
                  isOwned 
                  dateAcquired={voucher.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buy Vouchers Tab */}
      {activeTab === 'buy' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Available Vouchers</h2>
          
          {vouchers.length === 0 ? (
            <p className="text-gray-500">No vouchers available at the moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map((voucher: any) => (
                <VoucherCard 
                  key={voucher.id} 
                  voucher={voucher} 
                  isOwned={false}
                  walletBalance={wallet.balance}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Up Modal */}
      <TopUpModal 
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        walletBalance={wallet.balance}
        isLoading={navigation.state === 'submitting'}
      />
    </main>
  );
}