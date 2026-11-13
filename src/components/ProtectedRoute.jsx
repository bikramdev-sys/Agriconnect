import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, ArrowRight, ShieldAlert, Store } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Platform Administrator';
    if (role === 'farmer') return 'Verified Farmer';
    return 'Buyer';
  };

  // If not authenticated
  if (!isAuthenticated) {
    if (requiredRole === 'admin') {
      return (
        <div className="min-h-screen pt-32 pb-20 bg-[#07130D] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0D1F17] rounded-3xl p-8 border border-emerald-500/30 shadow-2xl text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <ShieldAlert className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">
              Directorate Clearance Required
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Administrative functions are restricted. Please sign in through the official hidden administrator gateway.
            </p>

            <div className="space-y-3">
              <Link
                to="/admin"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-600 hover:from-emerald-500 hover:to-forest-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Go to Secure /admin Gateway</span>
              </Link>
              <Link
                to="/"
                className="block w-full py-2.5 rounded-xl border border-emerald-900 text-gray-400 font-bold text-xs hover:bg-emerald-950/50"
              >
                Return to Public Homepage
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAFAF5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-forest-100 shadow-soft text-center">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-4 border border-forest-200">
            <Lock className="w-8 h-8 text-forest-800" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-forest-950 mb-2">
            Authentication Required
          </h2>
          <p className="text-xs text-agriText-muted leading-relaxed mb-6">
            You need to be signed in as a <strong>{getRoleLabel(requiredRole)}</strong> to access this section.
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              state={{ from: location }}
              className="w-full py-3.5 rounded-2xl bg-forest-900 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:bg-forest-800 transition-all active:scale-95"
            >
              <Sprout className="w-4 h-4 text-fresh" />
              <span>Sign in to Your Account</span>
            </Link>
            <Link
              to="/register"
              className="block w-full py-2.5 rounded-xl border border-forest-200 text-forest-900 font-bold text-xs hover:bg-forest-50"
            >
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If role is required and user has a different role
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return (
        <div className="min-h-screen pt-32 pb-20 bg-[#07130D] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0D1F17] rounded-3xl p-8 border border-red-500/30 shadow-2xl text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">
              Unauthorized Access
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              You are currently logged in as a <strong>{user.role}</strong> ({user.name}). Administrative dashboard access is strictly restricted.
            </p>
            <div className="space-y-3">
              <Link
                to="/admin"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
              >
                <span>Switch to Admin via /admin</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
              <Link
                to={user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/buyer'}
                className="block w-full py-2.5 rounded-xl border border-gray-700 text-gray-300 font-bold text-xs hover:bg-gray-800"
              >
                Back to My Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAFAF5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-forest-100 shadow-soft text-center">
          <h2 className="font-display font-extrabold text-2xl text-forest-950 mb-2">
            Role Permission Notice
          </h2>
          <p className="text-xs text-agriText-muted mb-6">
            You are currently viewing as a <strong>{user.role}</strong>. This section requires <strong>{getRoleLabel(requiredRole)}</strong> access.
          </p>
          <div className="space-y-3">
            <Link
              to={user.role === 'admin' ? '/admin' : user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/buyer'}
              className="w-full py-3.5 rounded-2xl bg-forest-900 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:bg-forest-800 active:scale-95"
            >
              <span>Go to My Dashboard ({getRoleLabel(user.role)})</span>
              <ArrowRight className="w-4 h-4 text-fresh" />
            </Link>
            <Link
              to="/login"
              onClick={logout}
              className="block w-full py-2.5 rounded-xl border border-forest-200 text-forest-900 font-bold text-xs hover:bg-forest-50"
            >
              Sign Out & Login With Different Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
