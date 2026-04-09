import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '../../components/ui/dialog';
import { 
  Plus, Edit, Trash2, Loader2, BookOpen, Eye, EyeOff, Upload, FileText, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminEbooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEbook, setEditingEbook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', short_description: '',
    price: '', original_price: '', cover_image: '', pdf_url: '',
    category: '', benefits: '', income_potential: '', target_audience: '',
    what_you_learn: '', countdown_hours: 24, purchase_link: ''
  });

  useEffect(() => { fetchEbooks(); }, []);

  const fetchEbooks = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/ebooks`, { credentials: 'include' });
      if (res.ok) setEbooks(await res.json());
    } catch (e) { console.error('Failed to fetch ebooks:', e); }
    finally { setLoading(false); }
  };

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large (max 50MB)');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/admin/upload/pdf`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedPdf({ path: data.path, filename: file.name });
        setFormData(prev => ({ ...prev, pdf_url: `${API_URL}/files/${data.path}` }));
        toast.success('PDF uploaded successfully!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Upload failed');
      }
    } catch (e) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowed.some(ext => file.name.toLowerCase().endsWith(ext))) {
      toast.error('Only JPG, PNG, WebP, GIF images are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large (max 10MB)');
      return;
    }
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/admin/upload/image`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, cover_image: `${API_URL}/files/${data.path}` }));
        toast.success('Cover image uploaded!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Image upload failed');
      }
    } catch (e) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: parseFloat(formData.original_price),
      countdown_hours: parseInt(formData.countdown_hours),
      benefits: formData.benefits.split('\n').filter(b => b.trim()),
      what_you_learn: formData.what_you_learn.split('\n').filter(w => w.trim())
    };
    try {
      const url = editingEbook ? `${API_URL}/admin/ebooks/${editingEbook.ebook_id}` : `${API_URL}/admin/ebooks`;
      const res = await fetch(url, {
        method: editingEbook ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(editingEbook ? 'Ebook updated!' : 'Ebook created!');
        setShowDialog(false);
        resetForm();
        fetchEbooks();
      } else { toast.error('Failed to save ebook'); }
    } catch (e) { toast.error('Failed to save ebook'); }
    finally { setSaving(false); }
  };

  const handleEdit = (ebook) => {
    setEditingEbook(ebook);
    setUploadedPdf(ebook.pdf_url ? { path: '', filename: 'Current PDF' } : null);
    setFormData({
      title: ebook.title, slug: ebook.slug, description: ebook.description,
      short_description: ebook.short_description,
      price: ebook.price.toString(), original_price: ebook.original_price.toString(),
      cover_image: ebook.cover_image, pdf_url: ebook.pdf_url || '',
      category: ebook.category, benefits: ebook.benefits?.join('\n') || '',
      income_potential: ebook.income_potential, target_audience: ebook.target_audience,
      what_you_learn: ebook.what_you_learn?.join('\n') || '', countdown_hours: ebook.countdown_hours || 24,
      purchase_link: ebook.purchase_link || ''
    });
    setShowDialog(true);
  };

  const handleToggleActive = async (ebook) => {
    try {
      const res = await fetch(`${API_URL}/admin/ebooks/${ebook.ebook_id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ is_active: !ebook.is_active })
      });
      if (res.ok) { toast.success(ebook.is_active ? 'Ebook disabled' : 'Ebook enabled'); fetchEbooks(); }
    } catch (e) { toast.error('Failed to update ebook'); }
  };

  const resetForm = () => {
    setEditingEbook(null);
    setUploadedPdf(null);
    setFormData({
      title: '', slug: '', description: '', short_description: '',
      price: '', original_price: '', cover_image: '', pdf_url: '',
      category: '', benefits: '', income_potential: '', target_audience: '',
      what_you_learn: '', countdown_hours: 24, purchase_link: ''
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
    </div>
  );

  return (
    <div data-testid="admin-ebooks">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ebook Management</h1>
          <p className="text-slate-600">Add, edit, and manage your ebooks</p>
        </div>
        <Button className="bg-[#50C878]" onClick={() => { resetForm(); setShowDialog(true); }} data-testid="add-ebook-btn">
          <Plus className="w-4 h-4 mr-2" />Add Ebook
        </Button>
        <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEbook ? 'Edit Ebook' : 'Add New Ebook'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={handleTitleChange} required data-testid="ebook-title-input" />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                </div>
              </div>

              <div>
                <Label>Short Description</Label>
                <Input value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} required />
              </div>

              <div>
                <Label>Full Description</Label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-lg text-sm text-black" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div>
                  <Label>Original Price (₹)</Label>
                  <Input type="number" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label>Cover Image</Label>
                <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#50C878] transition-colors">
                  {formData.cover_image ? (
                    <div className="flex items-center gap-3">
                      <img src={formData.cover_image} alt="Cover" className="w-16 h-20 object-cover rounded border" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Cover image set</p>
                        <p className="text-xs text-slate-500">Click replace to change</p>
                      </div>
                      <label className="cursor-pointer text-xs text-[#50C878] hover:underline">
                        Replace
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={handleImageUpload} data-testid="ebook-cover-replace" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      {uploadingImage ? (
                        <Loader2 className="w-8 h-8 text-[#50C878] animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-600">{uploadingImage ? 'Uploading...' : 'Click to upload cover image'}</span>
                      <span className="text-xs text-slate-400">Max 10MB, JPG/PNG/WebP</span>
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} data-testid="ebook-cover-upload" />
                    </label>
                  )}
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <Label>Ebook PDF File</Label>
                <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#50C878] transition-colors">
                  {uploadedPdf ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#50C878]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{uploadedPdf.filename}</p>
                        <p className="text-xs text-slate-500">PDF uploaded successfully</p>
                      </div>
                      <label className="cursor-pointer text-xs text-[#50C878] hover:underline">
                        Replace
                        <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} data-testid="ebook-pdf-replace" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-[#50C878] animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-600">{uploading ? 'Uploading...' : 'Click to upload PDF'}</span>
                      <span className="text-xs text-slate-400">Max 50MB, PDF only</span>
                      <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={uploading} data-testid="ebook-pdf-upload" />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Income Potential</Label>
                  <Input value={formData.income_potential} onChange={(e) => setFormData({ ...formData, income_potential: e.target.value })} placeholder="e.g., ₹5L - ₹15L per month" />
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <Input value={formData.target_audience} onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Benefits (one per line)</Label>
                <textarea value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full min-h-[80px] px-3 py-2 border border-slate-200 rounded-lg text-sm text-black" placeholder="Enter benefits, one per line" />
              </div>

              <div>
                <Label>What You'll Learn (one per line)</Label>
                <textarea value={formData.what_you_learn} onChange={(e) => setFormData({ ...formData, what_you_learn: e.target.value })}
                  className="w-full min-h-[80px] px-3 py-2 border border-slate-200 rounded-lg text-sm text-black" placeholder="Enter learning points, one per line" />
              </div>

              <div>
                <Label>Purchase / Download Link</Label>
                <Input value={formData.purchase_link} onChange={(e) => setFormData({ ...formData, purchase_link: e.target.value })}
                  placeholder="e.g., https://razorpay.com/pay/your-link or any external URL" data-testid="ebook-purchase-link-input" />
                <p className="text-xs text-slate-400 mt-1">Users will be redirected to this link when they click "Download the Course"</p>
              </div>

              <Button type="submit" disabled={saving} className="w-full bg-[#50C878]" data-testid="ebook-save-btn">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingEbook ? 'Update Ebook' : 'Create Ebook'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Ebooks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Ebook</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">PDF</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Sales</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ebooks.map((ebook) => (
                <tr key={ebook.ebook_id} className="hover:bg-slate-50" data-testid={`ebook-row-${ebook.ebook_id}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={ebook.cover_image} alt={ebook.title} className="w-12 h-16 object-cover rounded" />
                      <div>
                        <p className="font-medium text-slate-900">{ebook.title}</p>
                        <p className="text-xs text-slate-500">{ebook.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">₹{ebook.price}</p>
                    <p className="text-xs text-slate-400 line-through">₹{ebook.original_price}</p>
                  </td>
                  <td className="px-6 py-4"><Badge variant="secondary">{ebook.category}</Badge></td>
                  <td className="px-6 py-4">
                    {ebook.pdf_url ? (
                      <span className="flex items-center gap-1 text-xs text-[#50C878]"><FileText className="w-3 h-3" />Uploaded</span>
                    ) : (
                      <span className="text-xs text-slate-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4"><p className="font-medium text-slate-900">{ebook.copies_sold || 0}</p></td>
                  <td className="px-6 py-4">
                    <Badge className={ebook.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}>
                      {ebook.is_active ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ebook)} className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid={`edit-ebook-${ebook.ebook_id}`}>
                        <Edit className="w-3.5 h-3.5 mr-1.5" />Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleActive(ebook)} title={ebook.is_active ? 'Disable' : 'Enable'}>
                        {ebook.is_active ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEbooks;
