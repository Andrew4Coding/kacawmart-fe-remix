import { Form } from "@remix-run/react";

export default function TopUpModal({ isOpen, onClose, walletBalance, isLoading }: {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Top Up KacawPay</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <Form method="post" action="/actions/topup" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              min="10000"
              step="10000"
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
              name="proofUrl"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://example.com/proof.jpg"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit Top Up'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}