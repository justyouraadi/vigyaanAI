import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '../../components/ui/dialog';
import {
  Plus, Edit, Trash2, Loader2, Star, Eye, EyeOff, Upload
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '', role: '', image: '', text: '', rating: 5, is_published: true, order: 0
  });

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/reviews`, { credentials: 'include' });
      if (res.ok) setReviews(await res.json());
    } catch (e) { console.error('Failed to fetch reviews:', e); }
    finally { setLoading(false); }
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
        method: 'POST', credentials: 'include', body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: `${API_URL}/files/${data.path}` }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Image upload failed');
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
    try {
      const url = editingReview
        ? `${API_URL}/admin/reviews/${editingReview.review_id}`
        : `${API_URL}/admin/reviews`;
      const res = await fetch(url, {
        method: editingReview ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          rating: parseInt(formData.rating),
          order: parseInt(formData.order)
        })
      });
      if (res.ok) {
        toast.success(editingReview ? 'Review updated!' : 'Review created!');
        setShowDialog(false);
        resetForm();
        fetchReviews();
      } else { toast.error('Failed to save review'); }
    } catch (e) { toast.error('Failed to save review'); }
    finally { setSaving(false); }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name, role: review.role, image: review.image,
      text: review.text, rating: review.rating,
      is_published: review.is_published, order: review.order || 0
    });
    setShowDialog(true);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
        method: 'DELETE', credentials: 'include'
      });
      if (res.ok) { toast.success('Review deleted'); fetchReviews(); }
      else toast.error('Failed to delete review');
    } catch (e) { toast.error('Failed to delete review'); }
  };

  const handleTogglePublish = async (review) => {
    try {
      const res = await fetch(`${API_URL}/admin/reviews/${review.review_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_published: !review.is_published })
      });
      if (res.ok) {
        toast.success(review.is_published ? 'Review unpublished' : 'Review published');
        fetchReviews();
      }
    } catch (e) { toast.error('Failed to update review'); }
  };

  const resetForm = () => {
    setEditingReview(null);
    setFormData({ name: '', role: '', image: '', text: '', rating: 5, is_published: true, order: 0 });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
    </div>
  );

  return (
    <div data-testid="admin-reviews">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>
          <p className="text-slate-600">Manage customer reviews shown on the landing page</p>
        </div>
        <Button className="bg-[#50C878]" onClick={() => { resetForm(); setShowDialog(true); }} data-testid="add-review-btn">
          <Plus className="w-4 h-4 mr-2" />Add Review
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="review-name-input" />
              </div>
              <div>
                <Label>Role / Title</Label>
                <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g., Career Counselor" data-testid="review-role-input" />
              </div>
            </div>

            <div>
              <Label>Review Text</Label>
              <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-lg text-sm text-black" required data-testid="review-text-input" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rating (1-5)</Label>
                <Input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} data-testid="review-rating-input" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} data-testid="review-order-input" />
              </div>
            </div>

            {/* Reviewer Photo Upload */}
            <div>
              <Label>Reviewer Photo</Label>
              <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#50C878] transition-colors">
                {formData.image ? (
                  <div className="flex items-center gap-3">
                    <img src={formData.image} alt="Reviewer" className="w-12 h-12 rounded-full object-cover border" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Photo set</p>
                    </div>
                    <label className="cursor-pointer text-xs text-[#50C878] hover:underline">
                      Replace
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={handleImageUpload} data-testid="review-image-replace" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    {uploadingImage ? (
                      <Loader2 className="w-8 h-8 text-[#50C878] animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-600">{uploadingImage ? 'Uploading...' : 'Upload reviewer photo'}</span>
                    <span className="text-xs text-slate-400">Or paste URL below</span>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} data-testid="review-image-upload" />
                  </label>
                )}
              </div>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Or paste image URL" className="mt-2" data-testid="review-image-url" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded" data-testid="review-published-checkbox" />
              <Label className="mb-0">Published</Label>
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-[#50C878]" data-testid="review-save-btn">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingReview ? 'Update Review' : 'Create Review'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Reviewer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Review</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Rating</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No reviews yet. Add your first review!</td></tr>
              ) : reviews.map((review) => (
                <tr key={review.review_id} className="hover:bg-slate-50" data-testid={`review-row-${review.review_id}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {review.image ? (
                        <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#50C878] text-white flex items-center justify-center font-semibold">
                          {review.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{review.name}</p>
                        <p className="text-xs text-slate-500">{review.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 max-w-xs truncate">{review.text}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{review.order}</td>
                  <td className="px-6 py-4">
                    <Badge className={review.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}>
                      {review.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(review)} className="text-blue-600 border-blue-200 hover:bg-blue-50" data-testid={`edit-review-${review.review_id}`}>
                        <Edit className="w-3.5 h-3.5 mr-1" />Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(review)} title={review.is_published ? 'Unpublish' : 'Publish'}>
                        {review.is_published ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(review.review_id)} data-testid={`delete-review-${review.review_id}`}>
                        <Trash2 className="w-4 h-4 text-red-400" />
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

export default AdminReviews;
