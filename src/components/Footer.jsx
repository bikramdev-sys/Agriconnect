import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, Heart, ShieldCheck, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to AgriConnect farm dispatch updates! 🌾');
    setEmail('');
  };

  return (
    <footer className="bg-forest-950 text-[#FAFAF5] pt-16 pb-10 border-t border-forest-900 relative overflow-hidden">
      {/* Decorative leaf watermarks */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-fresh/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-900">
          
          {/* Brand & Mission column */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <Logo to="/" variant="dark" />
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering farmers with direct-to-buyer agricultural commerce. 
              Fresh harvest transparency, zero unnecessary middlemen, and equitable food systems.
            </p>

            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-fresh shrink-0" />
                <span>Agricultural Technology Hub, Pune & Bengaluru, India</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-fresh shrink-0" />
                <span>Farmer Support Hotline: 1800-AGRI-CONNECT (Toll Free)</span>
              </p>
            </div>
          </div>

          {/* Quick Links: Marketplace */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/marketplace?category=Vegetables" className="hover:text-fresh transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fruits" className="hover:text-fresh transition-colors">
                  Orchard Fruits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Grains" className="hover:text-fresh transition-colors">
                  Aged Basmati & Grains
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=organic" className="hover:text-fresh transition-colors">
                  Certified Organic
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Dairy" className="hover:text-fresh transition-colors">
                  Gir Cow A2 Dairy
                </Link>
              </li>
            </ul>
          </div>

          {/* Farmer & Platform Navigation */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
              Explore & Learn
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/how-it-works" className="hover:text-fresh transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/for-farmers" className="hover:text-fresh transition-colors">
                  For Farmers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-fresh transition-colors">
                  About AgriConnect
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-fresh transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/register?role=farmer" className="hover:text-fresh transition-colors">
                  Join as a Farmer
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-4">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-2">
              Fresh Harvest Newsletter
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Receive weekly updates on upcoming field harvests, seasonal crop arrivals, and farmer spotlights.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-800 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-fresh"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-fresh text-forest-950 font-bold hover:bg-fresh-light transition-all active:scale-95 shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                🌱 No spam. Only fresh agricultural news and direct deals.
              </p>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} AgriConnect Digital Agriculture Inc. All mock rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            <Link to="/about" className="hover:text-gray-300 transition-colors">Terms of Trade</Link>
            <Link to="/about" className="hover:text-gray-300 transition-colors">Privacy Notice</Link>
            <Link to="/how-it-works" className="hover:text-gray-300 transition-colors">Organic Verification</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Support Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
