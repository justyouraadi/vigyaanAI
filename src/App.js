import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatWidget from "./components/AIChatWidget";
import ExitIntentPopup from "./components/ExitIntentPopup";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages
import LandingPage from "./pages/LandingPage";
import EbooksPage from "./pages/EbooksPage";
import EbookDetailPage from "./pages/EbookDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import AffiliatePage from "./pages/AffiliatePage";

// User Dashboard
import UserDashboard from "./pages/UserDashboard";
import DashboardOverview from "./pages/DashboardOverview";
import MyPurchases from "./pages/MyPurchases";
import OrderHistory from "./pages/OrderHistory";
import UserProfile from "./pages/UserProfile";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminEbooks from "./pages/admin/AdminEbooks";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminEmails from "./pages/admin/AdminEmails";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminAffiliates from "./pages/admin/AdminAffiliates";
import AdminReviews from "./pages/admin/AdminReviews";

// Router component that handles session_id detection
function AppRouter() {
  const location = useLocation();
  
  // Handle hash scrolling (for links like /#testimonials, /#faq, etc.)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Small delay to let the page render first
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  // CRITICAL: Check URL fragment for session_id synchronously during render
  // This prevents race conditions by processing new session_id FIRST
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/ebooks" element={<EbooksPage />} />
      <Route path="/ebooks/:slug" element={<EbookDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/affiliate" element={<AffiliatePage />} />
      
      {/* Protected Routes */}
      <Route path="/checkout/:orderId" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/payment/success" element={
        <ProtectedRoute>
          <PaymentSuccessPage />
        </ProtectedRoute>
      } />
      
      {/* User Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardOverview />} />
        <Route path="purchases" element={<MyPurchases />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      }>
        <Route index element={<AdminOverview />} />
        <Route path="ebooks" element={<AdminEbooks />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="emails" element={<AdminEmails />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="affiliates" element={<AdminAffiliates />} />
      </Route>
      
      {/* Static Pages */}
      <Route path="/terms" element={<StaticPage title="Terms & Conditions" />} />
      <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
      <Route path="/refund" element={<StaticPage title="Refund Policy" />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Static page component
function StaticPage({ title }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">{title}</h1>
        <div className="bg-white rounded-xl p-8 border border-slate-200 prose">
          <p className="text-slate-600">
            This page is under construction. Please contact us at support@vigyaankart.com for any queries.
          </p>
        </div>
      </div>
    </div>
  );
}

// 404 page
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8">Page not found</p>
        <a href="/" className="text-[#0A66C2] hover:underline">Go back home</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
            <AIChatWidget />
            <WhatsAppButton />
            <ExitIntentPopup />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
