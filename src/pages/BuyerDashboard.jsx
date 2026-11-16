import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Heart, 
  User, 
  Store, 
  LogOut, 
  MapPin, 
  Package, 
  Sparkles,
  ChevronRight,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getUserAvatar } from '../utils/avatar';
import ProductCard from '../components/ProductCard';

export default function BuyerDashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const { user, logout } = useAuth();
  const { orders, products, favorites, addToCart, refreshData } = useCart();
  const navigate = useNavigate();

  // Refresh backend data on mount
  React.useEffect(() => {
    if (typeof refreshData === 'function') {
      refreshData();
    }
  }, []);

  // Filter orders strictly for the authenticated buyer
  const buyerOrders = orders.filter((o) => {
    if (!user) return false;
    if (o.customerEmail && user.email && o.customerEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (o.customerId && user.id && o.customerId === user.id) return true;
    return false;
  });

  const pendingOrders = buyerOrders.filter((o) => o.status === 'Pending' || o.status === 'Processing');
  const completedOrders = buyerOrders.filter((o) => o.status === 'Delivered' || o.status === 'Accepted');
  const totalSpent = buyerOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const estimatedSavings = Math.round(totalSpent * 0.35); // 35% saved over retail middlemen

  // Dynamic Recharts Monthly Activity Data aggregated from real database orders
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMap = {};
  buyerOrders.forEach((o) => {
    const d = o.date ? new Date(o.date) : new Date(o.createdAt || Date.now());
    const m = isNaN(d.getTime()) ? 'Recent' : monthNames[d.getMonth()];
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, spend: 0, orders: 0 };
    monthlyMap[m].spend += Number(o.total) || 0;
    monthlyMap[m].orders += 1;
  });
  const rawMonthly = Object.values(monthlyMap);
  const monthlyData = rawMonthly.length > 0 ? rawMonthly : [
    { month: monthNames[new Date().getMonth()], spend: totalSpent, orders: buyerOrders.length }
  ];

  // Favorite items
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const recommendedProduce = products.filter((p) => p.featured).slice(0, 3);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Delivered</span>;
      case 'Accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Harvest Dispatched</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Awaiting Farmer</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={getUserAvatar(user, 'buyer')}
              alt={user?.name || 'Buyer'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-forest-300 shadow-xs"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                Buyer Dashboard
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950 mt-1">
                Welcome, {user?.name || 'Valued Buyer'}
              </h1>
              <p className="text-xs text-agriText-muted flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                <span>{user?.buyerType || 'Direct Customer'} • {user?.location || 'India'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/marketplace"
              className="px-4 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs hover:bg-forest-800"
            >
              <Store className="w-4 h-4 text-fresh" />
              <span>Browse Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-2.5 sm:p-3 lg:p-4 border border-forest-100 shadow-soft flex flex-row lg:flex-col overflow-x-auto space-x-1 sm:space-x-2 lg:space-x-0 lg:space-y-1 shrink-0 scrollbar-none w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs whitespace-nowrap shrink-0 transition-all ${
                activeTab === 'overview'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:bg-forest-50'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs whitespace-nowrap shrink-0 transition-all ${
                activeTab === 'orders'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:bg-forest-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>My Orders</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-forest-100 text-forest-800">
                {buyerOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs whitespace-nowrap shrink-0 transition-all ${
                activeTab === 'favorites'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:bg-forest-50'
              }`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>Favorites</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700">
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs whitespace-nowrap shrink-0 transition-all ${
                activeTab === 'profile'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:bg-forest-50'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Profile Settings</span>
            </button>

            <div className="lg:pt-3 lg:border-t lg:border-forest-50 shrink-0">
              <button
                onClick={logout}
                className="flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-9 space-y-8">
            
            {activeTab === 'overview' && (
              <>
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-forest-100 shadow-soft">
                    <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center mb-2">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-agriText-muted font-semibold">Total Orders</p>
                    <p className="font-display font-black text-2xl text-forest-950 mt-1">
                      {buyerOrders.length}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-forest-100 shadow-soft">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-agriText-muted font-semibold">Pending Orders</p>
                    <p className="font-display font-black text-2xl text-forest-950 mt-1">
                      {pendingOrders.length}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-forest-100 shadow-soft">
                    <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-agriText-muted font-semibold">Completed</p>
                    <p className="font-display font-black text-2xl text-forest-950 mt-1">
                      {completedOrders.length}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-forest-100 shadow-soft">
                    <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-2">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-agriText-muted font-semibold">Middleman Savings</p>
                    <p className="font-display font-black text-2xl text-forest-700 mt-1">
                      ₹{estimatedSavings}
                    </p>
                  </div>
                </div>

                {/* Monthly Activity Recharts Card */}
                <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display font-bold text-lg text-forest-950">
                        Monthly Procurement Trend
                      </h3>
                      <p className="text-xs text-agriText-muted">
                        Total spent directly with local growers (INR)
                      </p>
                    </div>
                    <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
                      Last 5 Months
                    </span>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="month" stroke="#647067" fontSize={11} />
                        <YAxis stroke="#647067" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                        <Tooltip
                          formatter={(value) => [`₹${value}`, 'Procurement Spend']}
                          contentStyle={{ backgroundColor: '#14532D', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="spend" stroke="#16A34A" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg text-forest-950">
                      Recent Field Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-forest-700 hover:text-forest-900"
                    >
                      View All Orders ({buyerOrders.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
                          <th className="pb-3 pl-2">Order ID</th>
                          <th className="pb-3">Harvest Items</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Total Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-forest-50 font-medium">
                        {buyerOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-agriText-muted">
                              <p className="font-bold text-forest-900 mb-1">No orders placed yet</p>
                              <p className="text-xs">Browse the marketplace to order direct farm-fresh harvests.</p>
                            </td>
                          </tr>
                        ) : (
                          buyerOrders.slice(0, 4).map((ord) => (
                            <tr key={ord.id} className="hover:bg-forest-50/50 transition-colors">
                              <td className="py-3.5 pl-2 font-bold text-forest-950">{ord.id}</td>
                              <td className="py-3.5 text-forest-900">
                                {ord.items.map((i) => `${i.name} (${i.quantity}${i.unit})`).join(', ')}
                              </td>
                              <td className="py-3.5 text-agriText-muted">{ord.date}</td>
                              <td className="py-3.5 font-bold text-forest-950">₹{ord.total}</td>
                              <td className="py-3.5">{getStatusBadge(ord.status)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recommended Direct Produce */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg text-forest-950">
                      Recommended Produce For You
                    </h3>
                    <Link to="/marketplace" className="text-xs font-bold text-forest-700">
                      More in marketplace →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {recommendedProduce.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft">
                <h3 className="font-display font-bold text-xl text-forest-950 mb-6">
                  All Purchase Orders
                </h3>

                <div className="space-y-4">
                  {buyerOrders.length === 0 ? (
                    <div className="text-center py-12 text-agriText-muted">
                      <ShoppingBag className="w-12 h-12 text-forest-300 mx-auto mb-3" />
                      <p className="font-bold text-forest-900 text-sm">No orders found</p>
                      <p className="text-xs text-agriText-muted mt-1">When you checkout produce from the marketplace, it will appear here.</p>
                      <Link
                        to="/marketplace"
                        className="inline-block mt-4 px-4 py-2 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800"
                      >
                        Explore Marketplace
                      </Link>
                    </div>
                  ) : (
                    buyerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-forest-100 bg-forest-50/40 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-forest-100">
                          <div>
                            <span className="font-display font-bold text-sm text-forest-950">
                              Order #{ord.id}
                            </span>
                            <span className="text-xs text-agriText-muted ml-2">Placed on {ord.date}</span>
                          </div>
                          {getStatusBadge(ord.status)}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-agriText-muted font-bold uppercase tracking-wider mb-1">
                              Harvest Items:
                            </p>
                            <ul className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <li key={idx} className="font-semibold text-forest-900">
                                  • {it.name} — {it.quantity} {it.unit} (₹{it.price * it.quantity})
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-agriText-muted font-bold uppercase tracking-wider mb-1">
                              Delivery Address:
                            </p>
                            <p className="text-forest-900">{ord.shippingAddress}</p>
                            <p className="text-forest-700 font-bold mt-1">Payment: {ord.paymentMethod}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between items-center text-xs border-t border-forest-100 font-bold">
                          <span>Total Paid to Farmer:</span>
                          <span className="font-display font-extrabold text-base text-forest-950">
                            ₹{ord.total}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-xl text-forest-950">
                    Saved Favorite Produce ({favoriteProducts.length})
                  </h3>
                </div>

                {favoriteProducts.length === 0 ? (
                  <p className="text-xs text-agriText-muted py-8 text-center">
                    You have no favorite produce saved yet. Click the heart icon on any product in the marketplace!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft max-w-xl">
                <h3 className="font-display font-bold text-xl text-forest-950 mb-6">
                  Buyer Profile Settings
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Name</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.name || 'Customer'}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Company / Store</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.company || user?.buyerType || 'Direct Customer'}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || ''}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Registered Location</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.location || 'India'}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <p className="text-[11px] text-agriText-muted pt-2">
                    Profile verified under AgriConnect Direct Fair Agricultural Sourcing program.
                  </p>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
