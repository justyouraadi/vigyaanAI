import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import EbookCard from '../components/EbookCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  CheckCircle, ShoppingCart, Tag, Users, BookOpen, 
  Clock, Shield, ArrowRight, ArrowLeft, Loader2, Download
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const EbookDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [ebook, setEbook] = useState(null);
  const [relatedEbooks, setRelatedEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchEbook();
  }, [slug]);

  const fetchEbook = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ebooks/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setEbook(data);
        fetchRelatedEbooks(slug);
      } else {
        navigate('/ebooks');
      }
    } catch (error) {
      console.error('Failed to fetch ebook:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedEbooks = async (currentSlug) => {
    try {
      const response = await fetch(`${API_URL}/ebooks/${currentSlug}/related`);
      if (response.ok) {
        const data = await response.json();
        setRelatedEbooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch related ebooks:', error);
    }
  };

  const handleBuyNow = async () => {
    // If purchase_link is set, redirect directly
    if (ebook.purchase_link) {
      window.open(ebook.purchase_link, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!user) {
      toast.info('Please sign in to purchase');
      login();
      return;
    }

    setPurchasing(true);
    try {
      const response = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ebook_id: ebook.ebook_id })
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/checkout/${data.order_id}`);
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Something went wrong');
    } finally {
      setPurchasing(false);
    }
  };

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

  if (!ebook) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Ebook not found</h1>
          <Link to="/ebooks" className="text-[#50C878] hover:underline mt-4 inline-block">
            Browse all ebooks
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((ebook.original_price - ebook.price) / ebook.original_price) * 100);

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="ebook-detail-page">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-[#0f1a14] border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-[#6ee7a0]">Home</Link>
            <span>/</span>
            <Link to="/ebooks" className="hover:text-[#6ee7a0]">Ebooks</Link>
            <span>/</span>
            <span className="text-slate-300">{ebook.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/ebooks" className="inline-flex items-center text-[#6ee7a0] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ebooks
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Image */}
          <div>
            <div className="sticky top-24">
              {/* Mobile-only: Title banner above image */}
              <div className="lg:hidden mb-4">
                <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-xl px-5 py-4" data-testid="mobile-title-banner">
                  <h1 className="text-xl font-bold text-black">{ebook.title}</h1>
                </div>
              </div>

              <div className="relative">
                <img 
                  src={ebook.cover_image}
                  alt={ebook.title}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  data-testid="ebook-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-[#FF6B00] text-white border-0 text-lg px-4 py-2">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="flex flex-col">
            <div className="hidden lg:block">
              <Badge className="bg-green-900/50 text-[#6ee7a0] border-0 mb-4">
                {ebook.category}
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="ebook-title">
                {ebook.title}
              </h1>
            </div>

            {/* Mobile: Category badge */}
            <div className="lg:hidden mb-4">
              <Badge className="bg-green-900/50 text-[#6ee7a0] border-0">
                {ebook.category}
              </Badge>
            </div>

            {/* Price Card - appears before description on mobile */}
            <div className="order-first lg:order-none mb-8">
              <div className="bg-[#0f1a14] rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-white">₹{ebook.price.toLocaleString()}</span>
                  {ebook.original_price > ebook.price && (
                    <span className="text-xl text-slate-500 line-through">₹{ebook.original_price.toLocaleString()}</span>
                  )}
                  {discount > 0 && (
                    <span className="price-tag">Save {discount}%</span>
                  )}
                </div>

                {/* Countdown */}
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-2">Offer ends in:</p>
                  <CountdownTimer hours={ebook.countdown_hours || 24} />
                </div>

                <Button 
                  onClick={handleBuyNow}
                  disabled={purchasing}
                  className="w-full btn-cta py-6 text-lg rounded-xl"
                  data-testid="buy-now-btn"
                >
                  {purchasing ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  {purchasing ? 'Processing...' : 'Download the eBook Now'}
                </Button>

                <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
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

            {/* Description - after price card on mobile */}
            <p className="text-lg text-slate-400 mb-6 order-2 lg:order-none">
              {ebook.description}
            </p>

            {/* Income Potential */}
            {ebook.income_potential && (
              <div className="bg-emerald-50 rounded-xl p-4 mb-6 order-3 lg:order-none">
                <div className="flex items-center gap-3">
                  <Tag className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Income Potential</p>
                    <p className="text-xl font-bold text-emerald-700">{ebook.income_potential}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Target Audience */}
            {ebook.target_audience && (
              <div className="mb-8 order-4 lg:order-none">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#6ee7a0]" />
                  Who is this for?
                </h3>
                <p className="text-slate-400">{ebook.target_audience}</p>
              </div>
            )}

            {/* Benefits */}
            {ebook.benefits && ebook.benefits.length > 0 && (
              <div className="mb-8 order-5 lg:order-none">
                <h3 className="text-lg font-semibold text-white mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {ebook.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What You'll Learn */}
            {ebook.what_you_learn && ebook.what_you_learn.length > 0 && (
              <div className="mb-8 order-6 lg:order-none">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#6ee7a0]" />
                  What You Will Learn
                </h3>
                <ul className="space-y-3">
                  {ebook.what_you_learn.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-900/50 text-[#6ee7a0] flex items-center justify-center flex-shrink-0 text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-slate-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Ebooks */}
        {relatedEbooks.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedEbooks.map((related) => (
                <EbookCard key={related.ebook_id} ebook={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EbookDetailPage;
