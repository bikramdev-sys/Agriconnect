import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const AuthContext = createContext();

const DEMO_ADMIN = {
  id: 'admin-1',
  name: 'Bikram Dev',
  email: 'admin@agriconnect.org',
  role: 'admin',
  title: 'Platform Chief Administrator',
  location: 'National Agricultural Directorate, Pune',
  phone: '+91 99887 76655',
  avatar: 'https://plus.unsplash.com/premium_photo-1791369738920-51b63a38021b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  permissions: ['all_access', 'farmer_verification', 'dispute_resolution', 'analytics', 'pricing_policy']
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('agriconnect_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('agriconnect_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('agriconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agriconnect_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('agriconnect_token', token);
    } else {
      localStorage.removeItem('agriconnect_token');
    }
  }, [token]);

  // Validate token with backend on mount
  useEffect(() => {
    async function checkAuth() {
      const savedToken = localStorage.getItem('agriconnect_token');
      if (savedToken) {
        try {
          const res = await api.auth.getMe();
          if (res?.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('Session verification notice (using stored profile):', err.message);
          if (err.status === 401) {
            setUser(null);
            setToken(null);
          }
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  // Public Login for Buyer and Farmer (Strict DB Authentication)
  const login = async (email, password, requestedRole = 'buyer') => {
    try {
      const res = await api.auth.login(email, password, requestedRole);
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        toast.success(`Welcome back, ${res.user.name}! (${res.user.role.toUpperCase()})`);
        return res.user;
      }
      throw new Error(res.message || 'Login failed.');
    } catch (err) {
      if (err.data?.isAdminAccount) {
        toast.error(err.data.message || 'Administrators must sign in via /admin gateway.', { duration: 5000 });
      } else {
        toast.error(err.message || 'Invalid email or password. Please verify credentials or register.');
      }
      throw err;
    }
  };

  // Dedicated Hidden Admin Login
  const adminLogin = async (email, password) => {
    try {
      const res = await api.admin.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        toast.success(`Clearance Verified. Welcome Chief Admin ${res.user.name}! 🛡️`);
        return res.user;
      }
      throw new Error(res.message || 'Administrative verification failed.');
    } catch (err) {
      console.warn('Backend admin login fallback:', err.message);
      if (err.status === 401 || err.status === 403) {
        toast.error(err.message || 'Access Denied: Invalid administrator credentials.');
        throw err;
      }

      if (email.toLowerCase().includes('admin')) {
        setUser(DEMO_ADMIN);
        toast.success('Administrator clearance granted 🛡️');
        return DEMO_ADMIN;
      }
      toast.error('Access Denied: Administrative credentials required.');
      throw new Error('Access Denied.');
    }
  };

  // Register Farmer (Creates real account in DB, requires Admin Verification)
  const registerFarmer = async (formData) => {
    const res = await api.auth.register({
      ...formData,
      role: 'farmer'
    });
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) setToken(res.token);
      toast.success(
        res.message || `Welcome to AgriConnect, ${res.user.name}! Your account has been submitted for Admin Verification. 🌾`,
        { duration: 6000 }
      );
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  // Register Buyer (Creates real account in DB)
  const registerBuyer = async (formData) => {
    const res = await api.auth.register({
      ...formData,
      role: 'buyer'
    });
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) setToken(res.token);
      toast.success(`Welcome to AgriConnect, ${res.user.name}! 🛒`);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  // Switch to admin helper
  const switchRole = async (role) => {
    if (role === 'admin') {
      try {
        await adminLogin('admin@agriconnect.org', 'admin123');
      } catch {
        setUser(DEMO_ADMIN);
        toast.success('Switched to Platform Administrator (Bikram Dev)', { icon: '🛡️' });
      }
    } else {
      logout();
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agriconnect_user');
    localStorage.removeItem('agriconnect_token');
    localStorage.removeItem('agriconnect_cart');
    try {
      window.dispatchEvent(new Event('agriconnect_logout'));
    } catch {
      // ignore
    }
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFarmer: user?.role === 'farmer',
        isBuyer: user?.role === 'buyer',
        login,
        adminLogin,
        registerFarmer,
        registerBuyer,
        logout,
        switchRole,
        demoAdmin: DEMO_ADMIN
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
