import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  CheckCircle, 
  CheckCircle2, 
  DollarSign, 
  Store, 
  BadgePercent, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  Users, 
  Layers, 
  Calculator,
  Award,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const cropOptions = [
  { name: 'Organic Vine Tomatoes', mandiPrice: 22, agriPrice: 38, unit: 'kg' },
  { name: 'Alphonso Mangoes', mandiPrice: 110, agriPrice: 185, unit: 'kg' },
  { name: 'Basmati Paddy / Grain', mandiPrice: 34, agriPrice: 52, unit: 'kg' },
  { name: 'Crisp Shimla Apples', mandiPrice: 75, agriPrice: 130, unit: 'kg' },
  { name: 'Nashik Red Onions', mandiPrice: 16, agriPrice: 27, unit: 'kg' },
  { name: 'Organic Baby Spinach', mandiPrice: 20, agriPrice: 42, unit: 'kg' },
  { name: 'Pure Gir Cow A2 Milk', mandiPrice: 45, agriPrice: 78, unit: 'L' }
];

export default function ForFarmers() {
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0]);
  const [quantity, setQuantity] = useState(2500); // 2500 kg default
  const [openFaq, setOpenFaq] = useState(null);

  // Smart contextual routing & button copy based on user authentication state
  const farmerActionLink = isAuthenticated
    ? (isFarmer ? '/dashboard/farmer' : isAdmin ? '/dashboard/admin' : '/marketplace')
    : '/register?role=farmer';

  const calculatorButtonText = isAuthenticated
    ? (isFarmer ? 'Open Farmer Dashboard & List Crops' : isAdmin ? 'Open Admin Console' : 'Browse Marketplace Produce')
    : 'Start Selling at Direct Rates';

  const heroButtonText = isAuthenticated
    ? (isFarmer ? 'Open Farmer Dashboard' : isAdmin ? 'Open Admin Console' : 'Explore Marketplace')
    : 'Register Free as a Farmer';

  const bottomCtaButtonText = isAuthenticated
    ? (isFarmer ? 'Go to Farmer Dashboard' : isAdmin ? 'Go to Admin Console' : 'Explore Marketplace')
    : 'Register as a Farmer Now';

  // Calculations
  const mandiEarnings = Math.round(quantity * selectedCrop.mandiPrice * 0.72); // after 28% deductions/brokers
  const agriEarnings = Math.round(quantity * selectedCrop.agriPrice); // direct
  const extraProfit = agriEarnings - mandiEarnings;
  const percentageBoost = Math.round((extraProfit / mandiEarnings) * 100);

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const steps = [
    {
      step: '01',
      title: 'Free 2-Minute Sign Up',
      desc: 'Register using your mobile number or Kisan ID. Fill in basic farm location and crops grown without paperwork hassles.',
      icon: Users
    },
    {
      step: '02',
      title: 'List Crops & Set Minimum Price',
      desc: 'Enter your anticipated harvest date, quantities available, and the minimum price you want. You are never forced to sell below your cost.',
      icon: DollarSign
    },
    {
      step: '03',
      title: 'Match With Verified Buyers',
      desc: 'Receive immediate purchase requests from verified restaurants, grocery chains, or local buyers with deposits reserved in escrow.',
      icon: Store
    },
    {
      step: '04',
      title: 'Doorstep Pickup & Instant Payment',
      desc: 'Our logistics partners pick up produce right from your farm gate. Once confirmed, payment is wired immediately to your bank or UPI.',
      icon: Truck
    }
  ];

  const tools = [
    {
      title: 'Zero Broker Commission',
      desc: 'Keep 100% of your selling price. We do not deduct hidden mandi agent cuts, unloading tariffs, or unauthorized cash discounts.',
      icon: BadgePercent,
      color: 'bg-fresh/15 text-forest-800'
    },
    {
      title: 'Guaranteed Escrow Security',
      desc: 'Never chase payments again. Buyers deposit the order value before you harvest, eliminating defaults and delayed credit cycles.',
      icon: ShieldCheck,
      color: 'bg-accent-yellow/20 text-forest-900'
    },
    {
      title: 'Doorstep Farmgate Pickup',
      desc: 'Save transport headaches and expensive tractor rentals. Our partner fleet picks up straight from your field gate.',
      icon: Truck,
      color: 'bg-forest-100 text-forest-900'
    },
    {
      title: 'Live Market Price Radar',
      desc: 'Access real-time commodity indices across major urban centers to price your harvests competitively and maximize returns.',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-900'
    },
    {
      title: '24/7 Regional Kisan Support',
      desc: 'Speak directly with our dedicated agrarian advisors in Hindi, Marathi, Punjabi, Kannada, Tamil, or Telugu whenever you need help.',
      icon: PhoneCall,
      color: 'bg-emerald-100 text-emerald-900'
    },
    {
      title: 'Soil & Organic Certification Support',
      desc: 'Get assistance with organic farm documentation and soil health testing to command premium price points in urban markets.',
      icon: Award,
      color: 'bg-amber-100 text-amber-900'
    }
  ];

  const farmerStories = [
    {
      name: 'Ramesh Patel',
      farm: 'Patel Organic Farms',
      location: 'Nashik, Maharashtra',
      crops: 'Grapes & Pomegranates',
      quote: 'Before AgriConnect, we had to dump excess produce at the APMC yard for whatever price brokers dictated. Now I set my rate 3 weeks before harvest, and Mumbai gourmet stores buy every crate.',
      extraIncome: '+₹2,85,000 / season',
      avatar: '/avatars/ramesh-patel.jpg'
    },
    {
      name: 'Gurpreet Singh',
      farm: 'Golden Fields Estate',
      location: 'Ludhiana, Punjab',
      crops: 'Certified Organic Wheat & Basmati',
      quote: 'Direct connection with retail grocers in Delhi eliminated 4 middlemen tiers. Payment reflects in my bank account on the exact day of pickup. No tension, only growth.',
      extraIncome: '+₹3,40,000 / crop cycle',
      avatar: '/avatars/gurpreet-singh.jpg'
    },
    {
      name: 'Lakshmi Devi',
      farm: 'Annapurna Valley Farms',
      location: 'Shimla, Himachal Pradesh',
      crops: 'Cold-Climate Carrots & Apples',
      quote: 'The price radar tool gave me the confidence to reject undervalued broker bids. We now supply 15 restaurant groups in Bengaluru with predictable weekly contracts.',
      extraIncome: '+₹1,95,000 / month',
      avatar: '/avatars/lakshmi-devi.jpg'
    }
  ];

  const farmerFaqs = [
    {
      q: 'Do I have to pay anything to register or list crops on AgriConnect?',
      a: 'No. Registering as a farmer and listing all your harvests is 100% free forever. We do not charge listing fees, membership fees, or deduction percentages from your earnings.'
    },
    {
      q: 'How does pickup from my farm work?',
      a: 'Once an order is confirmed, our logistics team coordinates an exact pickup window that matches your harvest schedule. Our verified vehicle arrives at your farm gate or aggregation point.'
    },
    {
      q: 'When do I receive payment for my sold produce?',
      a: 'The buyer deposits funds into our escrow system before dispatch. Upon standard quality inspection at pickup, funds are transferred directly into your bank account or registered UPI ID within 24 hours.'
    },
    {
      q: 'Can smallholder farmers with small plots participate?',
      a: 'Absolutely! Whether you are harvesting 100 kg of organic chillies or 25 tons of wheat, AgriConnect accommodates individual farmers and farmer producer organizations (FPOs) of all sizes.'
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
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Farmer Empowerment Portal</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight mb-5">
              Your Hard Work. <span className="text-fresh">Your True Profits.</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Eliminate broker commissions and auction uncertainty. Connect directly with verified commercial buyers, grocers, and consumers at guaranteed fair pricing.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                to={farmerActionLink}
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm shadow-md hover:shadow-fresh/20 transition-all active:scale-95 group"
              >
                <span>{heroButtonText}</span>
                <ArrowRight className="w-4 h-4 text-forest-950 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#profit-calculator"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-95"
              >
                <Calculator className="w-4 h-4 text-fresh" />
                <span>Calculate Profit Boost</span>
              </a>
            </div>

            {/* Standardized Metric / Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-forest-800/80 text-center">
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">12,000+</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Verified Enrolled Farmers</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">0% Cut</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Broker Commissions</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">24 Hours</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Direct Bank Settlement</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">+38%</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Avg. Farmer Profit Increase</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Interactive Farmer Profit Calculator */}
      <section id="profit-calculator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
            Calculate Your Extra Crop Income
          </h2>
          <p className="text-agriText-muted text-base mt-2">
            Select your crop and estimated quantity to see the difference between traditional commission mandis and AgriConnect direct sales.
          </p>
        </div>

        {/* Calculator Widget Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-forest-100 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Inputs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-forest-900 mb-2">
                  Select Your Crop:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {cropOptions.map((crop) => (
                    <button
                      key={crop.name}
                      onClick={() => setSelectedCrop(crop)}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                        selectedCrop.name === crop.name
                          ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                          : 'bg-forest-50/70 text-forest-950 border-forest-200/80 hover:bg-forest-100'
                      }`}
                    >
                      <p className="truncate">{crop.name}</p>
                      <span className="text-[10px] opacity-80 block mt-0.5">
                        AgriConnect: ₹{crop.agriPrice}/{crop.unit}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-forest-900">
                    Estimated Harvest Quantity:
                  </label>
                  <span className="text-base font-black text-forest-950 bg-forest-100 px-3 py-1 rounded-xl border border-forest-200">
                    {quantity.toLocaleString()} {selectedCrop.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-forest-700 h-2.5 bg-forest-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-agriText-muted mt-1.5 font-semibold">
                  <span>500 {selectedCrop.unit} (Small Plot)</span>
                  <span>7,500 {selectedCrop.unit}</span>
                  <span>15,000 {selectedCrop.unit} (Multi-Acre)</span>
                </div>
              </div>

              {/* Rate Comparison Pill */}
              <div className="p-4 rounded-2xl bg-cream border border-forest-100 flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-gray-500 block">Avg. Mandi Realization:</span>
                  <span className="text-red-700 font-extrabold text-sm">₹{selectedCrop.mandiPrice} / {selectedCrop.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">AgriConnect Direct Rate:</span>
                  <span className="text-forest-900 font-extrabold text-sm">₹{selectedCrop.agriPrice} / {selectedCrop.unit}</span>
                </div>
              </div>
            </div>

            {/* Right Output Display */}
            <div className="lg:col-span-6 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-fresh mb-4">
                Settlement Projection
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-forest-800/80">
                  <span className="text-xs text-gray-300">Traditional Mandi Net Return:</span>
                  <span className="text-sm font-bold text-gray-400">
                    ₹{mandiEarnings.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-forest-800/80">
                  <span className="text-xs text-gray-300">AgriConnect Direct Payout:</span>
                  <span className="text-sm font-bold text-fresh">
                    ₹{agriEarnings.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Massive Profit Callout */}
              <div className="p-5 rounded-2xl bg-forest-900/90 border border-forest-700/80 text-center mb-6">
                <p className="text-xs uppercase font-extrabold tracking-wider text-gray-300 mb-1">
                  Estimated Extra Profit Kept by You:
                </p>
                <div className="font-display font-black text-3xl sm:text-4xl text-fresh tracking-tight">
                  + ₹{extraProfit.toLocaleString()}
                </div>
                <span className="inline-block mt-1 text-xs font-bold text-accent-yellow">
                  ▲ {percentageBoost}% Higher Income from the Same Land!
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={farmerActionLink}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-fresh/20 transition-all active:scale-95 group"
                >
                  <span>{calculatorButtonText}</span>
                  <ArrowRight className="w-4 h-4 text-forest-950 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={handleCelebrate}
                  className="py-3.5 px-5 rounded-xl bg-forest-800/90 hover:bg-forest-700 text-white font-bold text-sm flex items-center justify-center space-x-1.5 border border-forest-700/80 transition-all active:scale-95 shadow-xs"
                  title="Celebrate savings"
                >
                  <span>🎉</span>
                  <span>Celebrate</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Four Simple Steps to Start Selling */}
      <section className="py-20 bg-white border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
              How to Start Selling on AgriConnect
            </h2>
            <p className="text-agriText-muted text-base mt-2">
              From registration to receiving your first bank transfer in four clear stages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-cream/60 border border-forest-100/80 hover:bg-forest-50/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-display font-black text-3xl text-forest-200 group-hover:text-forest-400 transition-colors">
                        {st.step}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-forest-200/60 text-forest-800 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-fresh transition-all shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
                      {st.title}
                    </h4>
                    <p className="text-agriText-muted text-xs sm:text-sm leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Complete Seller Toolset Built for Farmers */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
            Dedicated Tools Designed for Modern Growers
          </h2>
          <p className="text-agriText-muted text-base mt-2">
            Everything you need to run your farm sales with the efficiency of a Fortune 500 company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border border-forest-100 shadow-soft hover:shadow-premium transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${t.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
                  {t.title}
                </h4>
                <p className="text-agriText-muted text-sm leading-relaxed">
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Real Farmer Case Studies */}
      <section className="py-20 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Real Farmers. Real Financial Freedom.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {farmerStories.map((story, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-forest-950/90 border border-forest-800/90 flex flex-col justify-between shadow-xl hover:border-forest-700 transition-all"
              >
                <div>
                  <div className="flex items-center space-x-4 mb-5">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-16 h-16 shrink-0 rounded-2xl object-cover border-2 border-forest-700 shadow-md ring-1 ring-forest-500/20"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-display font-bold text-base text-white truncate">{story.name}</h4>
                        <CheckCircle2 className="w-4 h-4 text-fresh shrink-0" title="Verified Producer" />
                      </div>
                      <p className="text-xs text-fresh font-medium truncate mt-0.5">{story.farm}</p>
                      <p className="text-[11px] text-gray-400 truncate">{story.location}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm italic leading-relaxed mb-6">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-forest-800/80 flex items-center justify-between text-xs">
                  <span className="text-gray-400 truncate max-w-[55%]">Crop: {story.crops}</span>
                  <span className="font-extrabold text-accent-yellow shrink-0">{story.extraIncome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Farmer FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-3xl text-forest-950">
            Farmer Questions Answered
          </h2>
        </div>

        <div className="space-y-4">
          {farmerFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-forest-100 overflow-hidden shadow-xs"
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

        {/* Dedicated Support Hotline Strip */}
        <div className="mt-12 p-6 rounded-3xl bg-forest-100/80 border border-forest-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-display font-bold text-forest-950 text-base">
              Prefer speaking with a Kisan Advisor on the phone?
            </h4>
            <p className="text-xs text-agriText-muted mt-0.5">
              Toll-free agricultural support available 6:00 AM – 9:00 PM daily in 6 languages.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition-all shrink-0"
          >
            Call Support Desk
          </Link>
        </div>
      </section>

      {/* 7. Final Join CTA */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
            Ready to Take Control of Your Farming Income?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join 12,000+ farmers across India who have switched to direct buyer commerce with zero commission fees.
          </p>
          <Link
            to={farmerActionLink}
            className="inline-flex items-center space-x-2 px-9 py-4 rounded-2xl bg-fresh hover:bg-fresh-light text-forest-950 font-black text-base shadow-lg transition-all active:scale-95"
          >
            <span>{bottomCtaButtonText}</span>
            <ArrowRight className="w-5 h-5 text-forest-950" />
          </Link>
        </div>
      </section>
    </div>
  );
}
