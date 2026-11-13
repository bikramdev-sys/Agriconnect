import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { Sprout } from 'lucide-react';

export default function ProductGrid({ products = [], emptyMessage = "No fresh produce found matching your criteria." }) {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center bg-white rounded-3xl border border-forest-100/80 shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-lg text-forest-950 mb-1">
          No Produce Found
        </h3>
        <p className="text-sm text-agriText-muted max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      <AnimatePresence>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </div>
  );
}
