import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Users, Settings, Loader2, DollarSign, Save } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminAffiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [settings, setSettings] = useState({ commission_percent: 10, min_payout: 500 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [affRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/admin/affiliates`, { credentials: 'include' }),
        fetch(`${API_URL}/admin/affiliate-settings`, { credentials: 'include' }),
      ]);
      if (affRes.ok) setAffiliates(await affRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
    } catch (e) {
      console.error('Failed to fetch affiliates:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/affiliate-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          commission_percent: parseFloat(settings.commission_percent),
          min_payout: parseFloat(settings.min_payout),
        }),
      });
      if (res.ok) toast.success('Settings saved!');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
      </div>
    );
  }

  return (
    <div data-testid="admin-affiliates">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Affiliate Management</h1>

      {/* Settings Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Commission Settings</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Commission Rate (%)</label>
            <input
              type="number"
              value={settings.commission_percent}
              onChange={(e) => setSettings({ ...settings, commission_percent: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900"
              min="0"
              max="100"
              data-testid="admin-affiliate-commission-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Payout (₹)</label>
            <input
              type="number"
              value={settings.min_payout}
              onChange={(e) => setSettings({ ...settings, min_payout: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900"
              min="0"
              data-testid="admin-affiliate-minpayout-input"
            />
          </div>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-[#50C878] hover:bg-[#3CB371] text-white"
          data-testid="admin-affiliate-save-btn"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Affiliates ({affiliates.length})</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Affiliate</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Code</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Referrals</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Earnings</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {affiliates.map((aff) => (
              <tr key={aff.affiliate_id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 text-sm">{aff.user_name}</p>
                  <p className="text-xs text-slate-500">{aff.user_email}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">{aff.referral_code}</code>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{aff.total_referrals}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{(aff.total_earnings || 0).toLocaleString()}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${aff.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {aff.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {affiliates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No affiliates have joined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAffiliates;
