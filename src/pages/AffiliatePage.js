import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Copy, Users, DollarSign, TrendingUp, CheckCircle, Loader2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const AffiliatePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
    else setLoading(false);
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/affiliates/me`, { credentials: 'include' });
      if (res.ok) setProfile(await res.json());
    } catch (e) {
      // Not an affiliate yet
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/affiliates/join`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        toast.success('Welcome to the affiliate program!');
      }
    } catch (e) {
      toast.error('Failed to join. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1a0f]">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-[#50C878]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="affiliate-page">
      <Navbar />

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!user ? (
            /* Not logged in */
            <div className="text-center py-20">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Affiliate Program</h1>
              <p className="text-slate-400 mb-8">Sign in to join our affiliate program and start earning commissions.</p>
            </div>
          ) : !profile ? (
            /* Logged in but not an affiliate */
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Earn by Sharing Knowledge
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                Join our affiliate program and earn commission on every sale you refer. Share ebooks, help others grow, and get paid!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                {[
                  { icon: Link2, title: 'Get Your Link', desc: 'Sign up and get a unique referral link to share' },
                  { icon: Users, title: 'Share & Refer', desc: 'Share with your network via social media or direct links' },
                  { icon: DollarSign, title: 'Earn Commission', desc: 'Earn a percentage on every successful referral sale' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#0f1a14] border border-[#1e3a2a] rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#50C878]/10 flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-[#50C878]" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleJoin}
                disabled={joining}
                className="bg-[#50C878] hover:bg-[#3CB371] text-white px-10 py-6 rounded-full text-lg font-semibold"
                data-testid="affiliate-join-btn"
              >
                {joining ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <TrendingUp className="w-5 h-5 mr-2" />}
                Join Affiliate Program
              </Button>
            </div>
          ) : (
            /* Active affiliate */
            <div>
              <h1 className="text-3xl font-bold text-white mb-8">Your Affiliate Dashboard</h1>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-xl p-6">
                  <p className="text-sm text-slate-500 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-[#50C878]">₹{(profile.total_earnings || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-xl p-6">
                  <p className="text-sm text-slate-500 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">{profile.total_referrals || 0}</p>
                </div>
                <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-xl p-6">
                  <p className="text-sm text-slate-500 mb-1">Pending Payout</p>
                  <p className="text-2xl font-bold text-yellow-400">₹{(profile.pending_payout || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">Your Referral Link</h2>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#0a1a0f] border border-[#1e3a2a] rounded-lg px-4 py-3 text-sm text-slate-300 truncate">
                    {window.location.origin}?ref={profile.referral_code}
                  </div>
                  <Button onClick={copyLink} className="bg-[#50C878] hover:bg-[#3CB371] text-white" data-testid="affiliate-copy-link">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Referral Code: <span className="text-[#50C878] font-mono">{profile.referral_code}</span>
                </p>
              </div>

              {/* Referral History */}
              <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Referral History</h2>
                {(profile.referrals || []).length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">No referrals yet. Share your link to start earning!</p>
                ) : (
                  <div className="space-y-3">
                    {profile.referrals.map((ref) => (
                      <div key={ref.referral_id} className="flex items-center justify-between bg-[#0a1a0f] border border-[#1e3a2a] rounded-lg px-4 py-3">
                        <div>
                          <p className="text-sm text-white">{ref.referred_email || 'Anonymous'}</p>
                          <p className="text-xs text-slate-500">{new Date(ref.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#50C878]">₹{ref.commission_amount}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            ref.status === 'paid' ? 'bg-green-900/30 text-green-400' :
                            ref.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {ref.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffiliatePage;
