import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, TrendingUp, BookOpen, ArrowRight, Loader2 
} from 'lucide-react';
import { Button } from '../components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { 
      label: 'Ebooks Purchased', 
      value: purchases.length, 
      icon: ShoppingBag,
      color: 'bg-green-900/50 text-[#6ee7a0]'
    },
    { 
      label: 'Total Investment', 
      value: `₹${purchases.reduce((sum, p) => sum + (p.order?.amount || 0), 0).toLocaleString()}`, 
      icon: TrendingUp,
      color: 'bg-emerald-900/50 text-emerald-400'
    },
    { 
      label: 'Available Downloads', 
      value: purchases.length, 
      icon: BookOpen,
      color: 'bg-orange-900/50 text-orange-400'
    },
  ];

  return (
    <div data-testid="dashboard-overview">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-slate-400">Here's an overview of your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-[#0f1a14] rounded-xl p-6 border border-emerald-900"
            data-testid={`stat-${index}`}
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="bg-[#0f1a14] rounded-xl border border-emerald-900">
        <div className="p-6 border-b border-emerald-900 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Recent Purchases</h2>
          <Link to="/dashboard/purchases">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#6ee7a0] mx-auto" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 mb-4">You haven't purchased any ebooks yet</p>
            <Link to="/ebooks">
              <Button className="bg-[#50C878]">Browse Ebooks</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-emerald-900">
            {purchases.slice(0, 3).map((purchase) => (
              <div 
                key={purchase.order?.order_id}
                className="p-4 flex items-center gap-4 hover:bg-emerald-900/50 transition-colors"
              >
                <img 
                  src={purchase.ebook?.cover_image}
                  alt={purchase.ebook?.title}
                  className="w-16 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{purchase.ebook?.title}</h3>
                  <p className="text-sm text-slate-500">
                    Purchased on {new Date(purchase.order?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link to="/dashboard/purchases">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-emerald-900">
                    Download
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
