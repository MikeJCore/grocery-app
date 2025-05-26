import React, { useState } from 'react';
import { CheckCircle, DollarSign, CreditCard, Camera } from 'lucide-react';
import { useListStore } from '../../store/listStore';

interface CompleteShoppingFormProps {
  listId: string;
  onClose: () => void;
}

const CompleteShoppingForm: React.FC<CompleteShoppingFormProps> = ({ listId, onClose }) => {
  const [totalSpent, setTotalSpent] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [receiptUrl, setReceiptUrl] = useState('');
  
  const { completeList, isLoading } = useListStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await completeList(
        listId, 
        parseFloat(totalSpent), 
        paymentMethod, 
        receiptUrl || undefined
      );
      onClose();
    } catch (error) {
      console.error('Failed to complete shopping:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
        <h2 className="text-lg font-semibold">Complete Shopping</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="total-spent" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              Total Spent
            </div>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              type="number"
              id="total-spent"
              step="0.01"
              min="0"
              value={totalSpent}
              onChange={(e) => setTotalSpent(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <CreditCard size={16} className="mr-1" />
              Payment Method
            </div>
          </label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="receipt-url" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <Camera size={16} className="mr-1" />
              Receipt Photo URL (optional)
            </div>
          </label>
          <input
            type="url"
            id="receipt-url"
            value={receiptUrl}
            onChange={(e) => setReceiptUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="https://example.com/receipt.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter a URL to an image of your receipt
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isLoading ? 'Completing...' : 'Complete Shopping'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteShoppingForm;