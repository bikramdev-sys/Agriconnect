import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Server,
  Fingerprint,
  ArrowLeft,
  Activity,
  Cpu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@agriconnect.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  const { isAdmin, adminLogin } = useAuth();
  const navigate = useNavigate();

  // If already authenticated as administrator, navigate directly to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/dashboard/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorNotice('');

    if (!email || !password) {
      toast.error('Admin email and master password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedAdmin = await adminLogin(email, password);
      if (loggedAdmin && loggedAdmin.role === 'admin') {
        navigate('/dashboard/admin');
      }
    } catch (err) {
      setErrorNotice(err.message || 'Access Denied: Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@agriconnect.org');
    setPassword('admin123');
    setErrorNotice('');
    toast('Directorate Admin credentials pre-filled.', { icon: '🛡️' });
  };

  return (
    <div className="min-h-screen w-full bg-[#050D08] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-forest-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Background Subtle Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #10B981 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <Logo to="/" variant="dark" />
          <span className="hidden sm:inline-block h-4 w-px bg-emerald-900/60" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/20 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>Admin Back-Office</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1E13] border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NODE: SECURE /admin</span>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-semibold text-gray-400 hover:text-white flex items-center space-x-1 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Marketplace</span>
          </Link>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#0A1710]/95 backdrop-blur-2xl border border-emerald-500/25 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-emerald-950/80 relative">
          
          {/* Subtle Top Border Glow */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />

          {/* Security Badge & Pre-fill */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-emerald-900/40">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-tight">Directorate Gateway</h2>
                <p className="text-[11px] text-emerald-400/80 font-mono">Restricted Management Access</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 font-semibold transition-all active:scale-95 shadow-xs"
              title="Click to fill pre-configured admin credentials"
            >
              Fill Credentials ⚡
            </button>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Authentication Failed</p>
                <p className="text-[11px] text-red-200/90 mt-0.5">{errorNotice}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 mb-1.5">
                Admin Directorate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agriconnect.org"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#06110B] border border-emerald-800/50 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                  Master Security Password
                </label>
                <span className="text-[10px] text-emerald-500/70 font-mono">ENCRYPTED BCRYPT</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#06110B] border border-emerald-800/50 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-forest-600 hover:from-emerald-500 hover:to-forest-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950 transition-all active:scale-[0.99] flex items-center justify-center space-x-2 border border-emerald-400/30 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Clearance...</span>
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Authorize & Enter Back-Office</span>
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </>
              )}
            </button>
          </form>

          {/* Gateway Status Footer */}
          <div className="mt-6 pt-5 border-t border-emerald-900/40 text-[11px] text-gray-400 flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-gray-400">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gateway: <strong>/admin</strong></span>
            </span>
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Public Login Portal →
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Compliance & Security Disclaimer */}
      <footer className="relative z-10 w-full max-w-md mx-auto text-center text-[11px] text-gray-500 py-3 space-y-1">
        <p className="flex items-center justify-center gap-1.5 font-mono">
          <Fingerprint className="w-3 h-3 text-emerald-500" />
          <span>AgriConnect Digital Directorate • SuperAdmin Session Token</span>
        </p>
        <p className="text-[10px] text-gray-600">
          Direct administrative control strictly reserved for verified agricultural council delegates.
        </p>
      </footer>
    </div>
  );
}
