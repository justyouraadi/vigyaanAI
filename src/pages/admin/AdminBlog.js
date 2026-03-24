import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', cover_image: '',
    author: 'VigyaanKart Team', category: 'General', tags: '',
    read_time: 5, is_published: true
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/blog`, { credentials: 'include' });
      if (res.ok) setPosts(await res.json());
    } catch (e) { console.error('Failed to fetch posts:', e); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({
      title: '', slug: '', excerpt: '', content: '', cover_image: '',
      author: 'VigyaanKart Team', category: 'General', tags: '', read_time: 5, is_published: true
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post) => {
    setForm({ ...post, tags: (post.tags || []).join(', ') });
    setEditingPost(post.post_id);
    setShowForm(true);
  };

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowed.some(ext => file.name.toLowerCase().endsWith(ext))) {
      toast.error('Only JPG, PNG, WebP, GIF images allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large (max 10MB)');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/admin/upload/image`, {
        method: 'POST', credentials: 'include', body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, cover_image: `${API_URL}/files/${data.path}` }));
        toast.success('Image uploaded!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Upload failed');
      }
    } catch (e) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form, slug: form.slug || generateSlug(form.title),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      read_time: parseInt(form.read_time) || 5,
    };
    try {
      const url = editingPost ? `${API_URL}/admin/blog/${editingPost}` : `${API_URL}/admin/blog`;
      const res = await fetch(url, {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(editingPost ? 'Post updated!' : 'Post created!');
        resetForm();
        fetchPosts();
      } else { const data = await res.json(); toast.error(data.detail || 'Failed to save post'); }
    } catch (e) { toast.error('Failed to save post'); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/blog/${postId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { toast.success('Post deleted'); fetchPosts(); }
    } catch (e) { toast.error('Failed to delete post'); }
  };

  const handleTogglePublish = async (post) => {
    try {
      const res = await fetch(`${API_URL}/admin/blog/${post.post_id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ is_published: !post.is_published }),
      });
      if (res.ok) { toast.success(post.is_published ? 'Unpublished' : 'Published'); fetchPosts(); }
    } catch (e) { toast.error('Failed to update post'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#50C878]" /></div>
  );

  return (
    <div data-testid="admin-blog">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-600">{posts.length} blog posts</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#50C878] hover:bg-[#3CB371] text-white" data-testid="admin-blog-create-btn">
          <Plus className="w-4 h-4 mr-2" />New Post
        </Button>
      </div>

      {/* View Modal */}
      {showView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">View Blog Post</h2>
              <button onClick={() => setShowView(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            {showView.cover_image && (
              <img src={showView.cover_image} alt={showView.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            )}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{showView.title}</h3>
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
              <span>{showView.category}</span>
              <span>{showView.read_time} min read</span>
              <span>{new Date(showView.created_at).toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none text-slate-700 whitespace-pre-wrap text-sm leading-relaxed border-t border-slate-200 pt-4">
              {showView.content}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={resetForm}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-blog-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <input type="text" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
                    required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900"
                    data-testid="admin-blog-title-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900" />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#50C878] transition-colors">
                  {form.cover_image ? (
                    <div className="flex items-center gap-4">
                      <img src={form.cover_image} alt="Cover" className="w-24 h-14 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 truncate">{form.cover_image.includes('/files/') ? 'Uploaded image' : form.cover_image}</p>
                      </div>
                      <label className="cursor-pointer text-xs text-[#50C878] hover:underline">
                        Replace
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      {uploading ? <Loader2 className="w-8 h-8 text-[#50C878] animate-spin" /> : <Image className="w-8 h-8 text-slate-400" />}
                      <span className="text-sm text-slate-600">{uploading ? 'Uploading...' : 'Click to upload cover image'}</span>
                      <span className="text-xs text-slate-400">Recommended Size: 1200x600 px | Format: JPG/PNG</span>
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" className="hidden" onChange={handleImageUpload} disabled={uploading} data-testid="blog-cover-upload" />
                    </label>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">Or enter URL directly:</p>
                <input type="text" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-900 mt-1" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] resize-none text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] resize-none font-mono text-sm text-slate-900" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Read Time (min)</label>
                  <input type="number" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#50C878] text-slate-900" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} id="published" className="w-4 h-4 accent-[#50C878]" />
                <label htmlFor="published" className="text-sm text-slate-700">Publish immediately</label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-[#50C878] hover:bg-[#3CB371] text-white" data-testid="admin-blog-save-btn">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Title</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Date</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {posts.map((post) => (
              <tr key={post.post_id} className="hover:bg-slate-50" data-testid={`admin-blog-row-${post.post_id}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {post.cover_image && <img src={post.cover_image} alt="" className="w-12 h-8 rounded object-cover hidden sm:block" />}
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{post.title}</p>
                      <p className="text-xs text-slate-500">/{post.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{post.category}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setShowView(post)} className="p-2 hover:bg-slate-100 rounded-lg" title="View" data-testid={`admin-blog-view-${post.post_id}`}>
                      <Eye className="w-4 h-4 text-slate-500" />
                    </button>
                    <button onClick={() => handleTogglePublish(post)} className="p-2 hover:bg-slate-100 rounded-lg" title={post.is_published ? 'Unpublish' : 'Publish'}>
                      {post.is_published ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-green-500" />}
                    </button>
                    <button onClick={() => handleEdit(post)} className="p-2 hover:bg-slate-100 rounded-lg" data-testid={`admin-blog-edit-${post.post_id}`}>
                      <Edit className="w-4 h-4 text-blue-500" />
                    </button>
                    <button onClick={() => handleDelete(post.post_id)} className="p-2 hover:bg-slate-100 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No blog posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlog;
