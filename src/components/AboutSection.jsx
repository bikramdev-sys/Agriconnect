import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Leaf, Globe2, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function AboutSection() {
  const values = [
    {
      icon: HeartHandshake,
      title: 'Farmer Autonomy',
      desc: 'Growers deserve transparent margins and the dignity of directly setting the worth of their harvests.'
    },
    {
      icon: ShieldCheck,
      title: 'Purity & Traceability',
      desc: 'Every apple, batch of basmati, or bottle of A2 milk is directly linked to the actual grower and field.'
    },
    {
      icon: Leaf,
      title: 'Regenerative Agriculture',
      desc: 'We champion soil health, organic certifications, and zero-pesticide farming with preferential visibility.'
    },
    {
      icon: Globe2,
      title: 'Zero Waste Supply',
      desc: 'Pre-ordered and direct-dispatched produce bypasses warehousing rot, cutting agricultural transit waste.'
    }
  ];

  return (
    <section id="about-us" className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-forest-950 tracking-tight mb-4">
            Building a <span className="text-gradient-fresh">Fairer Food System.</span>
          </h2>
          <p className="text-agriText-muted text-base sm:text-lg leading-relaxed">
            The traditional agriculture supply chain loses up to 40% in food waste and absorbs over 50% of the farmer’s genuine profit. 
            AgriConnect bridges fields and tables using intuitive digital tools.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-cream/70 border border-forest-100/80 hover:bg-forest-50/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-forest-200/60 text-forest-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-forest-900 group-hover:text-fresh transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
                  {v.title}
                </h4>
                <p className="text-agriText-muted text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Farmer-to-Buyer Impact Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-glow opacity-30 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                Over ₹2.4 Crores Returned Directly to Farmers
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                By removing redundant intermediaries, AgriConnect enables Indian farmers to earn up to 40% more while buyers access harvested crops 24 to 48 hours fresher than typical distribution channels.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <div className="glass-card-dark p-4 rounded-2xl border border-forest-700/80 text-center">
                <span className="font-display font-black text-3xl text-fresh">38%</span>
                <p className="text-xs text-gray-300 mt-0.5">Average Farmer Profit Boost</p>
              </div>
              <div className="glass-card-dark p-4 rounded-2xl border border-forest-700/80 text-center">
                <span className="font-display font-black text-3xl text-accent-yellow">48 hrs</span>
                <p className="text-xs text-gray-300 mt-0.5">Faster Produce Dispatch</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
