import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ArrowLeft,
  Truck,
  Leaf,
  Check,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { farmers } from '../data/farmers';
import ProductCard from '../components/ProductCard';
import ContactFarmerModal from '../components/ContactFarmerModal';
import { CANONICAL_FARMER_AVATARS, getCartoonAvatar } from '../utils/avatar';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, isFavorite, toggleFavorite } = useCart();
  const { isAdmin } = useAuth();

  // Find product
  const product = products.find((p) => p.id === id) || products[0];
  const farmer = farmers.find((f) => f.id === product?.farmerId) || {
    id: 'farmer-default',
    name: product?.farmerName || 'Verified Local Farmer',
    farmName: 'Organic Soil Producer',
    location: product?.location || 'Nashik, Maharashtra',
    avatar: CANONICAL_FARMER_AVATARS[product?.farmerName] || product?.farmerAvatar || '/avatars/ramesh-patel.jpg',
    rating: 4.9,
    reviewsCount: 120,
    bio: 'Dedicated to chemical-free agriculture, natural pest control, and fair customer pricing.'
  };

  const farmerAvatarSrc = CANONICAL_FARMER_AVATARS[farmer.name] || CANONICAL_FARMER_AVATARS[product?.farmerName] || farmer.avatar || getCartoonAvatar(farmer.name);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.image);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const maxAvailable = Number(product?.availableQuantity) || 0;
  const isOutOfStock = !product?.isAvailable || maxAvailable <= 0;

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(isOutOfStock ? 0 : Math.min(product.minOrderQty || 1, maxAvailable));
      window.scrollTo(0, 0);
    }
  }, [id, product, isOutOfStock, maxAvailable]);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold text-forest-950">Produce Not Found</h2>
        <Link to="/marketplace" className="mt-4 inline-block text-forest-700 font-bold">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(product.id);

  const handleIncrement = () => {
    if (quantity < maxAvailable) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    const minQty = product.minOrderQty || 1;
    if (quantity > minQty) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (maxAvailable <= 0) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (maxAvailable <= 0) return;
    const added = addToCart(product, quantity);
    if (added) {
      navigate('/cart');
    }
  };

  // Related produce in the same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-bold text-forest-800 hover:text-forest-950 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Produce Catalog</span>
        </button>

        {/* Product Showcase Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-forest-100 shadow-soft mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-forest-50 border border-forest-100 shadow-xs">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Organic badge */}
                {product.isOrganic && (
                  <div className="absolute top-4 left-4 glass-card px-3 py-1.5 rounded-full text-xs font-bold text-forest-900 flex items-center space-x-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-fresh" />
                    <span>Certified Organic Soil</span>
                  </div>
                )}

                {/* Heart button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-4 right-4 p-3 rounded-2xl glass-card hover:scale-105 active:scale-95 transition-all shadow-sm ${
                    favorited ? 'text-red-500 fill-red-500' : 'text-forest-900'
                  }`}
                  aria-label="Add to favorites"
                >
                  <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImage === imgUrl ? 'border-forest-700 shadow-md scale-102' : 'border-forest-100 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`${product.name} preview`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details & Purchase Form */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category & Availability */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-forest-800 bg-forest-100/90 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-xs font-semibold flex items-center gap-1.5 text-forest-700">
                    <span className={`w-2 h-2 rounded-full ${maxAvailable > 0 ? 'bg-fresh animate-ping' : 'bg-red-400'}`} />
                    <span>{maxAvailable > 0 ? `${maxAvailable} ${product.unit} Available in Field` : 'Currently Sold Out'}</span>
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-forest-950 mb-3">
                  {product.name}
                </h1>

                {/* Farmer mini card */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/70 border border-forest-100/90 mb-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={farmerAvatarSrc}
                      alt={farmer.name}
                      onError={(e) => {
                        e.currentTarget.src = getCartoonAvatar(farmer.name);
                      }}
                      className="w-11 h-11 rounded-xl object-cover border border-forest-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-forest-950">
                        {farmer.name}
                      </h4>
                      <p className="text-xs text-agriText-muted flex items-center">
                        <MapPin className="w-3 h-3 text-forest-600 mr-1 shrink-0" />
                        {farmer.farmName || product.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-forest-300 text-xs font-bold text-forest-900 hover:bg-forest-100 transition-colors flex items-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-forest-700" />
                    <span>Contact Farmer</span>
                  </button>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline space-x-2 mb-6 pb-6 border-b border-forest-100">
                  <span className="font-display font-black text-3xl sm:text-4xl text-forest-950">
                    ₹{product.price}
                  </span>
                  <span className="text-base text-agriText-muted font-bold">/ {product.unit}</span>
                  <span className="ml-3 px-2.5 py-1 rounded-full text-xs font-bold bg-fresh/15 text-forest-800">
                    Zero Middleman Fee
                  </span>
                </div>

                {/* Description */}
                <p className="text-agriText-muted text-sm sm:text-base leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Key metadata pills */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-3 rounded-2xl bg-forest-50/60 border border-forest-100 flex items-center space-x-2.5">
                    <Calendar className="w-4 h-4 text-forest-700 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-agriText-muted">Harvested</p>
                      <p className="text-xs font-bold text-forest-950">{product.harvestDate}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-forest-50/60 border border-forest-100 flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-agriText-muted">Shelf Life</p>
                      <p className="text-xs font-bold text-forest-950">{product.shelfLife}</p>
                    </div>
                  </div>
                </div>

                {/* Real-time Stock Availability Banner */}
                {isOutOfStock ? (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start space-x-3 mb-6 shadow-xs">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-red-950">Currently Out of Stock</p>
                      <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                        All harvest of this produce has been ordered. The farmer will list a fresh batch upon the next picking cycle.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-forest-50/70 border border-forest-100 mb-6">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${maxAvailable <= 10 ? 'bg-amber-500 animate-pulse' : 'bg-fresh'}`} />
                    <span className={`text-xs font-bold ${maxAvailable <= 10 ? 'text-amber-900' : 'text-forest-900'}`}>
                      {maxAvailable <= 10
                        ? `⚠️ Hurry, only ${maxAvailable} ${product.unit} remaining in current harvest!`
                        : `✅ In Stock: ${maxAvailable} ${product.unit} available for immediate direct delivery`}
                    </span>
                  </div>
                )}
              </div>

              {/* Purchase Actions & Quantity Selector */}
              <div className="pt-6 border-t border-forest-100 space-y-4">
                {isAdmin ? (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                      <ShieldAlert className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        Administrator Catalog Clearance
                      </p>
                      <p className="text-xs text-amber-900 mt-1">
                        Produce purchase, cart additions, and checkouts are disabled for Administrator accounts.
                      </p>
                    </div>
                    <Link
                      to="/admin"
                      className="inline-block px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      Manage in Control Center →
                    </Link>
                  </div>
                ) : isOutOfStock ? (
                  <div className="space-y-3 pt-2">
                    <button
                      disabled
                      className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 font-extrabold text-sm border border-gray-200 cursor-not-allowed flex items-center justify-center space-x-2 shadow-xs"
                    >
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span>Out of Stock — Sold Out</span>
                    </button>
                    <p className="text-xs text-center text-agriText-muted">
                      Need updates? Use <strong>"Contact Farmer"</strong> above to inquire about the next harvest date.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-forest-950">
                        Order Quantity:
                      </span>
                      
                      {/* Quantity selector */}
                      <div className="flex items-center space-x-3 bg-forest-50 p-1.5 rounded-2xl border border-forest-200">
                        <button
                          onClick={handleDecrement}
                          disabled={quantity <= (product.minOrderQty || 1)}
                          className="w-8 h-8 rounded-xl bg-white text-forest-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-xs active:scale-95"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-display font-extrabold text-forest-950 text-base min-w-[36px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={handleIncrement}
                          disabled={quantity >= maxAvailable}
                          className="w-8 h-8 rounded-xl bg-white text-forest-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-xs active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-agriText-muted">
                      <span>Minimum order: {product.minOrderQty || 1} {product.unit}</span>
                      <span>Total: <strong className="text-forest-950 text-sm font-extrabold">₹{product.price * quantity}</strong></span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleAddToCart}
                        disabled={maxAvailable <= 0}
                        className="w-full py-3.5 rounded-2xl bg-white hover:bg-forest-50 text-forest-900 font-extrabold text-sm border-2 border-forest-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-xs active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4 text-forest-700" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        disabled={maxAvailable <= 0}
                        className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-fresh" />
                        <span>Proceed to Checkout</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-agriText-muted pt-1">
                      🌿 100% Direct Farm Guarantee • Cold Dispatch Within 24h
                    </p>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Related Produce Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                  More in {product.category}
                </span>
                <h3 className="font-display font-extrabold text-2xl text-forest-950">
                  Related Fresh Harvests
                </h3>
              </div>
              <Link
                to={`/marketplace?category=${product.category}`}
                className="text-xs font-bold text-forest-800 hover:text-forest-600"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd.id} product={relProd} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Contact Farmer Modal */}
      <ContactFarmerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        farmer={farmer}
        productName={product.name}
      />
    </div>
  );
}
