import { Link } from "@remix-run/react";

export default function BuyVoucher() {
  const vouchers = [
    { id: 1, name: "Voucher Makanan", price: 50000 },
    { id: 2, name: "Voucher Transportasi", price: 30000 },
  ];

  return (
    <div className="min-h-screen bg-[#EFFDF8] flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#009579] text-center mb-4">
          🎟 Beli Voucher
        </h1>
        <ul className="space-y-4">
          {vouchers.map((voucher) => (
            <li
              key={voucher.id}
              className="bg-[#009579] text-white p-4 rounded-lg flex justify-between items-center"
            >
              <span className="text-lg">{voucher.name}</span>
              <div className="text-right">
                <p className="font-semibold">Rp{voucher.price.toLocaleString()}</p>
                <Link to={`/kacawpay/confirm?voucher=${voucher.id}`}>
                  <button className="mt-2 bg-white text-[#009579] font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-200 transition">
                    Beli
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
