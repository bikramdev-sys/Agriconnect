import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Truck,
  CheckCircle,
  Tag,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, createOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Coupon state
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');

  // Checkout Modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: 'Plot 42, Green Valley Enclave, Pune, Maharashtra - 411045',
    paymentMethod: 'Direct Farm Pay (UPI on Delivery)'
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'FRESH20' || promoCode.toUpperCase() === 'AGRI10') {
      const discount = Math.round(subtotal * 0.15);
      setDiscountAmount(discount);
      setAppliedPromo(promoCode.toUpperCase());
      toast.success(`Coupon "${promoCode.toUpperCase()}" applied! You saved ₹${discount}`);
    } else {
      toast.error('Invalid promo code. Try "FRESH20" for 15% discount!');
    }
  };

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.address) {
      toast.error('Please fill in complete delivery details.');
      return;
    }

    const order = createOrder({
      customerName: checkoutData.name,
      customerEmail: user?.email || '',
      customerPhone: checkoutData.phone,
      address: checkoutData.address,
      discount: discountAmount,
      paymentMethod: checkoutData.paymentMethod
    });

    setIsCheckoutOpen(false);
    navigate('/dashboard/buyer?tab=orders');
  };

  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#FAFAF5] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 sm:p-12 bg-white rounded-3xl border border-forest-100 shadow-soft text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-10 h-10 text-amber-700" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-forest-950 mb-2">
            Administrator Clearance
          </h2>
          <p className="text-agriText-muted text-sm leading-relaxed mb-6">
            Administrator accounts govern the platform. Produce purchasing and cart checkouts are disabled for Admin profiles.
          </p>
          <div className="space-y-3">
            <Link
              to="/admin"
              className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-fresh" />
              <span>Go to Admin Control Center</span>
            </Link>
            <Link
              to="/marketplace"
              className="block w-full py-2.5 rounded-xl border border-forest-200 text-forest-900 font-bold text-xs hover:bg-forest-50"
            >
              Browse Public Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#FAFAF5] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 sm:p-12 bg-white rounded-3xl border border-forest-100 shadow-soft text-center">
          <div className="w-20 h-20 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-forest-950 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-agriText-muted text-sm leading-relaxed mb-6">
            You haven’t added any fresh harvests yet. Explore certified produce directly from local farms.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4 text-fresh" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-700 hover:text-forest-950 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
              Shopping Cart ({cartItems.length} items)
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-800 self-start sm:self-auto px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-6 border border-forest-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Item Thumbnail & Basic Info */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-forest-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-display font-bold text-base sm:text-lg text-forest-950 hover:text-forest-700"
                      >
                        {item.name}
                      </Link>
                      {item.isOrganic && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fresh/15 text-forest-800">
                          Organic
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-agriText-muted mt-0.5">
                      Farmer: <span className="font-semibold text-forest-900">{item.farmerName}</span>
                    </p>
                    <p className="text-xs text-forest-700 font-bold mt-1">
                      ₹{item.price} / {item.unit}
                    </p>
                  </div>
                </div>

                {/* Quantity Modifier & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-forest-50">
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2.5 bg-forest-50 p-1 rounded-2xl border border-forest-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-white text-forest-900 hover:bg-forest-100 flex items-center justify-center font-bold shadow-xs active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-display font-extrabold text-sm text-forest-950 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-white text-forest-900 hover:bg-forest-100 flex items-center justify-center font-bold shadow-xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-display font-black text-lg text-forest-950">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-agriText-muted hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft lg:sticky lg:top-28">
            <h3 className="font-display font-bold text-lg text-forest-950 pb-4 border-b border-forest-100 mb-5">
              Order Summary
            </h3>

            {/* Calculations */}
            <div className="space-y-3 text-sm pb-5 border-b border-forest-100">
              <div className="flex justify-between text-agriText-muted">
                <span>Produce Subtotal</span>
                <span className="font-bold text-forest-950">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-agriText-muted">
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-forest-600" />
                  Estimated Farm Dispatch
                </span>
                <span className="font-bold text-forest-950">
                  {deliveryFee === 0 ? <span className="text-fresh">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-forest-700 font-semibold">
                  <span>Coupon Discount ({appliedPromo})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {subtotal < 800 && (
                <p className="text-[11px] text-agriText-muted bg-forest-50 p-2.5 rounded-xl border border-forest-100">
                  💡 Add ₹{800 - subtotal} more of fresh harvests to qualify for <strong>FREE direct farm delivery</strong>!
                </p>
              )}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="py-4 border-b border-forest-100">
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-2">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FRESH20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-forest-50 border border-forest-200 text-xs font-bold text-forest-950 uppercase focus:outline-none focus:border-forest-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Grand Total */}
            <div className="py-4 flex justify-between items-baseline mb-6">
              <span className="font-display font-bold text-base text-forest-950">Total Payable</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-forest-950">
                ₹{grandTotal}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-fresh" />
            </button>

            <div className="mt-4 pt-4 border-t border-forest-50 space-y-1.5 text-xs text-agriText-muted">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-fresh" />
                100% Direct Farmer Payment
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-fresh" />
                Freshness Guaranteed On Arrival
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-forest-900 p-6 text-white">
              <h3 className="font-display font-extrabold text-xl text-white">
                Confirm Direct Farm Order
              </h3>
              <p className="text-xs text-gray-300 mt-1">
                Enter your delivery address to route your produce directly from the field.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                  placeholder="e.g. Priya Sundaram"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs text-forest-950 font-medium focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                  placeholder="+91 97654 32100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs text-forest-950 font-medium focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows="2"
                  required
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                  placeholder="Flat/House No., Street, Landmark, City, Pincode"
                  className="w-full p-3 rounded-xl border border-forest-200 text-xs text-forest-950 font-medium focus:outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-1">
                  Payment Method (Demo Mode)
                </label>
                <select
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs text-forest-950 font-semibold focus:outline-none focus:border-forest-600 bg-forest-50"
                >
                  <option value="Direct Farm Pay (UPI on Delivery)">Direct Farm Pay (UPI on Delivery)</option>
                  <option value="Direct Bank Transfer to Farmer">Direct Bank Transfer to Farmer</option>
                  <option value="Cash on Field Delivery">Cash on Field Delivery</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-200 flex justify-between items-center text-xs">
                <span className="font-bold text-forest-900">Total Payable:</span>
                <span className="font-display font-extrabold text-base text-forest-950">₹{grandTotal}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-forest-200 text-xs font-bold text-agriText-muted hover:bg-forest-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-extrabold shadow-md active:scale-95 transition-all"
                >
                  Confirm & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
