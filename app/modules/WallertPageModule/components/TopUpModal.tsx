import React, { useState } from "react";
import { useFetcher } from "@remix-run/react";

export default function TopUpModal({
  isOpen,
  onClose,
  walletBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
}) {
  const [amount, setAmount] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!amount || !proofUrl) {
      setErrorMessage("Please fill all fields");
      return;
    }

    try {
      // Submit the form
      fetcher.submit(
        { amount: Number(amount), proofUrl },
        {
          method: "post",
          action: "/api/wallet/topup",
          encType: "application/json",
        },
      );

      // Immediately show success message without waiting for response
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage("Failed to submit top-up request");
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setIsSuccess(false);
    setAmount("");
    setProofUrl("");
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Top Up KacawPay</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-green-500"
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
              <h3 className="text-green-700 font-semibold text-lg mb-2">
                Top-up Request Successful!
              </h3>
              <p className="text-green-600">
                Successfully submitted top-up request. Please wait for the admin
                to approve.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof of Payment (URL)
              </label>
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com/proof.jpg"
                required
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Submit Top Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
