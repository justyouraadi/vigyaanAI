import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, BookOpen, ShoppingCart, TrendingUp, 
  Calendar, Loader2, Link2, CreditCard
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [ebookAnalytics, setEbookAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchEbookAnalytics();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, { credentials: 'include' });
      if (res.ok) setData(await res.json());
    } catch (e) { console.error('Failed to fetch dashboard:', e); }
    finally { setLoading(false); }
  };

  const fetchEbookAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/ebook-sales-analytics`, { credentials: 'include' });
      if (res.ok) setEbookAnalytics(await res.json());
    } catch (e) { console.error('Failed to fetch ebook analytics:', e); }
  };

  if (loading || !data) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
    </div>
  );

  const { overview, payment_stats, affiliate_stats } = data;

  const statsCards = [
    { label: 'Total Revenue', value: `₹${overview.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Daily Revenue', value: `₹${overview.daily_revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { label: 'This Month Revenue', value: `₹${(overview.monthly_revenue || 0).toLocaleString()}`, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Orders', value: overview.total_orders, icon: ShoppingCart, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Users', value: overview.total_users, icon: Users, color: 'bg-pink-50 text-pink-600' },
    { label: 'Total Ebooks', value: overview.total_ebooks, icon: BookOpen, color: 'bg-cyan-50 text-cyan-600' },
  ];

  const affiliateCards = [
    { label: 'Total Affiliates', value: affiliate_stats?.total_affiliates || 0, icon: Link2, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Affiliate Commission', value: `₹${(affiliate_stats?.total_commission || 0).toLocaleString()}`, icon: CreditCard, color: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <div data-testid="admin-overview">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
      <p className="text-slate-600 mb-8">Real-time performance metrics</p>

      {/* Revenue & Core Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow" data-testid={`stat-card-${i}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Affiliate Metrics */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Affiliate Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {affiliateCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5" data-testid={`affiliate-stat-${i}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Payment Stats */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Successful</p>
          <p className="text-2xl font-bold text-emerald-600">{payment_stats.successful}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-500">{payment_stats.failed}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-slate-900">{payment_stats.success_rate}%</p>
        </div>
      </div>

      {/* Ebook Sales Analytics */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Ebook Sales Analytics</h2>
      {ebookAnalytics.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          No ebook sales data yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ebookAnalytics.map((eb) => (
            <div key={eb.ebook_id} className="bg-white rounded-xl border border-slate-200 overflow-hidden" data-testid={`ebook-analytics-${eb.ebook_id}`}>
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                {eb.cover_image && (
                  <img src={eb.cover_image} alt={eb.title} className="w-10 h-14 object-cover rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{eb.title}</p>
                  <p className="text-xs text-slate-500">₹{eb.price}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-blue-600">{eb.daily_sales}</p>
                    <p className="text-[10px] text-blue-500 uppercase font-medium">Today</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-purple-600">{eb.monthly_sales}</p>
                    <p className="text-[10px] text-purple-500 uppercase font-medium">Month</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-emerald-600">{eb.total_sales}</p>
                    <p className="text-[10px] text-emerald-500 uppercase font-medium">Total</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">₹{eb.daily_revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Daily Rev</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">₹{eb.monthly_revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Monthly Rev</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">₹{eb.total_revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Total Rev</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Ebooks */}
      {data.top_ebooks?.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Selling Ebooks</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Ebook</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Sales</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.top_ebooks.map((ebook, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{ebook.title}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{ebook.count}</td>
                    <td className="px-6 py-3 text-sm font-medium text-emerald-600">₹{(ebook.revenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
