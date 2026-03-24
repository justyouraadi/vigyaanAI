import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Loader2, CreditCard, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchPayments(); }, [activeTab]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === 'all' ? '' : `?status=${activeTab}`;
      const res = await fetch(`${API_URL}/admin/all-payments${statusParam}`, { credentials: 'include' });
      if (res.ok) setPayments(await res.json());
    } catch (e) { console.error('Failed to fetch payments:', e); }
    finally { setLoading(false); }
  };

  const exportToExcel = async () => {
    try {
      const rows = [['Order ID', 'Customer Name', 'Email', 'Phone', 'Ebook', 'Amount', 'Status', 'Gateway', 'Date']];
      payments.forEach(p => {
        rows.push([
          p.order_id, p.customer_name, p.email, p.phone, p.ebook_title,
          p.amount, p.status, p.payment_gateway,
          p.created_at ? new Date(p.created_at).toLocaleString() : ''
        ]);
      });
      // CSV-based export (works without xlsx library)
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments_${activeTab}_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error('Export failed:', e); }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-50 text-emerald-600 border-0"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'failed':
        return <Badge className="bg-red-50 text-red-600 border-0"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge className="bg-yellow-50 text-yellow-600 border-0"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const tabs = [
    { key: 'all', label: 'All Payments', icon: CreditCard },
    { key: 'completed', label: 'Paid', icon: CheckCircle },
    { key: 'failed', label: 'Failed', icon: XCircle },
  ];

  return (
    <div data-testid="admin-payments">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
          <p className="text-slate-600">Track paid and failed payments</p>
        </div>
        <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2" data-testid="export-payments-btn">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#50C878] text-[#50C878]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            data-testid={`payment-tab-${tab.key}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Payments Found</h3>
          <p className="text-slate-500">No {activeTab !== 'all' ? activeTab : ''} payments to display</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Ebook</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Gateway</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.order_id} className="hover:bg-slate-50" data-testid={`payment-row-${payment.order_id}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 text-sm">{payment.customer_name}</p>
                      <p className="text-xs text-slate-500">{payment.email}</p>
                      {payment.phone !== 'N/A' && <p className="text-xs text-slate-400">{payment.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">{payment.ebook_title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">₹{payment.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="secondary" className="capitalize text-xs">{payment.payment_gateway}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
