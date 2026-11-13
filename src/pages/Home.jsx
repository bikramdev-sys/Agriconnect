import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Store, 
  ClipboardList, 
  DollarSign, 
  HeartHandshake, 
  PhoneCall, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import Hero from '../components/Hero';
import FarmExperience3D from '../components/FarmExperience3D';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { useCart } from '../context/CartContext';
import { productCategories } from '../data/products';

export default function Home() {
  const { products } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products for homepage preview
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'organic') return p.isOrganic;
    return p.category === selectedCategory;
  });

  const displayProducts = filteredProducts.slice(0, 8);

  const pillars = [
    {
      title: 'How It Works',
      subtitle: 'The 3-Step Direct Protocol',
      desc: 'Discover our transparent process connecting verified farmers directly with retail and commercial buyers with zero hidden broker markups.',
      link: '/how-it-works',
      linkText: 'Explore How It Works',
      icon: ClipboardList,
      color: 'bg-fresh/15 text-forest-800'
    },
    {
      title: 'For Farmers & Growers',
      subtitle: 'Earn Up to 40% More',
      desc: 'Set your own fair prices, access our interactive profit boost calculator, and receive guaranteed same-day payouts with free farmgate pickup.',
      link: '/for-farmers',
      linkText: 'Open Farmer Program & Calculator',
      icon: DollarSign,
      color: 'bg-accent-yellow/20 text-forest-900'
    },
    {
      title: 'About AgriConnect',
      subtitle: 'Our Story & Purpose',
      desc: 'Learn how our agronomists and rural operations teams are reducing agricultural food waste and restoring dignity to smallholder growers.',
      link: '/about',
      linkText: 'Read Our Story',
      icon: HeartHandshake,
      color: 'bg-forest-100 text-forest-900'
    },
    {
      title: '24/7 Farmer & Buyer Desk',
      subtitle: 'We Are Here For You',
      desc: 'Get immediate phone support in 6 regional languages, chat via WhatsApp Kisan Mitra, or connect with our 14 regional distribution hubs.',
      link: '/contact',
      linkText: 'Contact Support Team',
      icon: PhoneCall,
      color: 'bg-blue-100 text-blue-900'
    }
  ];

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Marketplace Section: "Fresh From the Farm" */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
                Fresh From the Farm
              </h2>
              <p className="text-agriText-muted text-base mt-2 max-w-xl">
                Discover quality produce directly from trusted local farmers with transparent harvest dates and zero middleman markups.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-forest-50 hover:bg-forest-100 text-forest-900 font-bold text-sm border border-forest-200/80 transition-all self-start md:self-end group shadow-xs"
            >
              <Store className="w-4 h-4 text-forest-700" />
              <span>Explore All Produce</span>
              <ArrowRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-8">
            <CategoryFilter
              categories={productCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-12 text-center">
            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 group"
            >
              <span>View All {products.length} Farm Items in Marketplace</span>
              <ArrowRight className="w-4 h-4 text-fresh group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. The AgriConnect Ecosystem Hub (Pillars leading to dedicated pages) */}
      <section className="py-20 sm:py-24 bg-[#FAFAF5] relative border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
              A Transparent Solution for Agriculture
            </h2>
            <p className="text-agriText-muted text-base mt-2">
              Explore dedicated sections tailored for buyers, producers, and ethical agriculture enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-forest-100 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-forest-700 block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-display font-bold text-xl text-forest-950 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-agriText-muted text-xs sm:text-sm leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-forest-900 group-hover:text-forest-700 transition-colors pt-4 border-t border-forest-50"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-fresh group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Dedicated 3D Interactive Farm Experience Section: "Where Freshness Begins" */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
              Where Freshness Begins
            </h2>
            <p className="text-agriText-muted text-base mt-2">
              Step inside our stylized sustainable digital farm. Explore real-time crop rows, low-impact solar tractors, and direct packing stations.
            </p>
          </div>

          {/* 3D Farm Landscape Component */}
          <FarmExperience3D />
        </div>
      </section>

      {/* 5. Testimonials Carousel Section */}
      <Testimonials />

      {/* 6. FAQ Section */}
      <FAQ />

      {/* 7. Final Call To Action Banner */}
      <section className="py-16 bg-cream border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-forest-900 to-forest-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
                Ready to Experience Truly Fresh Farm Produce?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                Whether you are a grower with surplus harvests, an urban household, or a commercial kitchen, AgriConnect is built for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  Start Sourcing Produce
                </Link>
                <Link
                  to="/for-farmers"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
                >
                  Explore Farmer Benefits
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-95"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
