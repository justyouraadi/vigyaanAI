import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { CheckCircle, Download, FileText, Loader2, ArrowRight } from 'lucide-react';
import UpsellSection from '../components/UpsellSection';
import SEOHead from '../components/SEOHead';
let confetti;
try {
  confetti = require('canvas-confetti');
} catch (e) {
  confetti = () => {};
}

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      pollStripeStatus();
    } else if (orderId) {
      fetchOrder();
    }
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const pollStripeStatus = async (attempts = 0) => {
    if (attempts >= 5) {
      setError('Payment verification timed out. Please check your dashboard.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/payments/stripe/status/${sessionId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.payment_status === 'paid') {
          // Payment confirmed, fetch order details
          const ordersResponse = await fetch(`${API_URL}/orders/my-orders`, {
            credentials: 'include'
          });
          
          if (ordersResponse.ok) {
            const orders = await ordersResponse.json();
            const completedOrder = orders.find(o => o.status === 'completed');
            if (completedOrder) {
              setOrder(completedOrder);
            }
          }
          setLoading(false);
        } else if (data.status === 'expired') {
          setError('Payment session expired. Please try again.');
          setLoading(false);
        } else {
          // Continue polling
          setTimeout(() => pollStripeStatus(attempts + 1), 2000);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => pollStripeStatus(attempts + 1), 2000);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-[#50C878] mb-4" />
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-yellow-50 rounded-2xl p-8">
            <p className="text-yellow-800 mb-4">{error}</p>
            <Link to="/dashboard/purchases">
              <Button className="bg-[#50C878]">Check Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="payment-success-page">
      <SEOHead title="Payment Successful" path="/payment/success" />
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 mb-8">
            Thank you for your purchase. Your ebook is ready to download.
          </p>

          {order && (
            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID</span>
                  <span className="text-slate-900 font-mono">{order.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ebook</span>
                  <span className="text-slate-900">{order.ebook_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="text-slate-900">₹{order.amount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Invoice Download */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <a
                  href={`${API_URL}/invoice/${order.order_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#50C878] hover:underline"
                  data-testid="download-invoice-btn"
                >
                  <FileText className="w-4 h-4" />
                  Download Invoice (PDF)
                </a>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-500 mb-6">
            A download link has been sent to your email. You can also access your purchase from your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard/purchases">
              <Button className="bg-[#50C878] hover:bg-[#3CB371] w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Go to My Purchases
              </Button>
            </Link>
            <Link to="/ebooks">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse More Ebooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Upsell Recommendations */}
        {order?.ebook_id && <UpsellSection ebookId={order.ebook_id} />}
      </div>
    </div>
  );
};

// Mock confetti if not available
// (Confetti loaded dynamically above)

export default PaymentSuccessPage;
