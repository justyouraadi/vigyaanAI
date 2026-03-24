import React, { useState, useEffect } from 'react';
import { X, Mail, Gift, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('vk_exit_dismissed');
    if (dismissed) return;
    // Don't show on admin pages
    if (window.location.pathname.startsWith('/admin')) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 5 && !show && !submitted) {
        // Don't show on admin pages
        if (window.location.pathname.startsWith('/admin')) return;
        setShow(true);
      }
    };

    // Also show after 45 seconds of inactivity
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('vk_exit_dismissed') && !submitted && !window.location.pathname.startsWith('/admin')) {
        setShow(true);
      }
    }, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [show, submitted]);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('vk_exit_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/email-capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit_intent' }),
      });
      setSubmitted(true);
    } catch {
      // Fail silently
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" data-testid="exit-intent-popup">
      <div className="bg-[#0f1a14] border border-[#1e3a2a] rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          data-testid="exit-popup-close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center" data-testid="exit-popup-success">
            <div className="w-16 h-16 rounded-full bg-[#50C878]/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-[#50C878]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're In!</h3>
            <p className="text-slate-400 text-sm mb-4">
              Check your email for an exclusive 10% discount code.
            </p>
            <p className="text-[#50C878] font-semibold text-lg">WELCOME10</p>
            <Button
              onClick={handleDismiss}
              className="mt-6 bg-[#50C878] hover:bg-[#3CB371] text-white w-full"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Wait! Don't Miss Out</h3>
            <p className="text-slate-400 text-sm mb-6">
              Get <span className="text-[#50C878] font-semibold">10% OFF</span> your first ebook purchase. Enter your email below!
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#0a1a0f] border border-[#1e3a2a] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-[#50C878] transition-colors"
                  data-testid="exit-popup-email"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#50C878] hover:bg-[#3CB371] text-white py-5 rounded-xl font-semibold"
                data-testid="exit-popup-submit"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get My 10% Discount'}
              </Button>
            </form>
            <button
              onClick={handleDismiss}
              className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;
