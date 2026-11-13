import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    title: 'Farmers List Their Produce',
    description:
      'Farmers create listings in seconds, specify harvest dates, set their own fair prices, and manage real-time inventory without intermediaries.',
    icon: ClipboardList,
    badgeColor: 'bg-fresh/15 text-forest-800 border-fresh/30',
    iconColor: 'text-forest-700',
    details: ['Direct price control', 'Zero listing fee', 'Real-time stock tracking']
  },
  {
    step: '02',
    title: 'Buyers Discover Fresh Produce',
    description:
      'Retailers, restaurants, and individuals browse verified farm listings, compare prices transparently, and discover local organic harvests.',
    icon: Search,
    badgeColor: 'bg-accent-yellow/20 text-forest-950 border-accent-yellow/40',
    iconColor: 'text-forest-800',
    details: ['Verified farm profiles', 'Transparent harvest dates', 'Filter by region & organic']
  },
  {
    step: '03',
    title: 'Connect & Direct Trade',
    description:
      'Submit purchase orders or contact farmers directly. Produce travels directly from farm gate to buyer with maximum freshness and minimum transit time.',
    icon: Truck,
    badgeColor: 'bg-forest-100 text-forest-900 border-forest-300',
    iconColor: 'text-forest-800',
    details: ['Direct farmer communication', 'Flexible batch ordering', 'Fast direct dispatch']
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-[#FAFAF5] relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-fresh/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
            How AgriConnect Works
          </h2>
          <p className="text-agriText-muted text-base sm:text-lg mt-3">
            Removing complex supply chains to restore trust, freshness, and fair earnings between agricultural producers and buyers.
          </p>
        </div>

        {/* Steps Grid with Connecting line */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Visual Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-28 left-[18%] right-[18%] h-0.5 border-t-2 border-dashed border-forest-200/80 -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 border border-forest-100/90 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Header with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-forest-200 group-hover:text-forest-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100/80 flex items-center justify-center group-hover:scale-105 group-hover:bg-forest-100 transition-all shadow-xs">
                      <Icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-bold text-xl text-forest-950 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-agriText-muted text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Feature checklist */}
                <div className="pt-4 border-t border-forest-50 space-y-2">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-forest-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-fresh shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Link below steps */}
        <div className="mt-12 text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 text-sm font-bold text-forest-800 hover:text-forest-600 transition-colors group"
          >
            <span>Ready to explore fresh harvests?</span>
            <span className="text-fresh group-hover:translate-x-1 transition-transform inline-flex items-center">
              Browse the Marketplace <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
