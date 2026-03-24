import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  CreditCard, Shield, Clock, CheckCircle, Tag, 
  Loader2, ArrowLeft, Percent
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchOrderDetails();
  }, [orderId, user]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
        
        // Fetch ebook details
        const ebookResponse = await fetch(`${API_URL}/ebooks/id/${orderData.ebook_id}`);
        if (ebookResponse.ok) {
          const ebookData = await ebookResponse.json();
          setEbook(ebookData);
        }
      } else {
        toast.error('Order not found');
        navigate('/ebooks');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setApplyingCoupon(true);
    try {
      const response = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, amount: order.amount })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCouponApplied(data);
        toast.success(`Coupon applied! You save ₹${data.discount_amount}`);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_URL}/payments/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order_id: orderId })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data = await response.json();
      
      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: data.currency,
        name: 'VigyaanKart',
        description: ebook?.title || 'Ebook Purchase',
        order_id: data.razorpay_order_id,
        handler: async function(response) {
          try {
            const verifyResponse = await fetch(`${API_URL}/payments/razorpay/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId
              })
            });

            if (verifyResponse.ok) {
              toast.success('Payment successful!');
              navigate(`/payment/success?order_id=${orderId}`);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#50C878'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`${API_URL}/payments/stripe/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          order_id: orderId,
          origin_url: window.location.origin
        })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkout_url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe error:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleStripePayment();
    }
  };

  const finalAmount = couponApplied ? couponApplied.final_amount : order?.amount;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="checkout-page">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-[#50C878] mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
            
            {ebook && (
              <div className="flex gap-4 mb-6">
                <img 
                  src={ebook.cover_image}
                  alt={ebook.title}
                  className="w-24 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-slate-900">{ebook.title}</h3>
                  <Badge className="mt-2 bg-green-50 text-[#50C878] border-0">
                    {ebook.category}
                  </Badge>
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{order?.amount?.toLocaleString()}</span>
              </div>
              
              {couponApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    Discount
                  </span>
                  <span>-₹{couponApplied.discount_amount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-semibold text-slate-900 pt-3 border-t border-slate-100">
                <span>Total</span>
                <span>₹{finalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mt-6">
              <Label className="text-sm text-slate-600">Have a coupon code?</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="uppercase"
                  data-testid="coupon-input"
                />
                <Button 
                  onClick={applyCoupon}
                  disabled={applyingCoupon || !couponCode}
                  variant="outline"
                  data-testid="apply-coupon-btn"
                >
                  {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h2>
            
            <div className="space-y-3 mb-6">
              <label 
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay' ? 'border-[#50C878] bg-green-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="w-4 h-4 text-[#50C878]"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Razorpay (India)</div>
                  <div className="text-sm text-slate-500">UPI, Cards, Net Banking</div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-0">Recommended</Badge>
              </label>

              <label 
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'stripe' ? 'border-[#50C878] bg-green-50' : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="w-4 h-4 text-[#50C878]"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">Stripe (International)</div>
                  <div className="text-sm text-slate-500">International Cards</div>
                </div>
              </label>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full btn-cta py-6 text-lg rounded-xl"
              data-testid="pay-now-btn"
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CreditCard className="w-5 h-5 mr-2" />
              )}
              {processing ? 'Processing...' : `Pay ₹${finalAmount?.toLocaleString()}`}
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Instant Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
