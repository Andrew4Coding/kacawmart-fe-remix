import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return { balance: 100000, vouchers: ["Voucher A", "Voucher B"] };
};

export default function KacawPayDashboard() {
  const { balance, vouchers } = useLoaderData<typeof loader>();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#EFFDF8] flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[#009579] text-center mb-4">
          💰 Dashboard KACAWPay
        </h1>
        <p className="text-lg text-gray-700 text-center">
          Saldo Anda:{" "}
          <strong className="text-[#009579]">
            Rp{balance.toLocaleString()}
          </strong>
        </p>

        {/* Voucher List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[#009579]">🎟 Voucher Saya</h2>
          {vouchers.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {vouchers.map((voucher, index) => (
                <li
                  key={index}
                  className="bg-[#F4FFFB] border border-[#A4F6DA] text-[#009579] p-2 rounded-md text-center font-medium"
                >
                  {voucher}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-600">Belum ada voucher.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="w-full bg-[#009579] text-white py-2 rounded-lg shadow-md hover:bg-[#007a60] transition"
            onClick={() => setIsTopUpOpen(true)}
          >
            🔼 Top Up
          </button>
          <button className="w-full border border-[#009579] text-[#009579] py-2 rounded-lg shadow-md hover:bg-[#009579] hover:text-white transition">
            📜 Cek History Transaksi
          </button>
        </div>
      </div>

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold text-[#009579] text-center">🔼 Top Up</h2>
            <label className="block mt-4 text-sm font-medium text-gray-700">
              Masukkan Jumlah Top Up:
            </label>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-[#009579] focus:border-[#009579]"
            />

            <label className="block mt-4 text-sm font-medium text-gray-700">
              Upload Bukti Transaksi:
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />

            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                onClick={() => setIsTopUpOpen(false)}
              >
                Batal
              </button>
              <button
                className="bg-[#009579] text-white px-4 py-2 rounded-md hover:bg-[#007a60]"
                onClick={() => {
                  console.log("Top Up:", topUpAmount, "Bukti:", file);
                  setIsTopUpOpen(false);
                }}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
