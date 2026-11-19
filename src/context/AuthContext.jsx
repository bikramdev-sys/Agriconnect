import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedToken = localStorage.getItem('agriconnect_token');
      // Invalidate any legacy demo tokens immediately on load
      if (savedToken === 'demo-admin-token' || savedToken === 'admin-token') {
        localStorage.removeItem('agriconnect_token');
        localStorage.removeItem('agriconnect_user');
        return null;
      }
      const savedUser = localStorage.getItem('agriconnect_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === 'admin' && !savedToken) {
          localStorage.removeItem('agriconnect_user');
          return null;
        }
        if (parsed?.role === 'admin' || parsed?.id === 'admin-1' || parsed?.name === 'Bikram Dev') {
          parsed.avatar = '/avatars/bikram-dev.jpg';
          return parsed;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('agriconnect_token');
    if (savedToken === 'demo-admin-token' || savedToken === 'admin-token') {
      localStorage.removeItem('agriconnect_token');
      return null;
    }
    return savedToken || null;
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
        if (savedToken === 'demo-admin-token' || savedToken === 'admin-token') {
          // Force invalidate unauthorized legacy demo tokens
          localStorage.removeItem('agriconnect_token');
          localStorage.removeItem('agriconnect_user');
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }
        try {
          const res = await api.auth.getMe();
          if (res?.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('Session verification notice (using stored profile):', err.message);
          if (err.status === 401 || err.status === 403) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('agriconnect_token');
            localStorage.removeItem('agriconnect_user');
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

  // Dedicated Hidden Admin Login (Authenticated exclusively via server API & Bcrypt)
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
      console.warn('Backend admin login validation:', err.message);
      const errorMessage = err.message || 'Access Denied: Invalid administrator credentials.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
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
        logout
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
