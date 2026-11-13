import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Sparkles } from 'lucide-react';
import { testimonials } from '../data/testimonials';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 sm:py-24 bg-[#FAFAF5] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest-950 tracking-tight">
            Loved by Farmers, Retailers & Families
          </h2>
          <p className="text-agriText-muted text-sm sm:text-base mt-2">
            Illustrative feedback from our growing agricultural community.
          </p>
        </div>

        {/* Carousel Card Container */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-forest-100 shadow-premium">
          <div className="absolute top-6 right-8 text-forest-100 select-none pointer-events-none">
            <Quote className="w-20 h-20 -scale-x-100 opacity-60" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
            >
              {/* Rating stars & badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                  ))}
                  <span className="text-xs font-bold text-forest-900 ml-1.5">5.0</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fresh" />
                  {current.highlight}
                </span>
              </div>

              {/* Quote text */}
              <p className="font-display font-medium text-lg sm:text-xl lg:text-2xl text-forest-950 leading-relaxed mb-8">
                "{current.quote}"
              </p>

              {/* Author & Profile footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-forest-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-forest-200 shadow-xs"
                  />
                  <div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-forest-950">
                      {current.name}
                    </h4>
                    <p className="text-xs font-semibold text-forest-700">{current.role}</p>
                    <p className="text-xs text-agriText-muted">{current.farm}</p>
                  </div>
                </div>

                <div className="inline-flex self-start sm:self-center px-4 py-2 rounded-2xl bg-forest-50 border border-forest-200/80">
                  <span className="text-xs text-agriText-muted">Impact: </span>
                  <span className="text-xs font-extrabold text-forest-900 ml-1">{current.metrics}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-forest-50">
            {/* Dots */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'w-8 bg-forest-800' : 'w-2 bg-forest-200 hover:bg-forest-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl border border-forest-200 hover:bg-forest-50 active:scale-95 text-forest-800 transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-forest-900 text-white hover:bg-forest-800 active:scale-95 transition-all shadow-xs"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
