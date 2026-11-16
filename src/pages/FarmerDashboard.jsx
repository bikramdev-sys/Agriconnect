import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Upload, 
  Image as ImageIcon,
  DollarSign,
  User,
  LogOut,
  MapPin,
  Store
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getUserAvatar } from '../utils/avatar';

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    refreshData
  } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'profile'

  // Refresh backend data on mount
  React.useEffect(() => {
    if (typeof refreshData === 'function') {
      refreshData();
    }
  }, []);
  
  // Filter products belonging strictly to this farmer
  const farmerProducts = products.filter((p) => {
    if (!user) return false;
    if (p.farmerId && user.id && p.farmerId === user.id) return true;
    if (p.farmerName && user.name && p.farmerName.toLowerCase() === user.name.toLowerCase()) return true;
    return false;
  });

  // Filter orders strictly for this farmer
  const farmerOrders = orders.filter((o) => {
    if (!user) return false;
    if (o.farmerId && user.id && o.farmerId === user.id) return true;
    if (o.farmerName && user.name && o.farmerName.toLowerCase() === user.name.toLowerCase()) return true;
    if (Array.isArray(o.items) && o.items.some((it) => 
      (it.farmerId && user.id && it.farmerId === user.id) ||
      (it.farmerName && user.name && it.farmerName.toLowerCase() === user.name.toLowerCase())
    )) return true;
    return false;
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    availableQuantity: '',
    minOrderQty: '1',
    isOrganic: true,
    harvestDate: 'Harvested Today',
    shelfLife: '1-2 weeks',
    description: '',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  });

  // Calculate real metrics directly from database
  const activeListings = farmerProducts.filter((p) => p.availableQuantity > 0).length;
  const pendingOrders = farmerOrders.filter((o) => o.status === 'Pending');
  const completedOrders = farmerOrders.filter((o) => o.status === 'Delivered' || o.status === 'Accepted');
  const totalSalesRevenue = farmerOrders
    .filter((o) => o.status !== 'Rejected')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Dynamic Sales Analytics data by day aggregated from real orders
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayStats = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  farmerOrders.forEach((o) => {
    if (o.status !== 'Rejected') {
      const d = o.date ? new Date(o.date) : new Date(o.createdAt || Date.now());
      const dayName = isNaN(d.getTime()) ? 'Mon' : daysOfWeek[d.getDay()];
      if (dayStats[dayName] !== undefined) {
        dayStats[dayName] += Number(o.total) || 0;
      }
    }
  });
  const salesData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    revenue: dayStats[day]
  }));

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      availableQuantity: '',
      minOrderQty: '1',
      isOrganic: true,
      harvestDate: 'Harvested Today',
      shelfLife: '1-2 weeks',
      description: '',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.availableQuantity) {
      toast.error('Please enter produce name, price, and available harvest quantity.');
      return;
    }

    addProduct({
      ...formData,
      farmerId: user?.id || 'farmer-1',
      farmerName: user?.name || 'Ramesh Patel',
      location: user?.location || 'Nashik, Maharashtra'
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      availableQuantity: editingProduct.availableQuantity,
      category: editingProduct.category,
      unit: editingProduct.unit,
      isOrganic: editingProduct.isOrganic,
      description: editingProduct.description
    });

    setEditingProduct(null);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pending Verification Banner (if farmer not yet verified by Admin) */}
        {!user?.verified && (
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-50 to-orange-50 border border-amber-300 text-amber-950 flex items-start space-x-4 shadow-sm animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-300/50">
              <AlertCircle className="w-5 h-5 text-amber-700 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display font-black text-sm text-amber-950">
                  Account Verification Pending — Admin Review Required
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900 border border-amber-300">
                  ⏳ Review Queue Active
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1.5 leading-relaxed">
                Welcome to AgriConnect! Your agricultural profile and farm credentials have been submitted and are currently awaiting authorization from the Platform Administration. You may draft harvest listings in the meantime; your produce will be publicly published to verified buyers once approved.
              </p>
            </div>
          </div>
        )}

        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={getUserAvatar(user, 'farmer')}
              alt={user?.name || 'Farmer'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-forest-300 shadow-xs"
            />
            <div>
              {user?.verified ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified Grower Portal ✓</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>KYC Pending Approval ⏳</span>
                </span>
              )}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950 mt-1">
                {user?.farmName || 'Patel Organic Farms'}
              </h1>
              <p className="text-xs text-agriText-muted flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                <span>Managed by {user?.name || 'Ramesh Patel'} • {user?.location || 'Nashik, Maharashtra'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/marketplace"
              className="px-3.5 py-2.5 rounded-xl border border-forest-200 text-forest-800 font-bold text-xs hover:bg-forest-50 flex items-center space-x-1.5"
            >
              <Store className="w-3.5 h-3.5 text-forest-600" />
              <span>Marketplace</span>
            </Link>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md hover:bg-forest-800 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-fresh" />
              <span>Add New Harvest</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-2.5 sm:p-3 lg:p-4 border border-forest-100 shadow-soft flex flex-row lg:flex-col overflow-x-auto space-x-1 sm:space-x-2 lg:space-x-0 lg:space-y-1 shrink-0 scrollbar-none w-full">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs whitespace-nowrap shrink-0 transition-all ${
                activeTab === 'overview'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:bg-forest-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Farm Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 sm:space-x-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-bold text-xs whitespace-nowrap shrink-0 transition-all ${
                activeTab === 'products'
                  ? 'bg-forest-900 text-white shadow-xs'
                  : 'text-forest-900 hover:bg-forest-50'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Produce Listings</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-forest-100 text-forest-800">
                {farmerProducts.length}
              </span>
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
              <span>Incoming Orders</span>
              {pendingOrders.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 animate-pulse">
                  {pendingOrders.length} New
                </span>
              )}
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
              <span>Farm Profile</span>
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

          {/* Main Area */}
          <main className="lg:col-span-9 space-y-8">
            
            {activeTab === 'overview' && (
              <>
                {/* 5 Overview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="bg-white p-4 rounded-3xl border border-forest-100 shadow-soft">
                    <p className="text-[11px] text-agriText-muted font-bold uppercase">Total Listings</p>
                    <p className="font-display font-black text-2xl text-forest-950 mt-1">
                      {farmerProducts.length}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-forest-100 shadow-soft">
                    <p className="text-[11px] text-agriText-muted font-bold uppercase">Active Crops</p>
                    <p className="font-display font-black text-2xl text-fresh-dark mt-1">
                      {activeListings}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-forest-100 shadow-soft">
                    <p className="text-[11px] text-agriText-muted font-bold uppercase">Pending Orders</p>
                    <p className="font-display font-black text-2xl text-amber-600 mt-1">
                      {pendingOrders.length}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-forest-100 shadow-soft">
                    <p className="text-[11px] text-agriText-muted font-bold uppercase">Completed</p>
                    <p className="font-display font-black text-2xl text-forest-700 mt-1">
                      {completedOrders.length}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-forest-100 shadow-soft col-span-2 sm:col-span-1">
                    <p className="text-[11px] text-agriText-muted font-bold uppercase">Total Sales</p>
                    <p className="font-display font-black text-2xl text-forest-950 mt-1">
                      ₹{totalSalesRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Sales Analytics Chart (Recharts) */}
                <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display font-bold text-lg text-forest-950">
                        Weekly Direct Harvest Sales
                      </h3>
                      <p className="text-xs text-agriText-muted">
                        Revenue routed directly to farmer bank account (INR)
                      </p>
                    </div>
                    <span className="text-xs font-bold text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
                      Zero Commission Withheld
                    </span>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="day" stroke="#647067" fontSize={11} />
                        <YAxis stroke="#647067" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                        <Tooltip
                          formatter={(value) => [`₹${value}`, 'Daily Sales']}
                          contentStyle={{ backgroundColor: '#14532D', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                        />
                        <Bar dataKey="revenue" fill="#15803D" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Produce Table Preview */}
                <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg text-forest-950">
                      Produce Inventory
                    </h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-forest-700 hover:text-forest-900"
                    >
                      Manage All ({farmerProducts.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
                          <th className="pb-3 pl-2">Harvest</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">In Field Stock</th>
                          <th className="pb-3">Organic</th>
                          <th className="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-forest-50 font-medium">
                        {farmerProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-agriText-muted">
                              <p className="font-bold text-forest-900 mb-1">No produce inventory yet</p>
                              <p className="text-xs">Add your first harvest listing above to get started.</p>
                            </td>
                          </tr>
                        ) : (
                          farmerProducts.slice(0, 5).map((prod) => (
                            <tr key={prod.id} className="hover:bg-forest-50/50">
                              <td className="py-3 pl-2 flex items-center space-x-2">
                                <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                                <span className="font-bold text-forest-950">{prod.name}</span>
                              </td>
                              <td className="py-3 text-agriText-muted">{prod.category}</td>
                              <td className="py-3 font-bold text-forest-900">₹{prod.price} / {prod.unit}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  prod.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {prod.availableQuantity} {prod.unit}
                                </span>
                              </td>
                              <td className="py-3">
                                {prod.isOrganic ? <span className="text-fresh font-bold">✓ Yes</span> : <span className="text-gray-400">No</span>}
                              </td>
                              <td className="py-3 pr-2 text-right">
                                <button
                                  onClick={() => handleOpenEdit(prod)}
                                  className="p-1.5 text-forest-700 hover:bg-forest-100 rounded-lg mr-1"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingProductId(prod.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-forest-950">
                      Produce Management
                    </h3>
                    <p className="text-xs text-agriText-muted">
                      Add, update harvest quantities, adjust pricing, or edit crop listings.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-fresh" />
                    <span>Add New Produce Listing</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
                        <th className="pb-3 pl-2">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Available Quantity</th>
                        <th className="pb-3">Organic</th>
                        <th className="pb-3 pr-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest-50 font-medium">
                      {farmerProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-agriText-muted">
                            <p className="font-bold text-forest-900 mb-1">No produce listings yet</p>
                            <p className="text-xs">Click 'Add New Produce Listing' above to publish your harvests to buyers.</p>
                          </td>
                        </tr>
                      ) : (
                        farmerProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-forest-50/50">
                            <td className="py-3 pl-2 flex items-center space-x-3">
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-forest-100" />
                              <div>
                                <p className="font-bold text-forest-950 text-sm">{prod.name}</p>
                                <p className="text-[10px] text-agriText-muted">{prod.harvestDate}</p>
                              </div>
                            </td>
                            <td className="py-3 text-agriText-muted">{prod.category}</td>
                            <td className="py-3 font-bold text-forest-950">₹{prod.price} / {prod.unit}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                prod.availableQuantity > 0 ? 'bg-forest-100 text-forest-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {prod.availableQuantity} {prod.unit}
                              </span>
                            </td>
                            <td className="py-3">
                              {prod.isOrganic ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-fresh/15 text-forest-800">Organic</span>
                              ) : (
                                <span className="text-gray-400">Standard</span>
                              )}
                            </td>
                            <td className="py-3 pr-2 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                className="p-2 text-forest-800 hover:bg-forest-100 rounded-xl"
                                title="Edit produce"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingProductId(prod.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: INCOMING ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft">
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-forest-950">
                    Incoming Purchase Orders
                  </h3>
                  <p className="text-xs text-agriText-muted">
                    Accept or reject purchase requests based on harvest readiness.
                  </p>
                </div>

                <div className="space-y-4">
                  {farmerOrders.length === 0 ? (
                    <div className="text-center py-12 text-agriText-muted">
                      <ShoppingBag className="w-12 h-12 text-forest-300 mx-auto mb-3" />
                      <p className="font-bold text-forest-900 text-sm">No incoming orders yet</p>
                      <p className="text-xs text-agriText-muted mt-1">When buyers order your harvest from the marketplace, they will appear here.</p>
                    </div>
                  ) : (
                    farmerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-forest-100 bg-forest-50/30 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-forest-100">
                          <div>
                            <span className="font-display font-bold text-sm text-forest-950">
                              Order #{ord.id}
                            </span>
                            <span className="text-xs text-agriText-muted ml-2">Date: {ord.date}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ord.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                            ord.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            ord.status === 'Delivered' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-agriText-muted font-bold uppercase mb-1">Buyer Details:</p>
                            <p className="font-bold text-forest-950">{ord.customerName}</p>
                            <p className="text-agriText-muted">{ord.customerPhone}</p>
                            <p className="text-agriText-muted">{ord.shippingAddress}</p>
                          </div>

                          <div>
                            <p className="text-agriText-muted font-bold uppercase mb-1">Ordered Harvest:</p>
                            <ul className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <li key={idx} className="font-semibold text-forest-900">
                                  • {it.name} — {it.quantity} {it.unit} (₹{it.price * it.quantity})
                                </li>
                              ))}
                            </ul>
                            <p className="font-extrabold text-sm text-forest-950 mt-2">
                              Order Value: ₹{ord.total}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons to Accept or Reject pending orders */}
                        {ord.status === 'Pending' && (
                          <div className="pt-3 border-t border-forest-100 flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Rejected')}
                              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50"
                            >
                              Decline Request
                            </button>
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                              className="px-4 py-2 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5 text-fresh" />
                              <span>Accept & Prepare Dispatch</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-soft max-w-xl">
                <h3 className="font-display font-bold text-xl text-forest-950 mb-6">
                  Farmer Profile
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Farmer Name</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.name || 'Ramesh Patel'}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Farm Name</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.farmName || 'Patel Organic Farms'}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Location</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.location || 'Nashik, Maharashtra'}
                      className="w-full p-2.5 rounded-xl bg-forest-50 border border-forest-200 font-semibold text-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-950 uppercase mb-1">Verification Status</label>
                    <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 flex items-center space-x-2 text-forest-900 font-bold">
                      <Sparkles className="w-4 h-4 text-fresh" />
                      <span>Certified Direct Agricultural Producer (Zero Middlemen)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* MODAL: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-forest-900 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-xl">List New Produce</h3>
                <p className="text-xs text-gray-300 mt-0.5">Post fresh harvests directly to buyers</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-950 uppercase mb-1">Produce Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crisp Seedless Grapes or Fresh Tomatoes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-950 uppercase mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="bunch">bunch</option>
                    <option value="piece">piece</option>
                    <option value="liter">liter</option>
                    <option value="crate">crate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 uppercase mb-1">Direct Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-950 uppercase mb-1">Harvest Quantity *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Preview & URL */}
              <div>
                <label className="block font-bold text-forest-950 uppercase mb-1">Product Photo URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none mb-2"
                />
                {formData.image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-forest-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-forest-950 uppercase mb-1">Short Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Field notes, ripeness, seed variety..."
                  className="w-full p-2.5 rounded-xl border border-forest-200 focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-forest-950">
                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="rounded accent-forest-700"
                  />
                  <span>Zero-Chemical Certified Organic Produce</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-forest-200 font-bold text-agriText-muted hover:bg-forest-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold shadow-md active:scale-95 transition-all"
                >
                  Publish Harvest Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-forest-900 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-xl">Edit Produce Listing</h3>
                <p className="text-xs text-gray-300 mt-0.5">{editingProduct.name}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-950 uppercase mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 uppercase mb-1">Price (₹ per {editingProduct.unit})</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-950 uppercase mb-1">Remaining Stock</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.availableQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, availableQuantity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-forest-950">
                  <input
                    type="checkbox"
                    checked={editingProduct.isOrganic}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isOrganic: e.target.checked })}
                    className="rounded accent-forest-700"
                  />
                  <span>Organic Certified</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-forest-200 font-bold text-agriText-muted hover:bg-forest-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold shadow-md active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-forest-100 p-6 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-forest-950 mb-1">
              Delete Crop Listing?
            </h3>
            <p className="text-xs text-agriText-muted mb-6">
              This will remove the produce from the public marketplace. You can re-add it anytime.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-forest-200 text-xs font-bold text-forest-900 hover:bg-forest-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
