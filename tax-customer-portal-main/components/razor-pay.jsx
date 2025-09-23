// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import {BASE_URL} from "../src/components/BaseUrl"

export default function RazorpayPayment() {
  const [amount, setAmount] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const payNow = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    setIsLoading(true);

    try {
      // Create order by calling your Express backend endpoint
      const response = await fetch(`${BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount),
          currency: 'INR', 
          receipt: `rcpt_${Date.now()}`,
          notes: {},
          invoice_id: invoiceId || `inv_${Date.now()}`,
          createdby_type: 'user',
          createdby_id: '12345' // Replace with actual user ID
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Your Company Name',
          description: 'Test Transaction',
          order_id: order.id,
          callback_url: 'http://localhost:3005/payment-success',
          prefill: {
            name: 'Your Name',
            email: 'your.email@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#F37254'
          },
          handler: async function (response) {
            try {
              const verifyResponse = await fetch(`${BASE_URL}/api/verify-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const data = await verifyResponse.json();

              if (data.status === 'ok') {
                window.location.href = '/payment-success';
              } else {
                alert('Payment verification failed');
              }
            } catch (error) {
              console.error('Error:', error);
              alert('Error verifying payment');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating payment order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Razorpay Payment Gateway</title>
      </Head>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Razorpay Payment Gateway Integration
        </h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700 mb-2">
              Invoice ID (Optional)
            </label>
            <input
              type="text"
              id="invoiceId"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter invoice ID"
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (INR)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              required
              min="1"
              step="0.01"
            />
          </div>
          
          <button
            type="button"
            onClick={payNow}
            disabled={isLoading || !amount}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}