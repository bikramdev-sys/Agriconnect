import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sprout, Store, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('buyer'); // 'buyer' | 'farmer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [adminNotice, setAdminNotice] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAdminNotice(false);

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    // Notice if someone accidentally enters admin on public portal
    if (email.toLowerCase().includes('admin')) {
      setAdminNotice(true);
      toast.error('Platform administrators must log in through the secure /admin gateway.', { duration: 5000 });
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login(email, password, selectedRole);
      if (loggedUser) {
        if (loggedUser.role === 'farmer') {
          navigate('/dashboard/farmer');
        } else {
          navigate('/dashboard/buyer');
        }
      }
    } catch (err) {
      if (err.data?.isAdminAccount) {
        setAdminNotice(true);
      } else {
        toast.error(err.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FAFAF5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-forest-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-8">
        
        {/* LEFT SIDE: Split Screen Agricultural Branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="mb-8">
              <Logo to="/" variant="dark" />
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
              Direct Farm Trade Portal.
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
              Connect directly with verified local farmers or source fresh harvests transparently with zero middleman markups.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <span className="w-5 h-5 rounded-full bg-fresh/20 text-fresh flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Fair, direct-to-farm transparent pricing</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <span className="w-5 h-5 rounded-full bg-fresh/20 text-fresh flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Real-time harvest date & soil freshness tracking</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <span className="w-5 h-5 rounded-full bg-fresh/20 text-fresh flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Dedicated accounts for Farmers & Buyers</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-forest-800/80">
            <div className="flex items-center space-x-2 text-xs text-fresh font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified AgriConnect Member Gateway</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Select your role on the right to sign in or explore with verified demo accounts.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="font-display font-extrabold text-2xl text-forest-950">
                Sign in to your account
              </h3>
              <p className="text-xs text-agriText-muted mt-1">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-bold text-forest-800 hover:text-forest-600 underline">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Role Selector Tabs (Farmer / Buyer Only) */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-forest-50 border border-forest-200/80 mb-5">
              <button
                type="button"
                onClick={() => { setSelectedRole('buyer'); setAdminNotice(false); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  selectedRole === 'buyer'
                    ? 'bg-white text-forest-950 shadow-xs border border-forest-200'
                    : 'text-forest-700 hover:text-forest-950'
                }`}
              >
                <Store className="w-4 h-4 text-forest-600" />
                <span>Buyer / Wholesale</span>
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('farmer'); setAdminNotice(false); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  selectedRole === 'farmer'
                    ? 'bg-white text-forest-950 shadow-xs border border-forest-200'
                    : 'text-forest-700 hover:text-forest-950'
                }`}
              >
                <Sprout className="w-4 h-4 text-forest-600" />
                <span>Farmer / Producer</span>
              </button>
            </div>

            {/* Admin Warning Banner if admin credentials entered */}
            {adminNotice && (
              <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Platform Administrator Notice</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    This portal is exclusively for Farmers and Buyers. To access administrative controls, please navigate to the dedicated hidden gateway at{' '}
                    <Link to="/admin" className="font-bold underline text-amber-950 hover:text-amber-800">
                      /admin
                    </Link>.
                  </p>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === 'farmer' ? 'ramesh.patel@patelfarms.org' : 'priya@freshbitemarts.com'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-forest-50/50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-agriText-muted hover:text-forest-900"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-agriText-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-forest-700"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => toast('Password reset link sent to registered email.', { icon: '📧' })}
                  className="font-bold text-forest-800 hover:text-forest-600"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : `Sign In as ${selectedRole === 'farmer' ? 'Farmer' : 'Buyer'}`}</span>
                <ArrowRight className="w-4 h-4 text-fresh" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-forest-50 text-center text-[11px] text-agriText-muted">
            🌱 Connect directly with verified farms. Don't have an account? <Link to="/register" className="font-bold text-forest-800 hover:underline">Register here</Link>.
          </div>
        </div>

      </div>
    </div>
  );
}
