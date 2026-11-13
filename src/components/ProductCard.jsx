import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, MapPin, Sparkles, Check, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, isFavorite, toggleFavorite } = useCart();
  const { isAdmin } = useAuth();
  const favorited = isFavorite(product.id);

  const handleCardClick = (e) => {
    // Avoid triggering when clicking buttons
    if (e.target.closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className="group bg-white rounded-3xl overflow-hidden border border-forest-100/80 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {product.isOrganic && (
              <span className="glass-card px-2.5 py-1 rounded-full text-[11px] font-bold text-forest-900 flex items-center gap-1 shadow-xs backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-fresh" />
                Organic
              </span>
            )}
            <span className="bg-forest-950/70 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleToggleFav}
            aria-label="Add to favorites"
            className={`p-2 rounded-full glass-card hover:scale-110 active:scale-90 transition-transform shadow-xs ${
              favorited ? 'text-red-500 fill-red-500 bg-white' : 'text-forest-900 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Stock / Availability Pill at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 glass-card px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-forest-950">
          <span className={`w-2 h-2 rounded-full ${product.availableQuantity > 0 ? 'bg-fresh' : 'bg-red-400'}`} />
          <span>{product.availableQuantity > 0 ? `${product.availableQuantity} ${product.unit} in harvest` : 'Sold Out'}</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Farmer & Location Line */}
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={product.farmerAvatar}
              alt={product.farmerName}
              className="w-6 h-6 rounded-full object-cover border border-forest-200"
            />
            <span className="text-xs font-semibold text-forest-900 truncate">
              {product.farmerName}
            </span>
            <span className="text-forest-300">•</span>
            <span className="text-xs text-agriText-muted flex items-center truncate">
              <MapPin className="w-3 h-3 text-forest-600 mr-0.5 shrink-0" />
              {product.location.split(',')[0]}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-display font-bold text-base sm:text-lg text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Freshness / Harvest info */}
          <p className="text-xs text-agriText-muted mb-4 line-clamp-1">
            Harvested: <span className="font-medium text-forest-800">{product.harvestDate}</span>
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-forest-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-agriText-muted font-medium block">Direct Price</span>
            <div className="flex items-baseline space-x-1">
              <span className="font-display font-extrabold text-xl text-forest-950">
                ₹{product.price}
              </span>
              <span className="text-xs text-agriText-muted font-semibold">/{product.unit}</span>
            </div>
          </div>

          {/* Action button */}
          {isAdmin ? (
            <span
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold cursor-default"
              title="Admin view: Produce purchasing is disabled for Admin accounts"
            >
              <span>Admin View</span>
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.availableQuantity <= 0}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
              title="Add to cart"
            >
              <Plus className="w-3.5 h-3.5 text-fresh" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
