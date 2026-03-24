import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Download, FileText, 
  User, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_knowledge-income-1/artifacts/cbmw48dd_erasebg-transformed.png";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Purchases', href: '/dashboard/purchases', icon: ShoppingBag },
    { name: 'Order History', href: '/dashboard/orders', icon: FileText },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0a1a0f]" data-testid="user-dashboard">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0f1a14] border-b border-emerald-900 px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <img src={LOGO_URL} alt="VigyaanKart" className="h-[100px] w-[100px]" />
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f1a14] border-r border-emerald-900
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-emerald-900 hidden lg:block">
              <Link to="/">
                <img src={LOGO_URL} alt="VigyaanKart" className="h-[100px] w-[100px]" />
              </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-emerald-900">
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
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                      data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-emerald-900">
              <button
                onClick={logout}
                className="sidebar-link text-red-400 hover:bg-red-900/30 w-full"
                data-testid="logout-btn"
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
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
