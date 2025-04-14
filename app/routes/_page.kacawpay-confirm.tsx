import { useSearchParams, useNavigate } from "@remix-run/react";
import { useState } from "react";

export default function ConfirmPurchase() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const voucherId = searchParams.get("voucher");
  const [isProcessing, setIsProcessing] = useState(false);

  const vouchers = {
    "1": { name: "Voucher Makanan", price: 50000 },
    "2": { name: "Voucher Transportasi", price: 30000 },
  };

  const voucher = vouchers[voucherId as keyof typeof vouchers];

  const handlePurchase = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Pembelian berhasil!");
      navigate("/kacawpay");
    }, 2000);
  };

  return (
    <div className="modal">
      <h2>Konfirmasi Pembelian</h2>
      {voucher ? (
        <>
          <p>Anda akan membeli: <strong>{voucher.name}</strong></p>
          <p>Harga: <strong>Rp{voucher.price.toLocaleString()}</strong></p>
          <button onClick={handlePurchase} disabled={isProcessing}>
            {isProcessing ? "Memproses..." : "Konfirmasi"}
          </button>
          <button onClick={() => navigate("/kacawpay/buy")}>Batal</button>
        </>
      ) : (
        <p>Voucher tidak ditemukan.</p>
      )}
    </div>
  );
}
