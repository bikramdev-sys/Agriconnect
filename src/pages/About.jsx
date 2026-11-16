import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Leaf, 
  Globe2, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Award, 
  BookOpen, 
  MapPin, 
  Compass,
  Sparkles,
  Code2
} from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: HeartHandshake,
      title: 'Farmer Autonomy & Dignity',
      desc: 'Agricultural producers are the backbone of human society. They deserve transparent price realization, prompt payment cycles, and direct relationships with the buyers who consume their produce.'
    },
    {
      icon: ShieldCheck,
      title: '100% Origin Traceability',
      desc: 'Consumers and restaurant chefs should know exactly which soil, seed batch, and farmer produced their food. Every crate on AgriConnect is mapped to verified field origin and harvest timestamp.'
    },
    {
      icon: Leaf,
      title: 'Regenerative Agriculture',
      desc: 'We promote chemical-free, regenerative cultivation that replenishes topsoil, reduces toxic pesticide run-off into local waterways, and fosters biodiversity across farming ecosystems.'
    },
    {
      icon: Globe2,
      title: 'Radical Food Waste Reduction',
      desc: 'By eliminating multi-stop wholesale mandi storage and utilizing demand-matched harvest logistics, we cut post-harvest spoilage from the industry average of 35% down to under 5%.'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Conception & Maharashtra Pilot',
      desc: 'AgriConnect was founded in Pune by agricultural engineers and tech researchers. The initial pilot bridged 150 organic vegetable growers with 40 Pune restaurants.'
    },
    {
      year: '2024',
      title: 'Direct Logistics & Escrow Protocol',
      desc: 'Introduced direct farmgate pickup logistics and zero-deduction escrow payments, expanding into Nashik, Punjab, and Karnataka grain corridors.'
    },
    {
      year: '2025',
      title: '10,000+ Grower Milestone',
      desc: 'Crossed 10,000 verified growers and ₹2 Crore in direct farmer settlements with zero commission deductions.'
    },
    {
      year: '2026',
      title: 'Nationwide Direct Farm Grid',
      desc: 'Operating collection hubs across 14 agricultural regions, powering seamless farm-to-doorstep trade for households, grocers, and commercial enterprises.'
    }
  ];

  const founder = {
    name: 'Bikram Dev',
    role: 'Founder & Lead Developer',
    title: 'Full-Stack Software Engineer & Agritech Architect',
    bio: 'Full-stack software engineer and visionary founder behind AgriConnect. Built the platform from the ground up to eliminate predatory middlemen, guarantee transparent mandi pricing for Indian farmers, and deliver fresh, chemical-free harvests directly to consumers across the nation.',
    mission: "Driven by a deep personal commitment to rural prosperity, Bikram engineered AgriConnect's direct farm-to-doorstep ecosystem, real-time dual settlement engine, and fair price radar to ensure that India's hardworking growers retain 100% of their rightful harvest value.",
    avatar: '/avatars/bikram-dev.jpg',
    location: 'National Agricultural Directorate • India',
    badges: [
      'Full-Stack Agritech System Architecture',
      '0% Middleman Fair Trade Protocol',
      'Direct Farm-to-Doorstep Logistics Grid',
      'Real-Time Mandi Settlement & Traceability'
    ]
  };

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
              <Leaf className="w-3.5 h-3.5" />
              <span>Our Mission & Values</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight mb-5">
              Cultivating Trust Between <span className="text-fresh">Soil and Soul.</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              AgriConnect is rebuilding India's agricultural supply chain so that the growers who feed our communities earn honest margins and buyers receive pure, fresh produce.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                to="/marketplace"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-fresh hover:bg-fresh-light text-forest-950 font-extrabold text-sm shadow-md hover:shadow-fresh/20 transition-all active:scale-95"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-95"
              >
                <span>Get in Touch</span>
              </Link>
            </div>

            {/* Standardized Metric / Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-forest-800/80 text-center">
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">₹2.4 Cr+</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Paid Directly to Farmers</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">12,400+</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Registered Growers</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-fresh">18,500+</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Active Urban Buyers</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl sm:text-3xl text-white">&lt; 5%</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">Post-Harvest Waste Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Story & The Problem */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 leading-tight">
              Why We Built a New Agricultural Trade Model
            </h2>
            <p className="text-agriText-muted text-base leading-relaxed">
              In the traditional agricultural pipeline, a tomato travels through local village aggregators, APMC auction brokers, wholesale cold-storage intermediaries, secondary distribution agents, and neighbourhood retailers before reaching the kitchen.
            </p>
            <p className="text-agriText-muted text-base leading-relaxed">
              Along this sluggish 5-day journey, produce loses over 40% of its vitamins, 30% is thrown away as rot, and the farmer takes home barely 25 to 30 paise of every rupee paid by the household.
            </p>
            <p className="text-forest-950 font-bold text-base leading-relaxed">
              AgriConnect replaces this friction-heavy maze with a clean, transparent digital network. By enabling direct crop listings and scheduled farmgate dispatches, farmers retain their true profit margin, and buyers receive uncompromised freshness.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-forest-200 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"
                alt="Green agricultural fields at sunrise"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent flex items-end p-8">
                <blockquote className="text-white text-sm sm:text-base italic font-medium leading-relaxed">
                  "When the farmer thrives, the nation thrives. Technology should be in the hands of the soil’s caretakers."
                </blockquote>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. The 4 Fundamental Pillars */}
      <section className="py-20 bg-white border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
              Our 4 Pillars of Sustainable Agritech
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-cream/70 border border-forest-100 hover:bg-forest-50/70 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white border border-forest-200 text-forest-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-forest-900 group-hover:text-fresh transition-all shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-forest-950 mb-3">
                      {p.title}
                    </h3>
                    <p className="text-agriText-muted text-sm leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Company Journey Timeline */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950">
            Our Journey So Far
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft flex flex-col justify-between"
            >
              <div>
                <span className="font-display font-black text-3xl text-forest-800 block mb-3">
                  {m.year}
                </span>
                <h4 className="font-display font-bold text-lg text-forest-950 mb-2">
                  {m.title}
                </h4>
                <p className="text-agriText-muted text-xs sm:text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Founder Spotlight: Committed to Rural Prosperity */}
      <section className="py-20 bg-forest-50/60 border-t border-forest-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-100/90 border border-forest-200/90 text-forest-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-fresh" />
              <span>Vision & Technical Leadership</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-forest-950 tracking-tight">
              Founder Committed to Rural Prosperity
            </h2>
            <p className="text-xs sm:text-sm text-agriText-muted mt-3 max-w-lg mx-auto leading-relaxed">
              Engineering a transparent, middleman-free agricultural future that empowers India's local farmers and connects them directly with conscious buyers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-500/30 ring-1 ring-emerald-500/15 shadow-premium relative overflow-hidden">
            {/* Ambient Corner Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-fresh/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-forest-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
              {/* Founder Portrait & Identity */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative mb-3 group">
                  <img
                    src={founder.avatar}
                    alt={founder.name}
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover border-4 border-white shadow-xl ring-4 ring-emerald-500/25 transition-transform duration-300 group-hover:scale-102"
                  />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-forest-950 text-fresh text-[10px] font-black uppercase tracking-wider border border-forest-800 shadow-md whitespace-nowrap">
                    Founder
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-agriText-muted mt-4">
                  <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span>{founder.location}</span>
                </div>
              </div>

              {/* Founder Story & Architecture Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Code2 className="w-3.5 h-3.5 text-fresh" />
                  <span>Platform Creator & Lead Architect</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-forest-950">
                  {founder.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-forest-700 mb-4">
                  {founder.role} • {founder.title}
                </p>

                <p className="text-xs sm:text-sm text-forest-900 leading-relaxed font-medium mb-3">
                  {founder.bio}
                </p>
                <p className="text-xs sm:text-sm text-agriText-muted leading-relaxed mb-6">
                  {founder.mission}
                </p>

                {/* Key Architectural Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {founder.badges.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2.5 p-3 rounded-2xl bg-forest-50/70 border border-forest-100 text-xs font-bold text-forest-900"
                    >
                      <CheckCircle2 className="w-4 h-4 text-fresh shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold shadow-sm inline-flex items-center space-x-2 transition-all active:scale-95"
                  >
                    <span>Contact Platform Creator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/marketplace"
                    className="px-5 py-2.5 rounded-xl border border-forest-200 hover:bg-forest-50 text-forest-900 text-xs font-bold transition-all"
                  >
                    <span>Explore Direct Marketplace</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Be Part of the Equitable Agritech Revolution
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Whether you are a progressive farmer, a conscious home chef, or a restaurant owner seeking traceable produce, there is a place for you at AgriConnect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-fresh hover:bg-fresh-light text-forest-950 font-black text-sm shadow-md transition-all active:scale-95"
            >
              Explore Fresh Harvests
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
            >
              Contact Our Operations Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
