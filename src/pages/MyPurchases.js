import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Download, ExternalLink, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const MyPurchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/my-purchases`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (order) => {
    setDownloading(order.order_id);
    try {
      const response = await fetch(
        `${API_URL}/download/${order.order_id}?token=${order.download_token}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Open download URL in new tab
        window.open(data.download_url, '_blank');
        toast.success('Download started!');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#50C878]" />
      </div>
    );
  }

  return (
    <div data-testid="my-purchases">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Purchases</h1>
        <p className="text-slate-600">Access and download your purchased ebooks</p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No purchases yet</h3>
          <p className="text-slate-500 mb-6">Start your learning journey by purchasing an ebook</p>
          <Link to="/ebooks">
            <Button className="bg-[#50C878]">Browse Ebooks</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchases.map((purchase) => (
            <div 
              key={purchase.order?.order_id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              data-testid={`purchase-${purchase.order?.order_id}`}
            >
              <div className="flex gap-4 p-4">
                <img 
                  src={purchase.ebook?.cover_image}
                  alt={purchase.ebook?.title}
                  className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Badge className="bg-emerald-50 text-emerald-600 border-0 mb-2">
                    Purchased
                  </Badge>
                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                    {purchase.ebook?.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">
                    {purchase.ebook?.category}
                  </p>
                  <p className="text-sm text-slate-500">
                    Ordered: {new Date(purchase.order?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-slate-100 p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Order: {purchase.order?.order_id}
                  </span>
                  <div className="flex gap-2">
                    <Link to={`/ebooks/${purchase.ebook?.slug}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      size="sm"
                      className="bg-[#50C878]"
                      onClick={() => handleDownload(purchase.order)}
                      disabled={downloading === purchase.order?.order_id}
                      data-testid={`download-${purchase.order?.order_id}`}
                    >
                      {downloading === purchase.order?.order_id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
