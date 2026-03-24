import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { 
  Menu, X, User, LogOut, LayoutDashboard, ShoppingBag, 
  ChevronDown, BookOpen, Briefcase, Cpu, Rocket, Users,
  HelpCircle, MessageCircle, FileText, Heart, Zap, Library
} from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_knowledge-income-1/artifacts/cbmw48dd_erasebg-transformed.png";

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ebooksDropdownOpen, setEbooksDropdownOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ebookCategories = [
    { name: 'Make Money Online', icon: Zap, href: '/ebooks?category=make-money' },
    { name: 'Freelancing', icon: Briefcase, href: '/ebooks?category=freelancing' },
    { name: 'AI & Digital Skills', icon: Cpu, href: '/ebooks?category=ai-skills' },
    { name: 'Business & Startup', icon: Rocket, href: '/ebooks?category=business' },
    { name: 'Affiliate Marketing', icon: Users, href: '/ebooks?category=affiliate' },
  ];

  const navLinks = [
    { name: 'Success Stories', href: '/#testimonials' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About Us', href: '/#about' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href.startsWith('/#')) return false;
    return location.pathname === href;
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black py-2 px-4 text-center text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <Rocket className="w-4 h-4" />
          Learn Skills That Can Help You Earn ₹1L–₹10L/Month
          <Rocket className="w-4 h-4" />
        </span>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0a1a0f]/98 backdrop-blur-lg shadow-lg shadow-black/20' 
            : 'bg-[#0a1a0f]/95 backdrop-blur-md'
        }`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left - Logo */}
            <Link to="/" className="flex-shrink-0" data-testid="logo-link">
              <img 
                src={LOGO_URL} 
                alt="VigyaanKart" 
                className="h-10 w-auto hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Center - Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Explore eBooks Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setEbooksDropdownOpen(true)}
                onMouseLeave={() => setEbooksDropdownOpen(false)}
              >
                <button 
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                  data-testid="explore-ebooks-trigger"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore eBooks
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ebooksDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-0 mt-1 w-64 bg-[#0f1a14] border border-[#1e3a2a] rounded-xl shadow-xl shadow-black/30 overflow-hidden transition-all duration-200 ${
                    ebooksDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="p-2">
                    <Link 
                      to="/ebooks"
                      className="flex items-center gap-3 px-4 py-3 text-white font-medium hover:bg-[#50C878]/20 rounded-lg transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-[#50C878]" />
                      All eBooks
                    </Link>
                    <div className="h-px bg-[#1e3a2a] my-2"></div>
                    {ebookCategories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <category.icon className="w-4 h-4 text-[#6ee7a0]" />
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(link.href) 
                      ? 'text-[#50C878] bg-[#50C878]/10' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right - Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle />
              {user ? (
                <>
                  {/* My Library */}
                  <Link to="/dashboard/purchases">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <Library className="w-4 h-4 mr-2" />
                      My Library
                    </Button>
                  </Link>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/5"
                        data-testid="user-menu-trigger"
                      >
                        {user.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="w-7 h-7 rounded-full ring-2 ring-[#50C878]/30"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#50C878] text-white flex items-center justify-center text-sm font-medium">
                            {user.name?.charAt(0)}
                          </div>
                        )}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#0f1a14] border-[#1e3a2a]">
                      <div className="px-3 py-2 border-b border-[#1e3a2a]">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/purchases" className="flex items-center gap-2 text-slate-300 hover:text-white">
                          <ShoppingBag className="w-4 h-4" />
                          My Purchases
                        </Link>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator className="bg-[#1e3a2a]" />
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="flex items-center gap-2 text-slate-300 hover:text-white">
                              <LayoutDashboard className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-[#1e3a2a]" />
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={login}
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/5"
                  data-testid="login-btn"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              )}

              {/* Primary CTA */}
              <Link to="/ebooks">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
                  data-testid="cta-btn"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Earning Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile CTA */}
              <Link to="/ebooks">
                <Button 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 rounded-full text-xs"
                >
                  Start Now
                </Button>
              </Link>
              
              <button
                className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
          data-testid="mobile-menu"
        >
          <div className="bg-[#0f1a14] border-t border-[#1e3a2a] px-4 py-4 space-y-2">
            {/* Explore eBooks Section */}
            <div className="pb-3 border-b border-[#1e3a2a]">
              <Link 
                to="/ebooks"
                className="flex items-center gap-3 px-4 py-3 text-white font-medium hover:bg-[#50C878]/20 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 text-[#50C878]" />
                Explore All eBooks
              </Link>
              <div className="ml-4 mt-2 space-y-1">
                {ebookCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Divider */}
            <div className="h-px bg-[#1e3a2a] my-3"></div>

            {/* User Section */}
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 flex items-center gap-3">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#50C878] text-white flex items-center justify-center font-medium">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/purchases" 
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Library className="w-5 h-5" />
                  My Library
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Button 
                onClick={() => { login(); setMobileMenuOpen(false); }}
                className="w-full bg-[#50C878] hover:bg-[#3CB371] text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Login / Sign Up
              </Button>
            )}

            {/* Mobile Primary CTA */}
            <Link to="/ebooks" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-xl mt-3"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Earning Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
