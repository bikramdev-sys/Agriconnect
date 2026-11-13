import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import HowItWorks from './pages/HowItWorks';
import ForFarmers from './pages/ForFarmers';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import BuyerDashboard from './pages/BuyerDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Determine if on administrative route (admin gateway or back-office dashboard)
  const isAdminSection = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard/admin');

  return (
    <div className={`min-h-screen flex flex-col ${isAdminSection ? 'bg-[#06110B] text-slate-100' : 'bg-[#FAFAF5] text-[#14251B]'}`}>
      {/* Scroll Restorer */}
      <ScrollToTop />

      {/* Notification Toaster with Premium Custom Styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#14532D',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 18px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 10px 30px -5px rgba(20, 83, 45, 0.25)',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              background: '#991B1B',
              color: '#FFFFFF',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Website Sticky Navigation Bar: HIDDEN on all Admin pages */}
      {!isAdminSection && <Navbar onOpenSearch={() => setSearchModalOpen(true)} />}

      {/* Global Search Modal */}
      {!isAdminSection && (
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      )}

      {/* Application Routes */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-farmers" element={<ForFarmers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dedicated Directorate Admin Routes */}
          <Route 
            path="/admin" 
            element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <AdminLogin />} 
          />
          <Route 
            path="/admin/login" 
            element={isAdmin ? <Navigate to="/dashboard/admin" replace /> : <AdminLogin />} 
          />
          
          {/* Buyer Dashboard */}
          <Route
            path="/dashboard/buyer"
            element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Farmer Dashboard */}
          <Route
            path="/dashboard/farmer"
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Platform Admin Back-Office Dashboard */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Professional Forest Green Footer: HIDDEN on all Admin pages */}
      {!isAdminSection && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
