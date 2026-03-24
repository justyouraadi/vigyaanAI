import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '../../components/ui/dialog';
import { Plus, Tag, Loader2, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '', discount_type: 'percentage', discount_value: '',
    max_uses: 100, min_amount: 0, expires_at: '', applicable_ebooks: []
  });

  useEffect(() => {
    fetchCoupons();
    fetchEbooks();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/coupons`, { credentials: 'include' });
      if (res.ok) setCoupons(await res.json());
    } catch (e) { console.error('Failed to fetch coupons:', e); }
    finally { setLoading(false); }
  };

  const fetchEbooks = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/ebooks`, { credentials: 'include' });
      if (res.ok) setEbooks(await res.json());
    } catch (e) { console.error('Failed to fetch ebooks:', e); }
  };

  const handleEbookToggle = (ebookId) => {
    setFormData(prev => {
      const current = prev.applicable_ebooks || [];
      if (current.includes(ebookId)) {
        return { ...prev, applicable_ebooks: current.filter(id => id !== ebookId) };
      } else {
        return { ...prev, applicable_ebooks: [...current, ebookId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          discount_value: parseFloat(formData.discount_value),
          max_uses: parseInt(formData.max_uses),
          min_amount: parseFloat(formData.min_amount) || 0,
          expires_at: formData.expires_at || null
        })
      });
      if (res.ok) {
        toast.success('Coupon created successfully!');
        setShowDialog(false);
        setFormData({ code: '', discount_type: 'percentage', discount_value: '', max_uses: 100, min_amount: 0, expires_at: '', applicable_ebooks: [] });
        fetchCoupons();
      } else { toast.error('Failed to create coupon'); }
    } catch (e) { toast.error('Failed to create coupon'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
    </div>
  );

  return (
    <div data-testid="admin-coupons">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupon Management</h1>
          <p className="text-slate-600">Create and manage discount coupons</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#50C878]" data-testid="add-coupon-btn">
              <Plus className="w-4 h-4 mr-2" />Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Coupon Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20" className="uppercase" required data-testid="coupon-code-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-slate-900"
                    data-testid="coupon-discount-type"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <Label>{formData.discount_type === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}</Label>
                  <Input
                    type="number" value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 500'} required
                    data-testid="coupon-discount-value"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Uses</Label>
                  <Input type="number" value={formData.max_uses} onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })} />
                </div>
                <div>
                  <Label>Min Order Amount (₹)</Label>
                  <Input type="number" value={formData.min_amount} onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })} placeholder="0" />
                </div>
              </div>

              <div>
                <Label>Expiry Date (Optional)</Label>
                <Input type="datetime-local" value={formData.expires_at} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} />
              </div>

              {/* Ebook Applicability */}
              <div>
                <Label>Applicable Ebooks</Label>
                <p className="text-xs text-slate-500 mb-2">Leave all unchecked to apply to all ebooks</p>
                <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto p-2 space-y-1">
                  {ebooks.map((eb) => (
                    <label key={eb.ebook_id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.applicable_ebooks || []).includes(eb.ebook_id)}
                        onChange={() => handleEbookToggle(eb.ebook_id)}
                        className="w-4 h-4 accent-[#50C878]"
                      />
                      <span className="text-sm text-slate-700">{eb.title}</span>
                      <span className="text-xs text-slate-400 ml-auto">₹{eb.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={saving} className="w-full bg-[#50C878]" data-testid="coupon-save-btn">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Create Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Coupons Yet</h3>
            <p className="text-slate-500">Create your first coupon to offer discounts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Code</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Discount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Applicable To</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Usage</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Expires</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.coupon_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-[#50C878]">{coupon.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {coupon.discount_type === 'percentage' ? (
                          <><Percent className="w-4 h-4 text-emerald-600" /><span className="font-medium text-emerald-600">{coupon.discount_value}%</span></>
                        ) : (
                          <><DollarSign className="w-4 h-4 text-emerald-600" /><span className="font-medium text-emerald-600">₹{coupon.discount_value}</span></>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.applicable_ebooks?.length > 0 ? (
                        <span className="text-xs text-slate-600">{coupon.applicable_ebooks.length} ebook(s)</span>
                      ) : (
                        <span className="text-xs text-slate-400">All ebooks</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{coupon.used_count || 0} / {coupon.max_uses}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={coupon.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}>
                        {coupon.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
