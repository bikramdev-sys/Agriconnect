import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, Home, Store } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAFAF5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-forest-100 shadow-soft text-center">
        <div className="w-20 h-20 rounded-3xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-4 border border-forest-200 shadow-xs">
          <Sprout className="w-10 h-10 animate-bounce" />
        </div>
        <p className="text-sm font-bold text-forest-700 mb-2">
          404 Error: Page Not Found
        </p>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-forest-950 mb-3">
          Lost in the Fields?
        </h1>
        <p className="text-xs sm:text-sm text-agriText-muted leading-relaxed mb-8">
          The crop or page you are searching for might have been harvested, relocated, or doesn’t exist on this farm plot.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-3 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95"
          >
            <Home className="w-4 h-4 text-fresh" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/marketplace"
            className="flex-1 py-3 rounded-2xl bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
          >
            <Store className="w-4 h-4 text-forest-700" />
            <span>Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
