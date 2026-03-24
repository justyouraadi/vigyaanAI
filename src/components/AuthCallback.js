import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exchangeSession, setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use ref for one-time processing (StrictMode safe)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      const hash = location.hash;
      const sessionIdMatch = hash.match(/session_id=([^&]+)/);
      
      if (sessionIdMatch) {
        const sessionId = sessionIdMatch[1];
        try {
          const userData = await exchangeSession(sessionId);
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          // Navigate to dashboard with user data
          navigate('/dashboard', { replace: true, state: { user: userData } });
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    };

    processAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#50C878] mx-auto mb-4" />
        <p className="text-slate-600 text-lg">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
