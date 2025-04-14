import { useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";

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
          <Button
            onClick={() => setIsTopUpOpen(true)}
          >
            Top Up
          </Button>
          <Link
            to={'/transaction'}
            className="w-full"
          >
            <Button
              variant={'outline'}
              className="w-full"
            >
              Cek History Transaksi
            </Button>
          </Link>
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
              <Button
                variant={'destructive'}
                onClick={() => setIsTopUpOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  console.log("Top Up:", topUpAmount, "Bukti:", file);
                  setIsTopUpOpen(false);
                }}
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
