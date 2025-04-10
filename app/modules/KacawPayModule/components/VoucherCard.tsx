import { Form } from "@remix-run/react";

export default function VoucherCard({ 
  voucher, 
  isOwned, 
  dateAcquired, 
  walletBalance 
}: {
  voucher: any;
  isOwned: boolean;
  dateAcquired?: string;
  walletBalance?: number;
}) {
  const canBuy = !isOwned && walletBalance && walletBalance >= voucher.price;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{voucher.discount.code}</h3>
        {!isOwned && (
          <span className="bg-primary text-white text-sm px-2 py-1 rounded">
            Rp {voucher.price.toLocaleString('id-ID')}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-2">
        Discount: {voucher.discount.value}%
      </p>
      
      <p className="text-sm text-gray-500 mb-3">
        Expires: {new Date(voucher.discount.expiredAt).toLocaleDateString()}
      </p>
      
      {isOwned && dateAcquired && (
        <p className="text-xs text-gray-400">
          Acquired: {new Date(dateAcquired).toLocaleDateString()}
        </p>
      )}
      
      {!isOwned && (
        <Form method="post" action="/actions/buy-voucher">
          <input type="hidden" name="voucherId" value={voucher.id} />
          <button
            type="submit"
            disabled={!canBuy}
            className={`w-full mt-2 py-2 rounded-md text-sm ${
              canBuy 
                ? 'bg-primary text-white hover:bg-primary-dark' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canBuy ? 'Purchase' : 'Insufficient Balance'}
          </button>
        </Form>
      )}
    </div>
  );
}