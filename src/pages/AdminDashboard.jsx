import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
 ShieldCheck, 
 ShieldAlert, 
 Users, 
 Package, 
 ShoppingBag, 
 ShoppingCart, 
 TrendingUp, 
 CheckCircle2, 
 AlertCircle, 
 Star, 
 Sparkles, 
 Edit3, 
 Trash2, 
 Search, 
 Plus, 
 X, 
 MapPin, 
 Check, 
 ArrowUpRight,
 Store,
 DollarSign,
 CircleDollarSign,
 Layers,
 Settings,
 Bell,
 RefreshCw,
 Clock,
 UserCheck,
 ExternalLink,
 ChevronRight,
 Menu,
 Activity,
 LogOut,
 Mail,
 Phone
} from 'lucide-react';
import { 
 ResponsiveContainer, 
 AreaChart, 
 Area, 
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
import { api } from '../services/api';
import Logo from '../components/Logo';
import { getUserAvatar, getCartoonAvatar } from '../utils/avatar';

export default function AdminDashboard() {
 const { user, logout } = useAuth();
 const { 
 products, 
 farmersList, 
 orders, 
 platformSettings,
 updateProduct, 
 deleteProduct, 
 addProduct,
 toggleProductFeatured, 
 toggleProductTodaysPick, 
 toggleFarmerVerification, 
 deleteFarmer,
 updateOrderStatus,
 updatePlatformSettings,
 refreshData
 } = useCart();

 const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'produce' | 'farmers' | 'buyers' | 'orders' | 'settings'
 const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

 // Search & Filter state for Produce Tab
 const [produceSearch, setProduceSearch] = useState('');
 const [produceCategory, setProduceCategory] = useState('all');

 // Search & Filter for Farmers Tab
 const [farmerSearch, setFarmerSearch] = useState('');
 const [farmerFilterStatus, setFarmerFilterStatus] = useState('all'); // 'all' | 'pending' | 'verified'

 // Search & Filter for Buyers Tab (Separate Buyers Section)
 const [buyerSearch, setBuyerSearch] = useState('');
 const [buyerTypeFilter, setBuyerTypeFilter] = useState('all');

 // Orders Tab Filter & Search
 const [orderStatusFilter, setOrderStatusFilter] = useState('all');
 const [orderSearch, setOrderSearch] = useState('');

 // Platform Users State from MongoDB
 const [usersList, setUsersList] = useState([]);

 // Contact Inquiries & Form Messages State
 const [inquiriesList, setInquiriesList] = useState([]);
 const [inquirySearch, setInquirySearch] = useState('');
 const [inquiryFilterStatus, setInquiryFilterStatus] = useState('all'); // 'all' | 'unread' | 'resolved'
 const [selectedInquiry, setSelectedInquiry] = useState(null);

 // Modals state
 const [editingProduct, setEditingProduct] = useState(null);
 const [isAddProductOpen, setIsAddProductOpen] = useState(false);
 const [newProductData, setNewProductData] = useState({
 name: '',
 category: 'Vegetables',
 price: '',
 unit: 'kg',
 availableQuantity: '',
 farmerName: 'Ramesh Patel',
 location: 'Nashik, Maharashtra',
 isOrganic: true,
 image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
 });

 // Settings form state
 const [tempSettings, setTempSettings] = useState(platformSettings);

 // Live Clock updater
 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
 }, 1000);
 return () => clearInterval(timer);
 }, []);

 // Fetch Users from Database
 const fetchAllUsers = async () => {
 try {
 const res = await api.admin.getUsers();
 if (Array.isArray(res?.users)) {
 setUsersList(res.users);
 }
 } catch {
 // ignore
 }
 };

 // Fetch Contact Inquiries from Database
 const fetchInquiries = async () => {
 try {
 const res = await api.contact.getAll();
 if (Array.isArray(res?.contacts)) {
 setInquiriesList(res.contacts);
 }
 } catch {
 // ignore
 }
 };

 useEffect(() => {
 if (typeof refreshData === 'function') {
 refreshData();
 }
 fetchAllUsers();
 fetchInquiries();
 }, []);

 const handleManualRefresh = async () => {
 setIsRefreshing(true);
 try {
 if (typeof refreshData === 'function') {
 await refreshData();
 }
 await fetchAllUsers();
 await fetchInquiries();
 toast.success('Database synchronized with MongoDB Atlas.', { icon: '🔄' });
 } catch {
 toast.error('Sync failed.');
 } finally {
 setIsRefreshing(false);
 }
 };

 const handleToggleInquiryStatus = async (inquiryId, currentStatus) => {
 const nextStatus = currentStatus === 'unread' ? 'resolved' : 'unread';
 try {
 await api.contact.updateStatus(inquiryId, nextStatus);
 setInquiriesList((prev) =>
 prev.map((inq) =>
 (inq._id === inquiryId || inq.id === inquiryId) ? { ...inq, status: nextStatus } : inq
 )
 );
 toast.success(`Message marked as: ${nextStatus === 'resolved' ? 'Resolved ✓' : 'Unread ⚠️'}`);
 } catch {
 toast.error('Failed to update message status.');
 }
 };

 const handleDeleteInquiry = async (inquiryId) => {
 try {
 await api.contact.delete(inquiryId);
 setInquiriesList((prev) => prev.filter((inq) => inq._id !== inquiryId && inq.id !== inquiryId));
 if (selectedInquiry && (selectedInquiry._id === inquiryId || selectedInquiry.id === inquiryId)) {
 setSelectedInquiry(null);
 }
 toast.success('Message removed from database.');
 } catch {
 toast.error('Failed to delete message.');
 }
 };

 // Combined Farmers (Guarantees any newly registered farmer in MongoDB is immediately listed)
 const combinedFarmers = (() => {
 const map = new Map();
 farmersList.forEach((f) => {
 const key = f.id || f._id || f.email;
 map.set(key, { ...f });
 });
 usersList
 .filter((u) => u.role === 'farmer')
 .forEach((u) => {
 const key = u.id || u._id || u.email;
 if (!map.has(key) && !map.has(u.email)) {
 map.set(key, {
 id: u.id || u._id,
 name: u.name,
 email: u.email,
 farmName: u.farmName || `${u.name}'s Organic Farm`,
 location: u.location || 'India',
 phone: u.phone || '',
 avatar: getUserAvatar(u, 'farmer'),
 verified: Boolean(u.verified),
 rating: 5.0,
 totalProduce: 0,
 experienceYears: 1,
 specialties: u.specialties || ['Vegetables'],
 createdAt: u.createdAt,
 });
 }
 });
 return Array.from(map.values());
 })();

 const pendingFarmersCount = combinedFarmers.filter((f) => !f.verified).length;
 const verifiedFarmersCount = combinedFarmers.filter((f) => f.verified).length;

 // Compute Platform Metrics (100% Real Database Data)
 const totalVolume = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
 const totalInStockItems = products.filter((p) => p.availableQuantity > 0).length;
 const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

 // Dynamic Monthly Platform GMV aggregated from Real Orders
 const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 const monthlyStats = {};
 orders.forEach((o) => {
 const d = o.date ? new Date(o.date) : new Date(o.createdAt || Date.now());
 const m = isNaN(d.getTime()) ? 'Recent' : monthNames[d.getMonth()];
 if (!monthlyStats[m]) monthlyStats[m] = { month: m, volume: 0, orders: 0 };
 monthlyStats[m].volume += Number(o.total) || 0;
 monthlyStats[m].orders += 1;
 });
 const rawGmvData = Object.values(monthlyStats);
 const platformGmvData = rawGmvData.length > 0 
 ? rawGmvData 
 : [{ month: monthNames[new Date().getMonth()], volume: totalVolume, orders: orders.length }];

 // Category Distribution
 const categoryData = [
 { category: 'Vegetables', count: products.filter((p) => p.category === 'Vegetables').length },
 { category: 'Fruits', count: products.filter((p) => p.category === 'Fruits').length },
 { category: 'Grains', count: products.filter((p) => p.category === 'Grains').length },
 { category: 'Pulses', count: products.filter((p) => p.category === 'Pulses').length },
 { category: 'Dairy', count: products.filter((p) => p.category === 'Dairy').length }
 ];

 // Filtered Produce
 const filteredProducts = products.filter((p) => {
 const matchSearch = (p.name || '').toLowerCase().includes(produceSearch.toLowerCase()) ||
 (p.farmerName || '').toLowerCase().includes(produceSearch.toLowerCase()) ||
 (p.location || '').toLowerCase().includes(produceSearch.toLowerCase());
 const matchCat = produceCategory === 'all' || p.category === produceCategory;
 return matchSearch && matchCat;
 });

 // Filtered Farmers (With status tabs support)
 const filteredFarmers = combinedFarmers.filter((f) => {
 const matchesSearch = 
 (f.name || '').toLowerCase().includes(farmerSearch.toLowerCase()) ||
 (f.farmName || '').toLowerCase().includes(farmerSearch.toLowerCase()) ||
 (f.email || '').toLowerCase().includes(farmerSearch.toLowerCase()) ||
 (f.location || '').toLowerCase().includes(farmerSearch.toLowerCase());

 const matchesStatus = 
 farmerFilterStatus === 'all'
 ? true
 : farmerFilterStatus === 'pending'
 ? !f.verified
 : f.verified;

 return matchesSearch && matchesStatus;
 });

 // Filtered Orders
 const filteredOrders = orders.filter((o) => {
 const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
 const matchSearch = (o.id || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
 (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
 (o.farmerName || '').toLowerCase().includes(orderSearch.toLowerCase());
 return matchStatus && matchSearch;
 });

 // Dedicated Buyers Directory Data
 const buyersList = usersList.filter((u) => u.role === 'buyer');

 const filteredBuyers = buyersList.filter((b) => {
 const matchesSearch =
 (b.name || '').toLowerCase().includes(buyerSearch.toLowerCase()) ||
 (b.email || '').toLowerCase().includes(buyerSearch.toLowerCase()) ||
 (b.phone || '').toLowerCase().includes(buyerSearch.toLowerCase()) ||
 (b.company || '').toLowerCase().includes(buyerSearch.toLowerCase()) ||
 (b.buyerType || '').toLowerCase().includes(buyerSearch.toLowerCase()) ||
 (b.location || '').toLowerCase().includes(buyerSearch.toLowerCase());

 const typeStr = (b.buyerType || '').toLowerCase();
 const matchesType =
 buyerTypeFilter === 'all'
 ? true
 : buyerTypeFilter === 'retail'
 ? typeStr.includes('retail') || typeStr.includes('grocery') || typeStr.includes('store')
 : buyerTypeFilter === 'wholesale'
 ? typeStr.includes('wholesale') || typeStr.includes('bulk') || typeStr.includes('distributor')
 : buyerTypeFilter === 'restaurant'
 ? typeStr.includes('restaurant') || typeStr.includes('cafe') || typeStr.includes('hotel')
 : typeStr.includes('individual') || typeStr.includes('customer');

 return matchesSearch && matchesType;
 });

 // Contact Inquiries Filtering & Unread Calculation
 const unreadInquiriesCount = inquiriesList.filter((i) => i.status === 'unread').length;
 const resolvedInquiriesCount = inquiriesList.filter((i) => i.status !== 'unread').length;

 const filteredInquiries = inquiriesList.filter((i) => {
 const matchesSearch =
 (i.name || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
 (i.email || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
 (i.phone || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
 (i.subject || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
 (i.message || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
 (i.farmerName || '').toLowerCase().includes(inquirySearch.toLowerCase());

 const matchesStatus =
 inquiryFilterStatus === 'all'
 ? true
 : inquiryFilterStatus === 'unread'
 ? i.status === 'unread'
 : i.status !== 'unread';

 return matchesSearch && matchesStatus;
 });

 const handleSaveProductEdit = (e) => {
 e.preventDefault();
 if (!editingProduct) return;
 updateProduct(editingProduct.id, {
 name: editingProduct.name,
 price: editingProduct.price,
 availableQuantity: editingProduct.availableQuantity,
 category: editingProduct.category,
 unit: editingProduct.unit,
 isOrganic: editingProduct.isOrganic
 });
 setEditingProduct(null);
 };

 const handleCreateNewProduct = (e) => {
 e.preventDefault();
 if (!newProductData.name || !newProductData.price) {
 toast.error('Please enter name and price.');
 return;
 }
 addProduct(newProductData);
 setIsAddProductOpen(false);
 };

 const handleSaveSettings = (e) => {
 e.preventDefault();
 updatePlatformSettings(tempSettings);
 };

 const navMenuItems = [
 { id: 'overview', label: 'Platform Overview', icon: TrendingUp, badge: null },
 { id: 'produce', label: 'Produce Catalog', icon: Package, badge: products.length },
 { 
 id: 'farmers', 
 label: 'Farmers Directory', 
 icon: Users, 
 badge: combinedFarmers.length, 
 urgent: pendingFarmersCount > 0,
 urgentText: pendingFarmersCount > 0 ? `${pendingFarmersCount} Pending` : null 
 },
 { 
 id: 'buyers', 
 label: 'Buyers Directory', 
 icon: ShoppingCart, 
 badge: buyersList.length 
 },
 { id: 'orders', label: 'Purchase Orders', icon: ShoppingBag, badge: orders.length, urgent: pendingOrdersCount > 0 },
 { 
 id: 'inquiries', 
 label: 'Contact Messages', 
 icon: Mail, 
 badge: inquiriesList.length, 
 urgent: unreadInquiriesCount > 0,
 urgentText: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} New` : null
 },
 { id: 'settings', label: 'Platform Policies', icon: Settings, badge: null },
 ];

 return (
 <div className="h-screen w-screen flex overflow-hidden bg-[#0B1120] text-slate-100 font-sans">
 
  {/* ===================== SIDEBAR (DESKTOP & MOBILE DRAWER) ===================== */}
  <aside 
    className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0B1120] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
      mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
    }`}
  >
    {/* Top Header & Navigation Section */}
    <div className="flex flex-col">
      {/* Top Brand Header */}
      <div className="p-5 border-b border-slate-800/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-slate-950/80 ring-1 ring-emerald-400/40">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-extrabold text-sm text-white tracking-tight">
                AgriConnect
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 tracking-wide">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-emerald-300 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MongoDB Atlas Live</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Identity Card */}
      <div className="p-3.5 mx-3.5 my-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 flex items-center space-x-3 transition-colors shadow-2xs">
        <div className="relative shrink-0">
          <img
            src={getUserAvatar(user, 'admin')}
            alt={user?.name || 'Administrator'}
            className="w-10 h-10 rounded-lg object-cover ring-1 ring-emerald-400/40"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B1120]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Bikram Dev'}</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              ROOT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">{user?.email || 'admin@agriconnect.org'}</p>
          <p className="text-[10px] text-emerald-400 font-medium mt-0.5">National Directorate</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="px-3 space-y-1">
        {navMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all text-left group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-950/50 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : item.urgent 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse'
                    : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                }`}>
                  {item.urgent && item.urgentText ? item.urgentText : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>

    {/* Sidebar Footer Controls */}
    <div className="p-3.5 border-t border-slate-800/70 space-y-2">
      <Link
        to="/marketplace"
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all group shadow-2xs"
      >
        <div className="flex items-center space-x-2.5">
          <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>View Public Marketplace</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300 transition-colors" />
      </Link>

      <button
        onClick={logout}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-500/[0.08] hover:bg-rose-500/[0.18] border border-rose-500/20 hover:border-rose-500/40 transition-all group shadow-2xs"
      >
        <div className="flex items-center space-x-2.5">
          <LogOut className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Terminate Admin Session</span>
        </div>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 group-hover:bg-rose-500/30 transition-colors">
          Exit
        </span>
      </button>
    </div>
  </aside>

 {/* Mobile Backdrop */}
 {mobileSidebarOpen && (
 <div 
 onClick={() => setMobileSidebarOpen(false)}
 className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
 />
 )}

 {/* ===================== WORKSPACE CANVAS (RIGHT) ===================== */}
 <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F6F8F6] text-slate-900">
 
 {/* Top Header Bar */}
 <header className="h-16 bg-white border-b border-forest-100/90 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-2xs z-20">
 
 {/* Breadcrumb & Mobile Toggle */}
 <div className="flex items-center space-x-3">
 <button
 onClick={() => setMobileSidebarOpen(true)}
 className="lg:hidden p-2 rounded-xl text-forest-900 hover:bg-forest-50"
 >
 <Menu className="w-5 h-5" />
 </button>
 <div className="flex items-center space-x-2 text-xs">
 <span className="font-bold text-agriText-muted">Console</span>
 <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
 <span className="font-extrabold text-forest-950 capitalize">{activeTab}</span>
 </div>
 </div>

 {/* Right Header Status Controls */}
 <div className="flex items-center space-x-3 sm:space-x-4">
 
 {/* Live Clock */}
 <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-100 text-xs font-mono text-forest-800">
 <Clock className="w-3.5 h-3.5 text-forest-600" />
 <span>{currentTime}</span>
 </div>

 {/* Atlas DB Live Status */}
 <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
 <span>MongoDB Atlas Live</span>
 </div>

 {/* Refresh DB Action Button */}
 <button
 onClick={handleManualRefresh}
 disabled={isRefreshing}
 className="p-2 rounded-xl border border-forest-200 text-forest-800 hover:bg-forest-50 hover:text-forest-950 transition-all flex items-center space-x-1.5 text-xs font-bold active:scale-95 disabled:opacity-50"
 title="Synchronize database with remote MongoDB Atlas"
 >
 <RefreshCw className={`w-3.5 h-3.5 text-forest-700 ${isRefreshing ? 'animate-spin' : ''}`} />
 <span className="hidden sm:inline">Sync DB</span>
 </button>

 {/* Add Produce Quick Action */}
 <button
 onClick={() => setIsAddProductOpen(true)}
 className="px-3.5 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
 >
 <Plus className="w-3.5 h-3.5 text-fresh" />
 <span>Add Produce</span>
 </button>
 </div>
 </header>

 {/* Global Announcement Banner from Settings (if configured) */}
 {platformSettings.bannerAnnouncement && (
 <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 text-amber-950 flex items-center justify-between text-xs font-semibold shrink-0">
 <div className="flex items-center space-x-2">
 <Bell className="w-3.5 h-3.5 text-amber-700 shrink-0" />
 <span className="truncate">{platformSettings.bannerAnnouncement}</span>
 </div>
 <button
 onClick={() => setActiveTab('settings')}
 className="text-[11px] underline font-bold hover:text-amber-800 shrink-0 ml-4"
 >
 Modify Policy
 </button>
 </div>
 )}

 {/* Main Content Body */}
 <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">

 {/* ======================= TAB: OVERVIEW ======================= */}
 {activeTab === 'overview' && (
 <div className="space-y-8 max-w-7xl mx-auto">
 
 {/* 5 Executive KPI Metric Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
 
 {/* 1. Gross Trade Volume */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 {/* Glowing Ambient Top Accent */}
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block truncate">
 Trade Volume
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-emerald-950 mt-1 transition-colors truncate">
 ₹{totalVolume.toLocaleString()}
 </p>
 </div>

 {/* Logo Badge Container with Color Fill on Hover */}
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-100/80 text-emerald-700 border border-emerald-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-500/20 shrink-0">
 <DollarSign className="w-5 h-5 transition-all duration-300 text-emerald-700 group-hover:text-white stroke-[2.8]" />
 </div>
 </div>

 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-emerald-700">
 <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:animate-ping" />
 <span className="truncate">Direct Payouts</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
 </div>
 </div>

 {/* 2. Total Orders */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-700 transition-colors block truncate">
 Total Orders
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-blue-950 mt-1 transition-colors truncate">
 {orders.length}
 </p>
 </div>

 {/* Logo Badge Container with Color Fill on Hover */}
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-blue-100/80 text-blue-700 border border-blue-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-500/20 shrink-0">
 <ShoppingCart className="w-5 h-5 transition-all duration-300 text-blue-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>

 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-blue-700">
 <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
 <span className="truncate">{pendingOrdersCount} Awaiting Dispatch</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
 </div>
 </div>

 {/* 3. Verified Growers */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-700 transition-colors block truncate">
 Verified Growers
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-amber-950 mt-1 transition-colors truncate">
 {verifiedFarmersCount} <span className="text-xs sm:text-sm font-semibold text-slate-400">/ {farmersList.length}</span>
 </p>
 </div>

 {/* Logo Badge Container with Color Fill on Hover */}
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-amber-100/80 text-amber-700 border border-amber-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-500/20 shrink-0">
 <Users className="w-5 h-5 transition-all duration-300 text-amber-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>

 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-amber-700">
 <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span className="truncate">100% Soil Checked</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
 </div>
 </div>

 {/* 4. Live Catalog Crops */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-teal-700 transition-colors block truncate">
 Catalog Crops
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-teal-950 mt-1 transition-colors truncate">
 {totalInStockItems}
 </p>
 </div>

 {/* Logo Badge Container with Color Fill on Hover */}
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-teal-100/80 text-teal-700 border border-teal-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-emerald-700 group-hover:text-white group-hover:border-teal-500 group-hover:shadow-lg group-hover:shadow-teal-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-teal-500/20 shrink-0">
 <Package className="w-5 h-5 transition-all duration-300 text-teal-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>

 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-teal-700">
 <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
 <span className="truncate">Across 5 Categories</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
 </div>
 </div>

 {/* 5. Platform Take Fee */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer col-span-1 sm:col-span-2 md:col-span-1 xl:col-span-1">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-purple-700 transition-colors block truncate">
 Platform Fee
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-purple-700 group-hover:text-purple-900 mt-1 transition-colors truncate">
 {platformSettings.commissionRate}%
 </p>
 </div>

 {/* Logo Badge Container with Color Fill on Hover */}
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-purple-100/80 text-purple-700 border border-purple-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-indigo-600 group-hover:text-white group-hover:border-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-purple-500/20 shrink-0">
 <ShieldCheck className="w-5 h-5 transition-all duration-300 text-purple-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>

 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-purple-700">
 <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
 <span className="truncate">Zero Middleman Rule</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
 </div>
 </div>

 </div>

 {/* Analytics Graphs */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 
 {/* GMV Volume Area Chart */}
 <div className="lg:col-span-7 group relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100/90 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-emerald-500/20 shrink-0">
 <TrendingUp className="w-4 h-4 transition-all duration-300 stroke-[2.2]" />
 </div>
 <div>
 <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-emerald-950 transition-colors">
 Monthly Agricultural Trade GMV
 </h3>
 <p className="text-xs text-slate-500 font-medium">Gross Transaction Value from Real Orders (INR)</p>
 </div>
 </div>

 <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 Real Database
 </span>
 </div>

 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={platformGmvData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
 <defs>
 <linearGradient id="adminGmvGrad" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
 <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
 <XAxis dataKey="month" stroke="#647067" fontSize={11} />
 <YAxis stroke="#647067" fontSize={11} tickFormatter={(v) => `₹${v}`} />
 <Tooltip
 formatter={(v) => [`₹${v.toLocaleString()}`, 'Volume']}
 contentStyle={{ backgroundColor: '#0B1E13', color: '#fff', borderRadius: '14px', border: 'none', fontSize: '12px' }}
 />
 <Area type="monotone" dataKey="volume" stroke="#059669" strokeWidth={3} fill="url(#adminGmvGrad)" />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Category Diversity Bar Chart */}
 <div className="lg:col-span-5 group relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-300 hover:-translate-y-1 transition-all duration-300">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-teal-50 text-teal-600 border border-teal-100/90 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-emerald-700 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-teal-500/20 shrink-0">
 <Layers className="w-4 h-4 transition-all duration-300 stroke-[2.2]" />
 </div>
 <div>
 <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-teal-950 transition-colors">
 Crop Diversity Breakdown
 </h3>
 <p className="text-xs text-slate-500 font-medium">Active marketplace crops by category</p>
 </div>
 </div>

 <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shadow-2xs">
 Catalog
 </span>
 </div>

 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
 <XAxis dataKey="category" stroke="#647067" fontSize={10} />
 <YAxis stroke="#647067" fontSize={11} />
 <Tooltip
 formatter={(v) => [`${v} crops`, 'Listings']}
 contentStyle={{ backgroundColor: '#0B1E13', color: '#fff', borderRadius: '14px', border: 'none', fontSize: '12px' }}
 />
 <Bar dataKey="count" fill="#16A34A" radius={[8, 8, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* Side-by-side management previews */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
 {/* Recent Orders Overview */}
 <div className="group relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100/90 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-500/20 shrink-0">
 <ShoppingBag className="w-4 h-4 transition-all duration-300 stroke-[2.2]" />
 </div>
 <div>
 <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-blue-950 transition-colors">
 Recent Purchase Orders
 </h3>
 <p className="text-xs text-slate-500 font-medium">Latest incoming orders across network</p>
 </div>
 </div>

 <button
 onClick={() => setActiveTab('orders')}
 className="text-xs font-extrabold text-blue-700 hover:text-blue-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
 >
 <span>View All ({orders.length})</span>
 <ArrowUpRight className="w-3.5 h-3.5" />
 </button>
 </div>

 {orders.length === 0 ? (
 <p className="text-xs text-slate-400 py-8 text-center font-medium">No orders recorded yet.</p>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold">
 <th className="pb-2.5">ID</th>
 <th className="pb-2.5">Buyer</th>
 <th className="pb-2.5">Farmer</th>
 <th className="pb-2.5">Amount</th>
 <th className="pb-2.5">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 font-medium">
 {orders.slice(0, 5).map((ord) => (
 <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
 <td className="py-2.5 font-bold text-slate-950">{ord.id}</td>
 <td className="py-2.5 text-slate-700">{ord.customerName}</td>
 <td className="py-2.5 text-slate-600">{ord.farmerName || 'Patel Farms'}</td>
 <td className="py-2.5 font-extrabold text-slate-950">₹{ord.total}</td>
 <td className="py-2.5">
 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
 ord.status === 'Accepted' ? 'bg-green-100 text-green-800' :
 ord.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
 ord.status === 'Delivered' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
 }`}>
 {ord.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Farmer Verification Approval Queue */}
 <div className="group relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/90 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-md group-hover:shadow-amber-500/20 shrink-0">
 <UserCheck className="w-4 h-4 transition-all duration-300 stroke-[2.2]" />
 </div>
 <div>
 <h3 className="font-display font-extrabold text-base text-slate-900 group-hover:text-amber-950 transition-colors">
 Grower Verification Queue
 </h3>
 <p className="text-xs text-slate-500 font-medium">KYC authorization checklist</p>
 </div>
 </div>

 <button
 onClick={() => setActiveTab('farmers')}
 className="text-xs font-extrabold text-amber-700 hover:text-amber-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
 >
 <span>Directory ({combinedFarmers.length})</span>
 <ArrowUpRight className="w-3.5 h-3.5" />
 </button>
 </div>

 <div className="space-y-3">
 {[...combinedFarmers].sort((a, b) => (a.verified === b.verified ? 0 : a.verified ? 1 : -1)).slice(0, 4).map((f) => (
 <div key={f.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all duration-200 flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs" />
 <div>
 <p className="font-extrabold text-xs text-slate-900">{f.name}</p>
 <p className="text-[11px] text-slate-500">{f.farmName} • {f.location}</p>
 </div>
 </div>

 <button
 onClick={async () => {
 await toggleFarmerVerification(f.id);
 await fetchAllUsers();
 }}
 className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center space-x-1 shadow-2xs ${
 f.verified
 ? 'bg-green-100 text-green-800 hover:bg-green-200'
 : 'bg-amber-500 hover:bg-amber-600 text-white font-extrabold animate-pulse'
 }`}
 >
 <ShieldCheck className="w-3.5 h-3.5" />
 <span>{f.verified ? 'Verified ✓' : 'Verify & Approve ⏳'}</span>
 </button>
 </div>
 ))}
 </div>
 </div>

 </div>
 </div>
 )}

 {/* ======================= TAB: PRODUCE MANAGEMENT ======================= */}
 {activeTab === 'produce' && (
 <div className="space-y-6 max-w-7xl mx-auto">
 
 {/* 4 Metric Cards for Produce */}
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
 {/* 1. Total Produce */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block truncate">
 Total Produce
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-emerald-950 mt-1 transition-colors truncate">
 {products.length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-500/20 shrink-0">
 <Package className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-emerald-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
 <span className="truncate">Live in Marketplace</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 2. Featured Crops */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-700 transition-colors block truncate">
 Homepage Featured
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-amber-950 mt-1 transition-colors truncate">
 {products.filter(p => p.featured).length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-500/20 shrink-0">
 <Star className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-amber-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span className="truncate">Priority Placement</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 3. Today's Pick */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-rose-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-rose-700 transition-colors block truncate">
 Today's Daily Pick
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-rose-950 mt-1 transition-colors truncate">
 {products.filter(p => p.todaysPick).length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-pink-600 group-hover:text-white group-hover:border-rose-500 group-hover:shadow-lg group-hover:shadow-rose-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-rose-500/20 shrink-0">
 <Sparkles className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-rose-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
 <span className="truncate">Hero Badge Active</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 4. In Stock */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-teal-700 transition-colors block truncate">
 In-Stock Inventory
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-teal-950 mt-1 transition-colors truncate">
 {products.filter(p => p.availableQuantity > 0).length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-teal-50 text-teal-600 border border-teal-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-teal-500 group-hover:shadow-lg group-hover:shadow-teal-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-teal-500/20 shrink-0">
 <CheckCircle2 className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-teal-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
 <span className="truncate">Ready for Order</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>
 </div>

 {/* Main Governance Table Container */}
 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h3 className="font-display font-bold text-xl text-forest-950">
 Produce Catalog Governance
 </h3>
 <p className="text-xs text-agriText-muted">
 Full oversight to inspect pricing, adjust stock, feature crops on homepage, or remove listings.
 </p>
 </div>
 <button
 onClick={() => setIsAddProductOpen(true)}
 className="px-4 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
 >
 <Plus className="w-4 h-4 text-fresh" />
 <span>Add Produce to Catalog</span>
 </button>
 </div>

 {/* Filters */}
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-1">
 <Search className="w-4 h-4 text-forest-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search produce name, farmer, or region..."
 value={produceSearch}
 onChange={(e) => setProduceSearch(e.target.value)}
 className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-forest-200 text-xs text-forest-950 focus:outline-none focus:border-forest-600"
 />
 </div>
 <select
 value={produceCategory}
 onChange={(e) => setProduceCategory(e.target.value)}
 className="px-3.5 py-2.5 rounded-xl border border-forest-200 text-xs font-semibold text-forest-950 bg-white"
 >
 <option value="all">All Categories</option>
 <option value="Vegetables">Vegetables</option>
 <option value="Fruits">Fruits</option>
 <option value="Grains">Grains</option>
 <option value="Pulses">Pulses</option>
 <option value="Dairy">Dairy</option>
 </select>
 </div>

 {/* Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
 <th className="pb-3 pl-2">Produce</th>
 <th className="pb-3">Grower & Origin</th>
 <th className="pb-3">Price</th>
 <th className="pb-3">Stock Level</th>
 <th className="pb-3 text-center">Featured</th>
 <th className="pb-3 text-center">Today's Pick</th>
 <th className="pb-3 pr-2 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-forest-50 font-medium">
 {filteredProducts.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-8 text-center text-agriText-muted">
 No produce listings match the current filter.
 </td>
 </tr>
 ) : (
 filteredProducts.map((prod) => (
 <tr key={prod.id} className="hover:bg-forest-50/50">
 <td className="py-3 pl-2 flex items-center space-x-3">
 <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-forest-100 shrink-0" />
 <div>
 <p className="font-bold text-forest-950">{prod.name}</p>
 <span className="text-[10px] text-agriText-muted">{prod.category}</span>
 </div>
 </td>
 <td className="py-3">
 <p className="font-semibold text-forest-900">{prod.farmerName}</p>
 <p className="text-[10px] text-agriText-muted">{prod.location}</p>
 </td>
 <td className="py-3 font-bold text-forest-950">₹{prod.price} / {prod.unit}</td>
 <td className="py-3">
 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
 prod.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
 }`}>
 {prod.availableQuantity} {prod.unit}
 </span>
 </td>
 <td className="py-3 text-center">
 <button
 onClick={() => toggleProductFeatured(prod.id)}
 className={`p-1.5 rounded-xl transition-all ${
 prod.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
 }`}
 title="Toggle featured status"
 >
 <Star className={`w-3.5 h-3.5 ${prod.featured ? 'fill-amber-500' : ''}`} />
 </button>
 </td>
 <td className="py-3 text-center">
 <button
 onClick={() => toggleProductTodaysPick(prod.id)}
 className={`p-1.5 rounded-xl transition-all ${
 prod.todaysPick ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
 }`}
 title="Toggle Today's Pick badge on Hero"
 >
 <Sparkles className="w-3.5 h-3.5" />
 </button>
 </td>
 <td className="py-3 pr-2 text-right space-x-1">
 <button
 onClick={() => setEditingProduct(prod)}
 className="p-1.5 text-forest-700 hover:bg-forest-100 rounded-lg"
 title="Edit price/stock"
 >
 <Edit3 className="w-3.5 h-3.5" />
 </button>
 <button
 onClick={() => deleteProduct(prod.id)}
 className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
 title="Delete from marketplace"
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
 </div>
 )}

 {/* ======================= TAB: FARMERS DIRECTORY ======================= */}
 {activeTab === 'farmers' && (
 <div className="space-y-6 max-w-7xl mx-auto">
 
 {/* 4 Metric Cards for Farmers */}
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
 {/* 1. Total Growers */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block truncate">
 Registered Growers
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-emerald-950 mt-1 transition-colors truncate">
 {combinedFarmers.length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-500/20 shrink-0">
 <Users className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-emerald-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
 <span className="truncate">Platform Supply Base</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 2. KYC Verified */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-green-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-green-700 transition-colors block truncate">
 KYC Verified
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-green-950 mt-1 transition-colors truncate">
 {verifiedFarmersCount}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-green-50 text-green-600 border border-green-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-700 group-hover:text-white group-hover:border-green-500 group-hover:shadow-lg group-hover:shadow-green-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-green-500/20 shrink-0">
 <ShieldCheck className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-green-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
 <span className="truncate">100% Soil Checked</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-green-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 3. In Review Queue */}
 <div 
 onClick={() => setFarmerFilterStatus('pending')}
 className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
 >
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-700 transition-colors block truncate">
 In Review Queue
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-amber-950 mt-1 transition-colors truncate flex items-center gap-2">
 <span>{pendingFarmersCount}</span>
 {pendingFarmersCount > 0 && (
 <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 animate-pulse">
 Action Required
 </span>
 )}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-500/20 shrink-0">
 <AlertCircle className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-amber-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span className="truncate">{pendingFarmersCount > 0 ? 'Click to Filter Pending' : 'All Growers Verified'}</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 4. Regions */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-700 transition-colors block truncate">
 Active Districts
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-blue-950 mt-1 transition-colors truncate">
 {[...new Set(combinedFarmers.map(f => f.location))].length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-500/20 shrink-0">
 <MapPin className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-blue-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
 <span className="truncate">Nationwide Coverage</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>
 </div>

 {/* Farmers Registry Table Card */}
 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h3 className="font-display font-bold text-xl text-forest-950">
 Growers & Farmers Registry
 </h3>
 <p className="text-xs text-agriText-muted">
 Authorize KYC credentials, inspect farm provenance, and manage verified farm operations.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <div className="flex bg-slate-100 p-1 rounded-xl">
 <button
 onClick={() => setFarmerFilterStatus('all')}
 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
 farmerFilterStatus === 'all'
 ? 'bg-white text-forest-950 shadow-xs'
 : 'text-slate-500 hover:text-slate-900'
 }`}
 >
 All ({combinedFarmers.length})
 </button>
 <button
 onClick={() => setFarmerFilterStatus('pending')}
 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
 farmerFilterStatus === 'pending'
 ? 'bg-amber-500 text-white shadow-xs'
 : 'text-amber-800 hover:text-amber-950'
 }`}
 >
 <span>Pending</span>
 {pendingFarmersCount > 0 && (
 <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-700 text-white font-extrabold">
 {pendingFarmersCount}
 </span>
 )}
 </button>
 <button
 onClick={() => setFarmerFilterStatus('verified')}
 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
 farmerFilterStatus === 'verified'
 ? 'bg-emerald-600 text-white shadow-xs'
 : 'text-emerald-700 hover:text-emerald-900'
 }`}
 >
 Verified ({verifiedFarmersCount})
 </button>
 </div>

 <div className="relative w-full sm:w-64">
 <Search className="w-4 h-4 text-forest-600 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search grower name, farm, or state..."
 value={farmerSearch}
 onChange={(e) => setFarmerSearch(e.target.value)}
 className="w-full pl-9 pr-3 py-2 rounded-xl border border-forest-200 text-xs focus:outline-none focus:border-forest-600"
 />
 </div>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
 <th className="pb-3 pl-2">Farmer</th>
 <th className="pb-3">Farm Name & Location</th>
 <th className="pb-3">Experience</th>
 <th className="pb-3">Specialties</th>
 <th className="pb-3">KYC Status</th>
 <th className="pb-3 pr-2 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-forest-50 font-medium">
 {filteredFarmers.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-8 text-center text-agriText-muted">
 No registered farmers found matching the search / filter.
 </td>
 </tr>
 ) : (
 filteredFarmers.map((f) => (
 <tr key={f.id} className="hover:bg-forest-50/50">
 <td className="py-3 pl-2 flex items-center space-x-3">
 <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-xl object-cover border border-forest-100 shrink-0" />
 <div>
 <p className="font-bold text-forest-950">{f.name}</p>
 <p className="text-[10px] text-agriText-muted">{f.email}</p>
 {f.phone && <p className="text-[10px] text-slate-400 font-mono">{f.phone}</p>}
 </div>
 </td>
 <td className="py-3">
 <p className="font-semibold text-forest-900">{f.farmName}</p>
 <p className="text-[10px] text-agriText-muted">{f.location}</p>
 </td>
 <td className="py-3 font-semibold text-forest-950">
 {f.experienceYears ? `${f.experienceYears} Years` : '5+ Years'}
 </td>
 <td className="py-3">
 <div className="flex flex-wrap gap-1 max-w-[180px]">
 {f.specialties?.map((s, idx) => (
 <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] bg-forest-50 text-forest-800 border border-forest-200">
 {s}
 </span>
 ))}
 </div>
 </td>
 <td className="py-3">
 <button
 onClick={async () => {
 await toggleFarmerVerification(f.id);
 await fetchAllUsers();
 }}
 className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs ${
 f.verified
 ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
 : 'bg-amber-500 hover:bg-amber-600 text-white font-extrabold animate-pulse'
 }`}
 title={f.verified ? 'Verified Grower (Click to revoke)' : 'Click to Verify & Authorize Farmer'}
 >
 <ShieldCheck className="w-3.5 h-3.5" />
 <span>{f.verified ? 'Verified ✓' : 'Verify & Approve ⏳'}</span>
 </button>
 </td>
 <td className="py-3 pr-2 text-right">
 <button
 onClick={() => deleteFarmer(f.id)}
 className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
 title="Remove from directory"
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
 </div>
 )}

 {/* ======================= TAB: ALL ORDERS OVERSIGHT ======================= */}
 {activeTab === 'orders' && (
 <div className="space-y-6 max-w-7xl mx-auto">
 
 {/* 4 Metric Cards for Orders */}
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
 {/* 1. Total Orders */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-700 transition-colors block truncate">
 Total Orders
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-blue-950 mt-1 transition-colors truncate">
 {orders.length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-blue-100/80 text-blue-700 border border-blue-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-500/20 shrink-0">
 <ShoppingCart className="w-5 h-5 transition-all duration-300 text-blue-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-blue-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
 <span className="truncate">All Platform Orders</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 2. Pending Orders */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-700 transition-colors block truncate">
 Pending Dispatch
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-amber-950 mt-1 transition-colors truncate">
 {pendingOrdersCount}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-500/20 shrink-0">
 <Clock className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-amber-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span className="truncate">Requires Dispatch</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 3. Delivered */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-green-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-green-700 transition-colors block truncate">
 Completed Deliveries
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-green-950 mt-1 transition-colors truncate">
 {orders.filter(o => o.status === 'Delivered').length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-green-50 text-green-600 border border-green-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-700 group-hover:text-white group-hover:border-green-500 group-hover:shadow-lg group-hover:shadow-green-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-green-500/20 shrink-0">
 <CheckCircle2 className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-green-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
 <span className="truncate">Fulfillments Verified</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-green-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 4. Total Volume */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block truncate">
 Platform Trade GMV
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-emerald-950 mt-1 transition-colors truncate">
 ₹{totalVolume.toLocaleString()}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-100/80 text-emerald-700 border border-emerald-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-500/20 shrink-0">
 <DollarSign className="w-5 h-5 transition-all duration-300 text-emerald-700 group-hover:text-white stroke-[2.8]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-emerald-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
 <span className="truncate">Settled via Escrow</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>
 </div>

 {/* Orders Oversight Table Card */}
 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h3 className="font-display font-bold text-xl text-forest-950">
 Platform Purchase Orders Oversight
 </h3>
 <p className="text-xs text-agriText-muted">
 Supervise all transactions between buyers and local farmers, resolve inquiries, and update fulfillment states.
 </p>
 </div>
 
 {/* Search & Status Filter */}
 <div className="flex flex-wrap items-center gap-2">
 <div className="relative">
 <Search className="w-3.5 h-3.5 text-forest-600 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search ID, Buyer..."
 value={orderSearch}
 onChange={(e) => setOrderSearch(e.target.value)}
 className="pl-8 pr-3 py-1.5 rounded-xl border border-forest-200 text-xs focus:outline-none"
 />
 </div>
 <select
 value={orderStatusFilter}
 onChange={(e) => setOrderStatusFilter(e.target.value)}
 className="px-3 py-1.5 rounded-xl border border-forest-200 text-xs font-bold text-forest-950 bg-white"
 >
 <option value="all">All Statuses</option>
 <option value="Pending">Pending</option>
 <option value="Accepted">Accepted</option>
 <option value="Dispatched">Dispatched</option>
 <option value="Delivered">Delivered</option>
 <option value="Rejected">Rejected</option>
 </select>
 </div>
 </div>

 {filteredOrders.length === 0 ? (
 <div className="text-center py-16 text-agriText-muted">
 <ShoppingBag className="w-12 h-12 text-forest-300 mx-auto mb-3" />
 <p className="font-bold text-forest-900 text-sm">No orders matching filter</p>
 <p className="text-xs text-agriText-muted mt-1">Platform customer orders will appear here automatically.</p>
 </div>
 ) : (
 <div className="space-y-4">
 {filteredOrders.map((ord) => (
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

 {/* Status Select for Admin */}
 <div className="flex items-center space-x-2">
 <span className="text-xs font-bold text-agriText-muted">Override Status:</span>
 <select
 value={ord.status}
 onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
 className="px-3 py-1.5 rounded-xl border border-forest-200 text-xs font-bold text-forest-950 bg-white focus:outline-none shadow-xs"
 >
 <option value="Pending">Pending</option>
 <option value="Accepted">Accepted</option>
 <option value="Dispatched">Dispatched</option>
 <option value="Delivered">Delivered</option>
 <option value="Rejected">Rejected</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
 <div>
 <p className="text-agriText-muted font-bold uppercase mb-1">Customer / Buyer:</p>
 <p className="font-bold text-forest-950">{ord.customerName}</p>
 <p className="text-agriText-muted">{ord.customerEmail}</p>
 <p className="text-agriText-muted">{ord.customerPhone}</p>
 <p className="text-agriText-muted mt-1">{ord.shippingAddress}</p>
 </div>

 <div>
 <p className="text-agriText-muted font-bold uppercase mb-1">Farmer Provider:</p>
 <p className="font-bold text-forest-950">{ord.farmerName || 'Patel Organic Farms'}</p>
 <p className="text-agriText-muted">Payment: {ord.paymentMethod}</p>
 </div>

 <div>
 <p className="text-agriText-muted font-bold uppercase mb-1">Items & Value:</p>
 <ul className="space-y-1 mb-2">
 {ord.items?.map((it, idx) => (
 <li key={idx} className="font-semibold text-forest-900">
 • {it.name} — {it.quantity} {it.unit} (₹{it.price * it.quantity})
 </li>
 ))}
 </ul>
 <p className="font-extrabold text-sm text-forest-950">
 Total: ₹{ord.total}
 </p>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}

 {/* ======================= TAB: BUYERS DIRECTORY (SEPARATE SECTION) ======================= */}
 {activeTab === 'buyers' && (
 <div className="space-y-6 max-w-7xl mx-auto">
 
 {/* 4 Metric Cards for Buyers */}
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
 {/* 1. Total Registered Buyers */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-700 transition-colors block truncate">
 Active Buyers
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-blue-950 mt-1 transition-colors truncate">
 {buyersList.length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-blue-100/80 text-blue-700 border border-blue-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-500/20 shrink-0">
 <ShoppingCart className="w-5 h-5 transition-all duration-300 text-blue-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-blue-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
 <span className="truncate">Registered Purchasing Accounts</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 2. Retail Grocery Partners */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block truncate">
 Retail Grocers
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-emerald-950 mt-1 transition-colors truncate">
 {buyersList.filter(b => (b.buyerType || '').toLowerCase().includes('retail')).length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-500/20 shrink-0">
 <Store className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-emerald-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
 <span className="truncate">Local Supermarkets & Stores</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 3. Wholesale & Bulk Procurement */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-purple-700 transition-colors block truncate">
 Wholesale & Mandi
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-purple-950 mt-1 transition-colors truncate">
 {buyersList.filter(b => (b.buyerType || '').toLowerCase().includes('wholesale') || (b.buyerType || '').toLowerCase().includes('distributor')).length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-purple-100/80 text-purple-700 border border-purple-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-purple-600 group-hover:shadow-lg group-hover:shadow-purple-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-purple-500/20 shrink-0">
 <Package className="w-5 h-5 transition-all duration-300 text-purple-700 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-purple-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
 <span className="truncate">Bulk Harvest Shipments</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 4. Total Procurement Orders */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-700 transition-colors block truncate">
 Network Purchases
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-amber-950 mt-1 transition-colors truncate">
 {orders.length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-500/20 shrink-0">
 <ShoppingBag className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-amber-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span className="truncate">Total Direct Invoices</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>
 </div>

 {/* Buyers Table Card */}
 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h3 className="font-display font-bold text-xl text-forest-950">
 Registered Buyers Directory
 </h3>
 <p className="text-xs text-agriText-muted">
 Wholesale distributors, institutional procurement managers, retail grocers, and individual buyers.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <div className="relative">
 <Search className="w-3.5 h-3.5 text-forest-600 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search buyers, email, city..."
 value={buyerSearch}
 onChange={(e) => setBuyerSearch(e.target.value)}
 className="pl-8 pr-3 py-1.5 rounded-xl border border-forest-200 text-xs focus:outline-none"
 />
 </div>
 <select
 value={buyerTypeFilter}
 onChange={(e) => setBuyerTypeFilter(e.target.value)}
 className="px-3 py-1.5 rounded-xl border border-forest-200 text-xs font-bold text-forest-950 bg-white"
 >
 <option value="all">All Buyer Types</option>
 <option value="retail">Retail Grocery Stores</option>
 <option value="wholesale">Wholesale & Distributors</option>
 <option value="restaurant">Restaurants & Catering</option>
 <option value="individual">Individual Customers</option>
 </select>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
 <th className="pb-3 pl-2">Buyer Profile</th>
 <th className="pb-3">Classification</th>
 <th className="pb-3">Contact Details</th>
 <th className="pb-3">Delivery Hub</th>
 <th className="pb-3">Purchases</th>
 <th className="pb-3">Joined Date</th>
 <th className="pb-3 pr-2 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-forest-50 font-medium">
 {filteredBuyers.length === 0 ? (
 <tr>
 <td colSpan={7} className="py-12 text-center text-agriText-muted">
 <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
 <p className="font-bold text-slate-700">No registered buyers found matching current filter.</p>
 <p className="text-[11px] text-slate-400 mt-1">
 New buyers registering via /register?role=buyer appear immediately in this dedicated section.
 </p>
 </td>
 </tr>
 ) : (
 filteredBuyers.map((b) => {
 const buyerOrdersCount = orders.filter(
 (o) => (o.customerEmail && o.customerEmail.toLowerCase() === (b.email || '').toLowerCase()) ||
 (o.customerName && o.customerName.toLowerCase() === (b.name || '').toLowerCase())
 ).length;

 return (
 <tr key={b.id || b._id} className="hover:bg-forest-50/50">
 <td className="py-3 pl-2 flex items-center space-x-3">
 <img
 src={getUserAvatar(b, 'buyer')}
 alt={b.name}
 className="w-9 h-9 rounded-xl object-cover border border-forest-200 shrink-0"
 />
 <div>
 <p className="font-bold text-forest-950">{b.name}</p>
 <p className="text-[10px] text-slate-400 font-mono">ID: {(b.id || b._id || '').slice(-6).toUpperCase()}</p>
 </div>
 </td>
 <td className="py-3">
 <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
 {b.buyerType || 'Retail Grocery Store'}
 </span>
 </td>
 <td className="py-3">
 <p className="font-mono text-forest-900">{b.email}</p>
 <p className="text-[10px] text-agriText-muted">{b.phone || 'Phone not set'}</p>
 </td>
 <td className="py-3">
 <p className="text-forest-900 font-medium">{b.location || 'India'}</p>
 </td>
 <td className="py-3 font-bold text-forest-950">
 {buyerOrdersCount > 0 ? (
 <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
 {buyerOrdersCount} Orders
 </span>
 ) : (
 <span className="text-slate-400">0 Orders</span>
 )}
 </td>
 <td className="py-3 text-agriText-muted">
 {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Active Member'}
 </td>
 <td className="py-3 pr-2 text-right">
 <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
 <CheckCircle2 className="w-3 h-3 text-emerald-700" />
 <span>Active Buyer ✓</span>
 </span>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* ======================= TAB: CONTACT MESSAGES & INQUIRIES ======================= */}
 {activeTab === 'inquiries' && (
 <div className="space-y-6 max-w-7xl mx-auto">
 
 {/* 4 Metric Cards for Inquiries */}
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
 {/* 1. Total Messages */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700 transition-colors block truncate">
 Total Messages
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-emerald-950 mt-1 transition-colors truncate">
 {inquiriesList.length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-700 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-emerald-500/20 shrink-0">
 <Mail className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-emerald-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
 <span className="truncate">Web3Forms & API Stream</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 2. Unread / Awaiting Action */}
 <div 
 onClick={() => setInquiryFilterStatus('unread')}
 className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
 >
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-700 transition-colors block truncate">
 Unread Inquiries
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-amber-950 mt-1 transition-colors truncate flex items-center gap-2">
 <span>{unreadInquiriesCount}</span>
 {unreadInquiriesCount > 0 && (
 <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 animate-pulse">
 New Action
 </span>
 )}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-amber-500/20 shrink-0">
 <Bell className="w-5 h-5 transition-all duration-300 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-amber-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
 <span className="truncate">{unreadInquiriesCount > 0 ? 'Click to Filter Unread' : 'Inbox Clear'}</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 3. Farmer Direct Quotes */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-purple-700 transition-colors block truncate">
 Farmer Quotes
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-purple-950 mt-1 transition-colors truncate">
 {inquiriesList.filter((i) => i.farmerName || i.farmerId).length}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-purple-100/80 text-purple-700 border border-purple-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-purple-600 group-hover:shadow-lg group-hover:shadow-purple-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-purple-500/20 shrink-0">
 <Store className="w-5 h-5 transition-all duration-300 text-purple-700 group-hover:text-white stroke-[2.2]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-purple-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
 <span className="truncate">Direct Harvest Inquiries</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>

 {/* 4. Resolved Inquiries */}
 <div className="min-w-0 flex flex-col justify-between group relative overflow-hidden bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 <div className="flex items-start justify-between gap-2 min-w-0">
 <div className="min-w-0 flex-1">
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-700 transition-colors block truncate">
 Resolved
 </span>
 <p className="font-display font-black text-xl sm:text-2xl xl:text-3xl text-slate-900 group-hover:text-blue-950 mt-1 transition-colors truncate">
 {resolvedInquiriesCount}
 </p>
 </div>
 <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-blue-100/80 text-blue-700 border border-blue-200/90 shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-500/20 shrink-0">
 <CheckCircle2 className="w-5 h-5 transition-all duration-300 text-blue-700 group-hover:text-white stroke-[2.5]" />
 </div>
 </div>
 <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between min-w-0 text-[10px] sm:text-[11px] font-bold text-blue-700">
 <span className="flex items-center gap-1.5 min-w-0 truncate">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
 <span className="truncate">Answered & Closed</span>
 </span>
 <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0 ml-1" />
 </div>
 </div>
 </div>

 {/* Messages Table Card */}
 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h3 className="font-display font-bold text-xl text-forest-950 flex items-center gap-2">
 <span>Incoming Contact & Advisory Inquiries</span>
 <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
 Web3Forms Active
 </span>
 </h3>
 <p className="text-xs text-agriText-muted">
 Inquiries submitted across the platform and routed to bikramdevsaw9@gmail.com and stored in database.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <div className="flex bg-slate-100 p-1 rounded-xl">
 <button
 onClick={() => setInquiryFilterStatus('all')}
 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
 inquiryFilterStatus === 'all'
 ? 'bg-white text-forest-950 shadow-xs'
 : 'text-slate-500 hover:text-slate-900'
 }`}
 >
 All ({inquiriesList.length})
 </button>
 <button
 onClick={() => setInquiryFilterStatus('unread')}
 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
 inquiryFilterStatus === 'unread'
 ? 'bg-amber-500 text-white shadow-xs'
 : 'text-amber-800 hover:text-amber-950'
 }`}
 >
 <span>Unread</span>
 {unreadInquiriesCount > 0 && (
 <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-700 text-white font-extrabold">
 {unreadInquiriesCount}
 </span>
 )}
 </button>
 <button
 onClick={() => setInquiryFilterStatus('resolved')}
 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
 inquiryFilterStatus === 'resolved'
 ? 'bg-emerald-600 text-white shadow-xs'
 : 'text-emerald-700 hover:text-emerald-900'
 }`}
 >
 Resolved ({resolvedInquiriesCount})
 </button>
 </div>

 <div className="relative w-full sm:w-64">
 <Search className="w-3.5 h-3.5 text-forest-600 absolute left-3 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search sender, email, message..."
 value={inquirySearch}
 onChange={(e) => setInquirySearch(e.target.value)}
 className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-forest-200 text-xs focus:outline-none"
 />
 </div>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-forest-100 text-agriText-muted uppercase tracking-wider font-bold">
 <th className="pb-3 pl-2">Sender Info</th>
 <th className="pb-3">Subject & Target</th>
 <th className="pb-3">Message Content</th>
 <th className="pb-3">Received Time</th>
 <th className="pb-3">Status</th>
 <th className="pb-3 pr-2 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-forest-50 font-medium">
 {filteredInquiries.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-12 text-center text-agriText-muted">
 <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
 <p className="font-bold text-slate-700">No contact messages matching filter.</p>
 <p className="text-[11px] text-slate-400 mt-1">
 Inquiries sent via the Contact page or farmer modal will appear here in real time.
 </p>
 </td>
 </tr>
 ) : (
 filteredInquiries.map((inq) => {
 const isUnread = inq.status === 'unread';
 const displayTime = inq.createdAt 
 ? new Date(inq.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
 : 'Just now';

 return (
 <tr key={inq._id || inq.id} className={`hover:bg-forest-50/50 transition-colors ${isUnread ? 'bg-amber-50/30' : ''}`}>
 <td className="py-3 pl-2">
 <p className="font-bold text-forest-950 flex items-center gap-1.5">
 {isUnread && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />}
 <span>{inq.name}</span>
 </p>
 <p className="font-mono text-[11px] text-forest-700">{inq.email}</p>
 {inq.phone && <p className="text-[10px] text-slate-400 font-mono">{inq.phone}</p>}
 </td>
 <td className="py-3">
 <p className="font-semibold text-forest-900 max-w-[200px] truncate">{inq.subject || 'Platform Inquiry'}</p>
 {inq.farmerName ? (
 <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
 <Store className="w-3 h-3 text-emerald-600" />
 <span>To: {inq.farmerName}</span>
 </span>
 ) : (
 <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
 General Advisory
 </span>
 )}
 </td>
 <td className="py-3 max-w-[280px]">
 <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">{inq.message}</p>
 <button
 onClick={() => setSelectedInquiry(inq)}
 className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 mt-0.5 underline flex items-center gap-0.5"
 >
 <span>View Message</span>
 <ArrowUpRight className="w-3 h-3" />
 </button>
 </td>
 <td className="py-3 text-slate-500 text-[11px] whitespace-nowrap">
 {displayTime}
 </td>
 <td className="py-3">
 <button
 onClick={() => handleToggleInquiryStatus(inq._id || inq.id, inq.status)}
 className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all flex items-center space-x-1 shadow-2xs ${
 isUnread
 ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
 : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
 }`}
 title="Click to toggle status"
 >
 {isUnread ? (
 <>
 <Clock className="w-3 h-3 text-amber-700" />
 <span>Unread ⚠️</span>
 </>
 ) : (
 <>
 <CheckCircle2 className="w-3 h-3 text-emerald-700" />
 <span>Resolved ✓</span>
 </>
 )}
 </button>
 </td>
 <td className="py-3 pr-2 text-right">
 <div className="flex items-center justify-end space-x-1.5">
 <a
 href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'AgriConnect Inquiry')}`}
 className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
 title={`Reply to ${inq.name} (${inq.email})`}
 >
 <Mail className="w-3.5 h-3.5" />
 </a>
 <button
 onClick={() => handleDeleteInquiry(inq._id || inq.id)}
 className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
 title="Delete inquiry"
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}

 {/* View Full Inquiry Modal */}
 {selectedInquiry && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
 <div 
 className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="bg-gradient-to-r from-emerald-900 to-forest-800 p-6 text-white relative">
 <button
 onClick={() => setSelectedInquiry(null)}
 className="absolute top-5 right-5 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
 >
 <X className="w-5 h-5" />
 </button>
 <div className="inline-block bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
 Contact Inquiry Detail
 </div>
 <h3 className="font-display font-extrabold text-xl text-white">
 {selectedInquiry.subject || 'Platform Contact Message'}
 </h3>
 <p className="text-xs text-emerald-200 mt-1">
 From: {selectedInquiry.name} ({selectedInquiry.email})
 </p>
 </div>

 <div className="p-6 space-y-4 overflow-y-auto text-xs text-slate-800">
 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
 <div className="grid grid-cols-2 gap-2 text-xs">
 <div>
 <span className="font-bold text-slate-500 uppercase text-[10px]">Phone Number</span>
 <p className="font-semibold text-slate-900">{selectedInquiry.phone || 'Not provided'}</p>
 </div>
 <div>
 <span className="font-bold text-slate-500 uppercase text-[10px]">Target Recipient</span>
 <p className="font-semibold text-slate-900">{selectedInquiry.farmerName ? `Farmer: ${selectedInquiry.farmerName}` : 'Central Advisory'}</p>
 </div>
 </div>
 <div>
 <span className="font-bold text-slate-500 uppercase text-[10px]">Received At</span>
 <p className="text-slate-700">{selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleString('en-IN') : 'Recent'}</p>
 </div>
 </div>

 <div>
 <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Detailed Message</h4>
 <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-sans text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
 {selectedInquiry.message}
 </div>
 </div>

 <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
 <button
 onClick={() => handleToggleInquiryStatus(selectedInquiry._id || selectedInquiry.id, selectedInquiry.status)}
 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
 selectedInquiry.status === 'unread'
 ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
 : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
 }`}
 >
 {selectedInquiry.status === 'unread' ? 'Mark as Resolved ✓' : 'Mark as Unread ⚠️'}
 </button>

 <div className="flex items-center gap-2">
 <button
 onClick={() => setSelectedInquiry(null)}
 className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
 >
 Close
 </button>
 <a
 href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'AgriConnect Advisory')}`}
 className="px-4 py-2 rounded-xl bg-forest-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-forest-800 transition-all"
 >
 <Mail className="w-3.5 h-3.5 text-fresh" />
 <span>Reply via Email</span>
 </a>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ======================= TAB: PLATFORM POLICIES & SETTINGS ======================= */}
 {activeTab === 'settings' && (
 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs max-w-2xl mx-auto space-y-6">
 <div>
 <h3 className="font-display font-bold text-xl text-forest-950">
 Platform Policies & Trade Controls
 </h3>
 <p className="text-xs text-agriText-muted">
 Configure marketplace take rates, settlement protocols, and public announcement banners.
 </p>
 </div>

 <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="font-bold text-forest-950 uppercase tracking-wider">
 Platform Commission Take Rate (%)
 </label>
 <span className="font-display font-bold text-base text-forest-950">
 {tempSettings.commissionRate}%
 </span>
 </div>
 <input
 type="range"
 min="0"
 max="10"
 step="0.5"
 value={tempSettings.commissionRate}
 onChange={(e) => setTempSettings({ ...tempSettings, commissionRate: Number(e.target.value) })}
 className="w-full accent-forest-700 cursor-pointer"
 />
 <p className="text-[11px] text-agriText-muted mt-1">
 AgriConnect operates with <strong>0% middleman fees</strong> to maintain 100% direct farmer earnings.
 </p>
 </div>

 <div>
 <label className="block font-bold text-forest-950 uppercase tracking-wider mb-1.5">
 Live Broadcast Announcement Banner
 </label>
 <textarea
 rows="3"
 value={tempSettings.bannerAnnouncement}
 onChange={(e) => setTempSettings({ ...tempSettings, bannerAnnouncement: e.target.value })}
 placeholder="e.g. 🌾 Direct Farm Trade Protocol: 0% Platform Commission active across all harvests."
 className="w-full p-3 rounded-xl border border-forest-200 text-xs font-medium focus:outline-none focus:border-forest-600"
 />
 <p className="text-[11px] text-agriText-muted mt-1">
 This message is broadcasted on top of the public marketplace and client applications.
 </p>
 </div>

 <div className="space-y-3 pt-2">
 <label className="flex items-center space-x-3 cursor-pointer">
 <input
 type="checkbox"
 checked={tempSettings.instantPayouts}
 onChange={(e) => setTempSettings({ ...tempSettings, instantPayouts: e.target.checked })}
 className="rounded accent-forest-700 w-4 h-4"
 />
 <span className="font-bold text-forest-950">Enable 24h Direct UPI Payouts to Farmers</span>
 </label>

 <label className="flex items-center space-x-3 cursor-pointer">
 <input
 type="checkbox"
 checked={tempSettings.inspectionRequired}
 onChange={(e) => setTempSettings({ ...tempSettings, inspectionRequired: e.target.checked })}
 className="rounded accent-forest-700 w-4 h-4"
 />
 <span className="font-bold text-forest-950">Require Organic Certification Soil Report on Registration</span>
 </label>
 </div>

 <button
 type="submit"
 className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
 >
 Save Platform Policies to Database
 </button>
 </form>
 </div>
 )}

 </main>
 </div>

 {/* ===================== MODAL: EDIT PRODUCE ===================== */}
 {editingProduct && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 text-slate-900">
 <div 
 className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="bg-forest-900 p-6 text-white flex items-center justify-between">
 <div>
 <h3 className="font-display font-extrabold text-xl">Admin Edit: {editingProduct.name}</h3>
 <p className="text-xs text-gray-300">Modify marketplace listing details</p>
 </div>
 <button
 onClick={() => setEditingProduct(null)}
 className="p-1 rounded-full text-white/80 hover:text-white"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleSaveProductEdit} className="p-6 space-y-4 text-xs">
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
 <label className="block font-bold text-forest-950 uppercase mb-1">Stock Quantity</label>
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
 <span>Mark as Certified Organic</span>
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
 Save Produce Updates
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* ===================== MODAL: ADD PRODUCE BY ADMIN ===================== */}
 {isAddProductOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 text-slate-900">
 <div 
 className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="bg-forest-900 p-6 text-white flex items-center justify-between">
 <div>
 <h3 className="font-display font-extrabold text-xl">Admin: Add Harvest Listing</h3>
 <p className="text-xs text-gray-300">Add directly to the verified marketplace catalog</p>
 </div>
 <button
 onClick={() => setIsAddProductOpen(false)}
 className="p-1 rounded-full text-white/80 hover:text-white"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <form onSubmit={handleCreateNewProduct} className="p-6 space-y-4 text-xs">
 <div>
 <label className="block font-bold text-forest-950 uppercase mb-1">Produce Name *</label>
 <input
 type="text"
 required
 placeholder="e.g. Organic Alphonso Mangoes"
 value={newProductData.name}
 onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block font-bold text-forest-950 uppercase mb-1">Category</label>
 <select
 value={newProductData.category}
 onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 bg-white"
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
 value={newProductData.unit}
 onChange={(e) => setNewProductData({ ...newProductData, unit: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 bg-white"
 >
 <option value="kg">kg</option>
 <option value="bunch">bunch</option>
 <option value="piece">piece</option>
 <option value="liter">liter</option>
 <option value="jar (500ml)">jar (500ml)</option>
 </select>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block font-bold text-forest-950 uppercase mb-1">Price (₹) *</label>
 <input
 type="number"
 required
 placeholder="e.g. 80"
 value={newProductData.price}
 onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
 />
 </div>

 <div>
 <label className="block font-bold text-forest-950 uppercase mb-1">Stock Quantity *</label>
 <input
 type="number"
 required
 placeholder="e.g. 200"
 value={newProductData.availableQuantity}
 onChange={(e) => setNewProductData({ ...newProductData, availableQuantity: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
 />
 </div>
 </div>

 <div>
 <label className="block font-bold text-forest-950 uppercase mb-1">Farmer Provider</label>
 <input
 type="text"
 value={newProductData.farmerName}
 onChange={(e) => setNewProductData({ ...newProductData, farmerName: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
 />
 </div>

 <div>
 <label className="block font-bold text-forest-950 uppercase mb-1">Image URL</label>
 <input
 type="url"
 value={newProductData.image}
 onChange={(e) => setNewProductData({ ...newProductData, image: e.target.value })}
 className="w-full p-2.5 rounded-xl border border-forest-200 focus:outline-none focus:border-forest-600"
 />
 </div>

 <div className="pt-3 flex gap-3">
 <button
 type="button"
 onClick={() => setIsAddProductOpen(false)}
 className="w-1/3 py-2.5 rounded-xl border border-forest-200 font-bold text-agriText-muted hover:bg-forest-50"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold shadow-md active:scale-95 transition-all"
 >
 Add to Marketplace
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 </div>
 );
}
