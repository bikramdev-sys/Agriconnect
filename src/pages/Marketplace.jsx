import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  RotateCcw, 
  ArrowUpDown,
  MapPin,
  Heart
} from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import { useCart } from '../context/CartContext';
import { productCategories } from '../data/products';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, favorites } = useCart();

  // Filters state
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [organicOnly, setOrganicOnly] = useState(searchParams.get('organic') === 'true');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [maxPrice, setMaxPrice] = useState(900);
  const [sortBy, setSortBy] = useState('default');
  const [favoritesOnly, setFavoritesOnly] = useState(searchParams.get('favorites') === 'true');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const search = searchParams.get('search');
    if (search !== null) setSearchQuery(search);
    const fav = searchParams.get('favorites');
    if (fav === 'true') setFavoritesOnly(true);
  }, [searchParams]);

  // Extract unique locations from products
  const locations = useMemo(() => {
    const locs = new Set(products.map((p) => p.location.split(',')[1]?.trim() || p.state || 'Other'));
    return ['all', ...Array.from(locs)];
  }, [products]);

  // Reset all filters
  const resetFilters = () => {
    setCategory('all');
    setSearchQuery('');
    setOrganicOnly(false);
    setInStockOnly(false);
    setSelectedLocation('all');
    setMaxPrice(900);
    setSortBy('default');
    setFavoritesOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    category !== 'all' ||
    searchQuery.trim() !== '' ||
    organicOnly ||
    inStockOnly ||
    selectedLocation !== 'all' ||
    maxPrice < 900 ||
    favoritesOnly;

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (category === 'organic' && !p.isOrganic) return false;
        if (category !== 'all' && category !== 'organic' && p.category !== category) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchFarmer = p.farmerName.toLowerCase().includes(q);
          const matchLoc = p.location.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchFarmer && !matchLoc) return false;
        }

        // Organic toggle
        if (organicOnly && !p.isOrganic) return false;

        // Stock toggle
        if (inStockOnly && p.availableQuantity <= 0) return false;

        // Location filter
        if (selectedLocation !== 'all') {
          const locStr = `${p.location} ${p.state}`.toLowerCase();
          if (!locStr.includes(selectedLocation.toLowerCase())) return false;
        }

        // Price range
        if (p.price > maxPrice) return false;

        // Favorites only
        if (favoritesOnly && !favorites.includes(p.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [
    products,
    category,
    searchQuery,
    organicOnly,
    inStockOnly,
    selectedLocation,
    maxPrice,
    sortBy,
    favoritesOnly,
    favorites
  ]);

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-[#FAFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Marketplace Banner Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-forest-950 tracking-tight">
                Fresh From the Farm
              </h1>
              <p className="text-agriText-muted text-sm sm:text-base mt-1.5 max-w-2xl">
                Discover quality produce directly from trusted local farmers with zero middleman markups.
              </p>
            </div>

            {/* Quick Favorites Pill */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`self-center sm:self-auto px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-xs border ${
                favoritesOnly
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-forest-900 border-forest-100 hover:bg-forest-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-red-500 text-red-500' : 'text-forest-700'}`} />
              <span>Saved Produce ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar: Search + Category Pills */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-forest-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by produce name (e.g. Tomatoes), farmer, or region..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-forest-100 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 text-sm text-forest-950 font-medium transition-all shadow-soft outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-agriText-muted hover:text-forest-900 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-3 rounded-2xl bg-white border border-forest-100 text-forest-900 font-bold text-sm flex items-center justify-center space-x-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-forest-700" />
              <span>Filter Produce</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-fresh" />
              )}
            </button>
          </div>

          {/* Category Carousel Filter */}
          <CategoryFilter
            categories={productCategories}
            selectedCategory={category}
            onSelectCategory={setCategory}
          />
        </div>

        {/* Layout: Sidebar Filters + Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar (Desktop & Mobile Drawer) */}
          <aside
            className={`lg:col-span-3 bg-white rounded-3xl p-6 border border-forest-100/90 shadow-soft lg:sticky lg:top-28 transition-all ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-forest-100 mb-5">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-forest-700" />
                <h3 className="font-display font-bold text-base text-forest-950">
                  Filters
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Organic Products Only Toggle */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-forest-50/60 hover:bg-forest-50 transition-colors border border-forest-100">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-fresh" />
                  <span className="text-xs font-bold text-forest-950">Organic Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="w-4 h-4 accent-forest-700 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* In-Stock Only Toggle */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-forest-50/60 hover:bg-forest-50 transition-colors border border-forest-100">
                <span className="text-xs font-bold text-forest-950">In-Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-forest-700 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6 pb-6 border-b border-forest-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="font-display font-bold text-sm text-forest-900">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="900"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-forest-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-semibold text-agriText-muted mt-1">
                <span>₹20</span>
                <span>₹450</span>
                <span>₹900+</span>
              </div>
            </div>

            {/* Farm Location Filter */}
            <div className="mb-6 pb-6 border-b border-forest-100">
              <label className="text-xs font-bold text-forest-950 uppercase tracking-wider block mb-2">
                Origin Region
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-forest-50/70 border border-forest-200 text-xs font-semibold text-forest-950 focus:outline-none focus:border-forest-600"
              >
                <option value="all">All States & Regions</option>
                {locations.filter((l) => l !== 'all').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-xs font-bold text-forest-950 uppercase tracking-wider block mb-2">
                Sort Produce By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-forest-50/70 border border-forest-200 text-xs font-semibold text-forest-950 focus:outline-none focus:border-forest-600"
              >
                <option value="default">Featured / Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </aside>

          {/* Main Products Grid Column */}
          <main className="lg:col-span-9">
            {/* Header info count & active pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-xs sm:text-sm font-semibold text-agriText-muted">
                Showing <span className="font-bold text-forest-950">{filteredProducts.length}</span> fresh harvest items
              </p>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {category !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-900">
                      Category: {category}
                      <button onClick={() => setCategory('all')}>
                        <X className="w-3 h-3 hover:text-red-500" />
                      </button>
                    </span>
                  )}
                  {organicOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-900">
                      Organic
                      <button onClick={() => setOrganicOnly(false)}>
                        <X className="w-3 h-3 hover:text-red-500" />
                      </button>
                    </span>
                  )}
                  {selectedLocation !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-900">
                      Region: {selectedLocation}
                      <button onClick={() => setSelectedLocation('all')}>
                        <X className="w-3 h-3 hover:text-red-500" />
                      </button>
                    </span>
                  )}
                  {maxPrice < 900 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-900">
                      ≤ ₹{maxPrice}
                      <button onClick={() => setMaxPrice(900)}>
                        <X className="w-3 h-3 hover:text-red-500" />
                      </button>
                    </span>
                  )}
                  {favoritesOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Saved Only
                      <button onClick={() => setFavoritesOnly(false)}>
                        <X className="w-3 h-3 hover:text-red-500" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Product Cards */}
            <ProductGrid
              products={filteredProducts}
              emptyMessage="No fresh harvests match these specific criteria. Try adjusting your price range or clearing filters."
            />
          </main>

        </div>
      </div>
    </div>
  );
}
