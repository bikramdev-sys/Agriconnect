import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, DollarSign, Store, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForFarmersSection() {
  const { isAuthenticated, isFarmer, isAdmin } = useAuth();

  const ctaLink = isAuthenticated
    ? (isFarmer ? '/dashboard/farmer' : isAdmin ? '/dashboard/admin' : '/marketplace')
    : '/register?role=farmer';

  const ctaText = isAuthenticated
    ? (isFarmer ? 'Open Farmer Dashboard' : isAdmin ? 'Open Admin Console' : 'Explore Produce')
    : 'Start Selling Today';

  const benefits = [
    {
      icon: Store,
      title: 'Sell Directly to Buyers',
      desc: 'Bypass commission agents and middlemen cartels. Connect directly with urban retailers, restaurant kitchens, and direct consumers.'
    },
    {
      icon: DollarSign,
      title: 'Set Transparent Prices',
      desc: 'Take full control over your pricing. Reflect your genuine farming labor, organic cultivation, and seed investment with zero forced cuts.'
    },
    {
      icon: BadgePercent,
      title: 'Manage Listings & Availability',
      desc: 'Update harvest schedules, crop quantities, and seasonal specialties effortlessly through our intuitive mobile-ready farmer dashboard.'
    }
  ];

  return (
    <section id="for-farmers" className="py-20 sm:py-24 bg-forest-950 text-white relative overflow-hidden">
      {/* Background Decorative Rings & Gradients */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Copy, Benefits, CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-5">
              Your Harvest Deserves a <span className="text-fresh">Bigger Market.</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Take control of your sales, reach more buyers, and showcase your produce to a wider audience.
              Enjoy transparent settlements and direct customer relationships.
            </p>

            {/* Three Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-forest-900/60 border border-forest-800 hover:border-forest-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-forest-800 text-fresh flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-display font-bold text-white text-base mb-1.5">
                      {b.title}
                    </h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to={ctaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-base shadow-lg hover:shadow-fresh/20 transition-all active:scale-95 group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-forest-950 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-fresh" />
                No setup fees or complex contracts
              </span>
            </div>
          </motion.div>

          {/* Right Column: Visual Showcase & Farmer Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-forest-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=800&q=80"
                alt="Farmer harvesting fresh crops"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

              {/* Floating Testimonial Snippet Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-forest-900/90 backdrop-blur-md border border-forest-700/80 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Active Farm Partner</span>
                  <span className="text-[11px] font-semibold text-accent-yellow">★★★★★ 4.95</span>
                </div>
                <p className="text-xs text-gray-200 italic mb-2">
                  "AgriConnect helped our organic farm supply over 2,400 kg of fresh tomatoes directly without giving up 35% margin to brokers."
                </p>
                <p className="text-xs font-bold text-white">
                  Ramesh Patel <span className="text-gray-400 font-normal">— Patel Farms, Nashik</span>
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
