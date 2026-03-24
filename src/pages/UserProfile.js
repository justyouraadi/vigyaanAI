import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const UserProfile = () => {
  const { user, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name })
      });
      
      if (response.ok) {
        toast.success('Profile updated successfully');
        setEditing(false);
        checkAuth();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="user-profile">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 max-w-xl">
        {/* Profile Picture */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {user?.picture ? (
              <img 
                src={user.picture}
                alt={user.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#50C878] text-white flex items-center justify-center text-2xl font-semibold">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6 space-y-6">
          <div>
            <Label className="text-sm font-medium text-slate-700">Full Name</Label>
            {editing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                data-testid="name-input"
              />
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900">{user?.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700">Email Address</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-900">{user?.email}</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {editing ? (
              <div className="flex gap-3">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#50C878]"
                  data-testid="save-profile-btn"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => { setEditing(false); setName(user?.name || ''); }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setEditing(true)}
                data-testid="edit-profile-btn"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
