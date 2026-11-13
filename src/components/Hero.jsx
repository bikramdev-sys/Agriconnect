import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sprout, ShieldCheck, TrendingUp, Users, MapPin } from 'lucide-react';
import HeroScene3D from './HeroScene3D';

export default function Hero() {
  return (
    <section className="relative min-h-[auto] lg:min-h-screen lg:max-h-[1080px] overflow-hidden flex items-center bg-[#FAFAF5] pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-0">
      {/* Decorative Natural Gradient Blobs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-fresh/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-accent-yellow/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-forest-200/30 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Decorative leaf watermarks */}
      <div className="absolute top-20 right-1/3 text-forest-200/30 select-none pointer-events-none -z-10 hidden lg:block">
        <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
          <path d="M10,90 Q50,90 90,10 Q90,50 10,90 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 z-10 text-center lg:text-left lg:pt-8"
          >
            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-forest-950 tracking-tight leading-[1.12] mb-4 sm:mb-6">
              From Farm to Market.{' '}
              <span className="text-gradient-fresh block sm:inline">Freshness Without</span>{' '}
              <span className="text-forest-900 block sm:inline">the Middlemen.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-agriText-muted text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 font-normal">
              Empowering farmers to sell directly, helping buyers source fresh produce at fair prices. 
              One connected marketplace for a stronger agricultural community.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group"
              >
                <span>Explore Fresh Produce</span>
                <ArrowRight className="w-4 h-4 text-fresh group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/register?role=farmer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-forest-50/80 text-forest-900 font-bold text-base border-2 border-forest-800/20 shadow-xs transition-all active:scale-95"
              >
                <Sprout className="w-4 h-4 text-forest-700" />
                <span>Join as a Farmer</span>
              </Link>
            </div>

            {/* Trust Indicator Stats Row */}
            <div className="pt-6 border-t border-forest-200/50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-agriText-muted mb-3">
                Trusted by Growers & Retailers Across India (Demo Metrics)
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950">1,200+</p>
                  <p className="text-xs font-semibold text-agriText-muted">Verified Farmers</p>
                </div>
                <div className="text-center lg:text-left border-x border-forest-200/60 px-2 sm:px-4">
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950">350+</p>
                  <p className="text-xs font-semibold text-agriText-muted">Active Buyers</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-950">25+</p>
                  <p className="text-xs font-semibold text-agriText-muted">Crop Categories</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Interactive 3D Miniature Organic Farm Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 relative flex items-center justify-center w-full"
          >
            {/* The 3D Canvas */}
            <div className="w-full max-w-[620px] relative">
              <HeroScene3D />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
