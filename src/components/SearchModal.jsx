import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { products } = useCart();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.farmerName.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  const handleSelectProduct = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/marketplace?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center p-4 border-b border-forest-100">
          <Search className="w-5 h-5 text-forest-600 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by crop, farmer name, or farm state (e.g. Tomatoes, Nashik)..."
            className="w-full px-3 py-2 text-base font-medium text-forest-950 placeholder:text-agriText-muted/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-agriText-muted hover:text-forest-900 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-3 py-1.5 rounded-xl text-xs font-bold text-forest-800 bg-forest-50 hover:bg-forest-100"
          >
            Esc
          </button>
        </form>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-agriText-muted">
              {query ? `Search Results (${filtered.length})` : 'Popular Fresh Picks'}
            </span>
            {query && (
              <button
                onClick={handleSearchSubmit}
                className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
              >
                <span>View all in Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-agriText-muted text-sm">
              No produce matching "{query}". Try searching for 'Potatoes', 'Apples', or 'Nashik'.
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product.id)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-forest-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-forest-100"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display font-bold text-sm text-forest-950 group-hover:text-forest-700">
                        {product.name}
                      </h4>
                      {product.isOrganic && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-fresh/15 text-forest-800">
                          Organic
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-agriText-muted flex items-center gap-1">
                      <span>{product.farmerName}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-forest-500" />
                      <span>{product.location}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-bold text-forest-950 text-sm">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-agriText-muted">/{product.unit}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
