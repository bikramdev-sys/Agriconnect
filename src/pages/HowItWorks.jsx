import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Store, 
  DollarSign, 
  Clock, 
  Users, 
  Leaf, 
  RefreshCw, 
  HelpCircle,
  TrendingUp,
  Scale,
  Award
} from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('buyers'); // 'buyers' | 'farmers'
  const [openFaq, setOpenFaq] = useState(null);

  const buyerSteps = [
    {
      step: '01',
      title: 'Explore Live Farm Harvests',
      subtitle: 'Browse produce straight from the source',
      description: 'Search seasonal vegetables, orchard fruits, grains, and organic produce. View precise harvest dates, the farmer’s certified region, and honest farm-gate prices.',
      icon: Search,
      badge: 'Step 1: Discovery',
      highlights: [
        'Filter by organic certification & harvest date',
        'Direct farmer profiles with verified credentials',
        'Transparent wholesale and retail tier pricing'
      ],
      tag: 'Zero Markups'
    },
    {
      step: '02',
      title: 'Customize Your Order or Connect Directly',
      subtitle: 'Seamless ordering with complete clarity',
      description: 'Order by kilogram or crate. For bulk or institutional demands (restaurants, grocers), send a direct purchase proposal or message the grower directly with your specs.',
      icon: ClipboardList,
      badge: 'Step 2: Transparent Order',
      highlights: [
        'Flexible batch sizing from 5kg to multi-ton lots',
        'Direct messaging with verified grower',
        'Instant escrow reservation protecting your payment'
      ],
      tag: 'Direct Connection'
    },
    {
      step: '03',
      title: 'Rapid Farmgate Dispatch to Your Doorstep',
      subtitle: 'Field-fresh produce within 24 to 36 hours',
      description: 'Produce is harvested on schedule and dispatched immediately through temperature-optimized direct transit. You receive produce that never sat for days in stale wholesale yards.',
      icon: Truck,
      badge: 'Step 3: Farm-to-Table Transit',
      highlights: [
        'Batch tracking from harvest timestamp to delivery',
        'Direct cold-chain logistics minimizing spoilage',
        'Quality-check guarantee upon receipt'
      ],
      tag: 'Peak Freshness'
    }
  ];

  const farmerSteps = [
    {
      step: '01',
      title: 'Create Your Free Farmer Profile in 2 Minutes',
      subtitle: 'No listing fees or broker contracts',
      description: 'Sign up with your phone or Kisan ID. Showcase your farmland, upload soil or organic certifications, and reach thousands of verified buyers in urban centers.',
      icon: Store,
      badge: 'Step 1: Simple Onboarding',
      highlights: [
        '100% free account creation and farm listing',
        'Regional language phone support available',
        'Verified Farmer Badge to build customer trust'
      ],
      tag: '100% Free Setup'
    },
    {
      step: '02',
      title: 'List Upcoming Harvests & Set Your Own Price',
      subtitle: 'You stay in complete control of your margins',
      description: 'Tell buyers when your crops will be ready. You determine the minimum selling price based on your actual cultivation costs and desired profit margin—no forced distress selling.',
      icon: DollarSign,
      badge: 'Step 2: Price Autonomy',
      highlights: [
        'Zero commission cuts or middleman cuts',
        'Pre-orders secure demand before harvest begins',
        'Live market price radar to keep you competitive'
      ],
      tag: 'Full Price Control'
    },
    {
      step: '03',
      title: 'Receive Orders & Get Paid Direct to Your Bank',
      subtitle: 'Guaranteed payment security & hassle-free pickup',
      description: 'Accept buyer requests on your mobile dashboard. We coordinate verified farmgate pickups, and payment is automatically settled directly into your bank account without delays.',
      icon: ShieldCheck,
      badge: 'Step 3: Direct Settlement',
      highlights: [
        'Prompt payment directly into your bank / UPI',
        'Scheduled farmgate logistics collection',
        'Repeat customer relationships with high-margin buyers'
      ],
      tag: 'Instant Payouts'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Farmer Share of Consumer Rupee',
      traditional: 'Only 25% – 35% (Eaten up by brokers & mandi commissions)',
      agriconnect: '85% – 95% returned directly to the grower',
      winner: 'agri'
    },
    {
      feature: 'Harvest-to-Consumer Transit Time',
      traditional: '3 to 6 days (Rotting in multi-tiered wholesale yards)',
      agriconnect: '18 to 36 hours (Direct farm dispatch)',
      winner: 'agri'
    },
    {
      feature: 'Price Transparency',
      traditional: 'Opaque mandi auctions with undisclosed fees',
      agriconnect: '100% transparent live pricing set by farmer',
      winner: 'agri'
    },
    {
      feature: 'Traceability & Chemical Purity',
      traditional: 'Unknown origin, mixed lots, undisclosed chemical wax',
      agriconnect: 'Verified farm profile, harvest date & chemical logs',
      winner: 'agri'
    },
    {
      feature: 'Food Waste & Spoilage',
      traditional: 'Over 35% produce spoiled before reaching plate',
      agriconnect: 'Under 5% transit loss through demand-matched harvesting',
      winner: 'agri'
    }
  ];

  const faqs = [
    {
      q: 'How does AgriConnect ensure produce is truly fresh?',
      a: 'Unlike traditional wholesale markets where produce changes hands multiple times across 4 to 6 days, AgriConnect works on a just-in-time harvest model. Farmers list expected harvest dates, and orders are dispatched directly from the farmgate within hours of picking.'
    },
    {
      q: 'Does AgriConnect charge commissions to farmers?',
      a: 'No. AgriConnect is dedicated to farmer prosperity. Listing crops is 100% free with zero percentage cut on farmer sales. Our platform operates on nominal platform service fees paid by institutional buyers.'
    },
    {
      q: 'Can both individual households and commercial buyers order?',
      a: 'Yes! We support retail quantities (starting from small family baskets) up to multi-quintal institutional bulk procurement for restaurants, supermarkets, and catering companies.'
    },
    {
      q: 'What happens if the delivered produce does not meet quality expectations?',
      a: 'Every order on AgriConnect is backed by our Freshness Guarantee. Buyers can inspect deliveries upon arrival, and our escrow release system ensures immediate refunds or replacements if items fail agreed grading criteria.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* 1. Standardized Hero Banner */}
      <section className="relative overflow-hidden pt-32 sm:pt-36 pb-16 sm:pb-20 bg-gradient-to-b from-forest-950 via-[#0B2316] to-forest-950 text-white border-b border-forest-900/60">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Subtle Topic Kicker */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-forest-800 text-fresh text-xs font-bold tracking-wide uppercase mb-5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Farm-to-Table Model</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight mb-5">
              How <span className="text-fresh">AgriConnect</span> Works
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              We replace opaque middleman networks with a verified direct trade bridge. 
              Farmers secure honest prices while buyers receive farmgate produce at peak freshness.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                to="/marketplace"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm shadow-md hover:shadow-fresh/20 transition-all active:scale-95"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/for-farmers"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-95"
              >
                <span>For Farmers & Sellers</span>
              </Link>
            </div>

            {/* Standardized Metric / Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-forest-800/80 text-center">
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">85% – 95%</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Farmer Revenue Share</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">&lt; 36 Hours</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Farmgate to Doorstep</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">0% Fee</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Zero Hidden Charges</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">100% Escrow</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Safe Payment Guarantee</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Dual Audience Interactive Journey */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Journey Switcher Pills */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex p-1.5 rounded-2xl bg-forest-100/80 border border-forest-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab('buyers')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'buyers'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'text-forest-900 hover:text-forest-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>How It Works For Buyers</span>
            </button>

            <button
              onClick={() => setActiveTab('farmers')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'farmers'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'text-forest-900 hover:text-forest-700'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>How It Works For Farmers</span>
            </button>
          </div>
        </div>

        {/* Tab Description Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950">
            {activeTab === 'buyers' 
              ? 'Effortless Direct-From-Farm Sourcing for Buyers'
              : 'Empowering Farmers with Full Selling Independence'
            }
          </h2>
          <p className="text-agriText-muted text-sm sm:text-base mt-2">
            {activeTab === 'buyers'
              ? 'Discover how households, restaurants, and grocers receive freshly harvested produce in 3 simple steps.'
              : 'Join thousands of rural growers taking back control of their livelihood with zero commissions.'
            }
          </p>
        </div>

        {/* Dynamic 3 Steps Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {(activeTab === 'buyers' ? buyerSteps : farmerSteps).map((s, index) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative bg-white rounded-3xl p-7 sm:p-8 border border-forest-100 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Step Pill & Number */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-display font-black text-4xl text-forest-200 group-hover:text-forest-400 transition-colors">
                        {s.step}
                      </span>
                      <span className="text-xs font-bold text-forest-700">
                        {s.tag}
                      </span>
                    </div>

                    {/* Icon container */}
                    <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 mb-6 group-hover:scale-105 group-hover:bg-forest-900 group-hover:text-fresh transition-all shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="font-display font-bold text-xl text-forest-950 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs font-semibold text-forest-700 uppercase tracking-wider mb-3">
                      {s.subtitle}
                    </p>
                    <p className="text-agriText-muted text-sm leading-relaxed mb-6">
                      {s.description}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="pt-4 border-t border-forest-50 space-y-2.5">
                    {s.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs font-semibold text-forest-900">
                        <CheckCircle2 className="w-4 h-4 text-fresh shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Tab CTA Link */}
        <div className="mt-12 text-center">
          {activeTab === 'buyers' ? (
            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-2 text-sm font-bold text-forest-800 hover:text-forest-950 transition-colors"
            >
              <span>Ready to inspect today’s harvested catalog?</span>
              <span className="text-fresh inline-flex items-center">
                Explore Marketplace <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          ) : (
            <Link
              to="/for-farmers"
              className="inline-flex items-center space-x-2 text-sm font-bold text-forest-800 hover:text-forest-950 transition-colors"
            >
              <span>Want to calculate your estimated extra income?</span>
              <span className="text-fresh inline-flex items-center">
                Open Farmer Profit Calculator <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          )}
        </div>

      </section>

      {/* 3. The AgriConnect Advantage: Comparison Table */}
      <section className="py-20 bg-white border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
              Traditional Mandi vs. AgriConnect Direct
            </h2>
            <p className="text-agriText-muted text-base mt-2">
              See why direct farm-to-table digital logistics is transforming Indian agriculture.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-forest-200/80 shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-forest-950 text-white">
                  <th className="py-5 px-6 font-display font-bold text-sm uppercase tracking-wider">
                    Key Dimension
                  </th>
                  <th className="py-5 px-6 font-display font-bold text-sm uppercase tracking-wider text-red-300">
                    Traditional Wholesale Mandi
                  </th>
                  <th className="py-5 px-6 font-display font-bold text-sm uppercase tracking-wider text-fresh">
                    AgriConnect Direct Network
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-100 text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-cream/40'}>
                    <td className="py-4 px-6 font-bold text-forest-950">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-agriText-muted font-medium">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-50 text-red-700 font-bold mr-2">
                        Old Way
                      </span>
                      {row.traditional}
                    </td>
                    <td className="py-4 px-6 text-forest-900 font-bold">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-forest-100 text-forest-800 font-extrabold mr-2">
                        AgriConnect
                      </span>
                      {row.agriconnect}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 4. Quality & Purity Assurance Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
            Our 4 Pillars of Freshness & Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-fresh" />
            </div>
            <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
              Verified Farmer KYC
            </h4>
            <p className="text-agriText-muted text-xs leading-relaxed">
              Every grower is verified through government land records, Kisan credit records, or field verification checks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-forest-700" />
            </div>
            <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
              Live Harvest Clock
            </h4>
            <p className="text-agriText-muted text-xs leading-relaxed">
              Transparent timestamps inform you exactly when crops were picked from the branch or pulled from the soil.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-fresh" />
            </div>
            <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
              Zero Chemical Ripening
            </h4>
            <p className="text-agriText-muted text-xs leading-relaxed">
              Strict prohibition of calcium carbide or artificial chemicals. Natural vine and tree ripening only.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-accent-yellow" />
            </div>
            <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
              Escrow Protection
            </h4>
            <p className="text-agriText-muted text-xs leading-relaxed">
              Payments are held securely in neutral escrow and released upon buyer receipt and satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Accordion */}
      <section className="py-20 bg-forest-50/50 border-t border-forest-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl text-forest-950">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-forest-100 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left py-4 px-6 flex items-center justify-between font-bold text-forest-950 hover:text-forest-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xl font-display text-forest-600 ml-4">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-agriText-muted leading-relaxed border-t border-forest-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need more help */}
          <div className="mt-8 text-center text-sm text-agriText-muted">
            Have a specific scenario or need custom freight logistics?{' '}
            <Link to="/contact" className="font-bold text-forest-800 hover:underline">
              Contact our Agricultural Support Team →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-900 to-forest-950 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
              Experience the Future of Agricultural Commerce
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-8">
              Whether you are listing this season’s harvest or stocking your business kitchen, AgriConnect delivers unmatched value.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                Start Sourcing Fresh Produce
              </Link>
              <Link
                to="/for-farmers"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
              >
                Join as a Farmer Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
