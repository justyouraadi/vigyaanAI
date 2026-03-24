import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, Users, CreditCard, Tag, 
  BarChart3, Mail, LogOut, Menu, X, Settings, FileText, Link2, Star
} from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_knowledge-income-1/artifacts/cbmw48dd_erasebg-transformed.png";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Ebooks', href: '/admin/ebooks', icon: BookOpen },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Affiliates', href: '/admin/affiliates', icon: Link2 },
    { name: 'Email Logs', href: '/admin/emails', icon: Mail },
  ];

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-100" data-testid="admin-dashboard">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <img src={LOGO_URL} alt="VigyaanKart" className="h-[100px] w-[100px]" />
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800 hidden lg:block">
              <Link to="/" className="flex items-center gap-2">
                <img src={LOGO_URL} alt="VigyaanKart" className="h-[100px] w-[100px]" />
              </Link>
              <div className="mt-2 text-xs text-slate-400 uppercase tracking-wider">
                Admin Panel
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#50C878] text-white flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? 'bg-[#50C878] text-white' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                      data-testid={`admin-nav-${item.name.toLowerCase()}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Actions */}
            <div className="p-4 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
                User Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 w-full transition-colors"
                data-testid="admin-logout-btn"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
