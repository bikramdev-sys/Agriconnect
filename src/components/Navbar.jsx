import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Sprout, 
  LayoutDashboard,
  Store,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

export default function Navbar({ onOpenSearch }) {
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout, switchRole } = useAuth();
  const { totalCount, favorites } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'For Farmers', path: '/for-farmers' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const getDashboardPath = () => {
    if (isAdmin) return '/dashboard/admin';
    if (isFarmer) return '/dashboard/farmer';
    return '/dashboard/buyer';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAFAF5]/98 backdrop-blur-md shadow-xs border-b border-forest-100 py-2.5'
          : 'bg-[#FAFAF5]/95 backdrop-blur-sm border-b border-forest-100/60 py-3'
      }`}
    >
      <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo - Shifted little bit left */}
          <div className="shrink-0 -ml-1 sm:-ml-2 xl:-ml-3">
            <Logo to="/" variant="light" />
          </div>

          {/* Center Navigation Links - Desktop (Strictly single-line, cross-browser) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0">
            {navLinks.map((link) => {
              const isCurrent = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2.5 xl:px-3.5 py-1.5 rounded-xl text-[13px] xl:text-sm font-semibold transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-0 ${
                    isCurrent
                      ? 'text-forest-950 font-bold bg-forest-100/90 shadow-2xs'
                      : 'text-forest-900/75 hover:text-forest-950 hover:bg-forest-100/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth - Shifted little bit right */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0 -mr-1 sm:-mr-2 xl:-mr-3">
            {/* Favorites Icon */}
            <Link
              to="/marketplace?favorites=true"
              className="relative p-2 rounded-xl text-forest-800 hover:text-forest-950 hover:bg-forest-100/60 transition-colors focus:outline-none"
              title="Favorite produce"
              aria-label="Favorites"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : 'text-forest-800'}`} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button / Admin Quick Portal */}
            {isAdmin ? (
              <Link
                to="/admin"
                className="relative px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold transition-all flex items-center space-x-1.5 border border-amber-200 shadow-2xs text-xs"
                title="Admin Control Center"
              >
                <ShieldAlert className="w-4 h-4 text-amber-800" />
                <span className="hidden sm:inline">Admin Center</span>
              </Link>
            ) : (
              <Link
                to="/cart"
                className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 font-semibold transition-all flex items-center space-x-1.5 border border-forest-200/60 shadow-2xs focus:outline-none"
                title="View Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-forest-800" />
                <span className="hidden sm:inline text-xs font-bold text-forest-900">Cart</span>
                {totalCount > 0 && (
                  <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-forest-700 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 p-1 sm:pr-2.5 rounded-xl border border-forest-200 hover:bg-forest-50 transition-colors focus:outline-none"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-lg object-cover border border-forest-300"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-forest-950 truncate max-w-[85px]">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <span className="text-[9px] text-forest-600 font-bold uppercase block -mt-0.5">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-agriText-muted" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl border border-forest-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-forest-50">
                      <p className="text-sm font-bold text-forest-950">{user?.name}</p>
                      <p className="text-xs text-agriText-muted truncate">{user?.email}</p>
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isAdmin
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isFarmer
                          ? 'bg-forest-100 text-forest-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isAdmin ? '🛡️ Platform Admin' : isFarmer ? '🌾 Verified Farmer' : '🛒 Buyer Account'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-forest-900 hover:bg-forest-50 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-forest-600" />
                        <span>
                          {isAdmin ? 'Admin Portal' : isFarmer ? 'Farmer Dashboard' : 'Buyer Dashboard'}
                        </span>
                      </Link>

                      <Link
                        to="/marketplace"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-forest-900 hover:bg-forest-50 font-medium"
                      >
                        <Store className="w-4 h-4 text-forest-600" />
                        <span>Browse Marketplace</span>
                      </Link>
                    </div>

                    <div className="border-t border-forest-50 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1 sm:space-x-1.5">
                <Link
                  to="/login"
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-forest-900 hover:text-forest-700 transition-colors focus:outline-none whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all active:scale-95 whitespace-nowrap focus:outline-none"
                >
                  <Sprout className="w-3.5 h-3.5 text-fresh hidden sm:inline" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-forest-900 hover:bg-forest-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-forest-100 shadow-xl px-5 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isCurrent = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-left transition-colors focus:outline-none ${
                    isCurrent
                      ? 'text-forest-950 bg-forest-100/90 font-bold'
                      : 'text-forest-900 hover:bg-forest-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-forest-800" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-forest-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-forest-200 text-center font-bold text-sm text-forest-900 hover:bg-forest-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-forest-900 text-center font-bold text-sm text-white shadow-xs flex items-center justify-center space-x-2 active:scale-95 transition-all"
                >
                  <Sprout className="w-4 h-4 text-fresh" />
                  <span>Join as Farmer or Buyer</span>
                </Link>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-forest-900 text-white font-bold text-sm text-center block shadow-xs"
                >
                  Go to {isAdmin ? 'Admin' : isFarmer ? 'Farmer' : 'Buyer'} Portal
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-sm text-red-600 font-semibold"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
