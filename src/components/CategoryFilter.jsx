import React from 'react';
import { 
  Sparkles, 
  Carrot, 
  Apple, 
  Wheat, 
  Milk, 
  Leaf, 
  Layers 
} from 'lucide-react';

const iconMap = {
  all: Layers,
  Vegetables: Carrot,
  Fruits: Apple,
  Grains: Wheat,
  Pulses: Leaf,
  Dairy: Milk,
  organic: Sparkles
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 px-1 scrollbar-none scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const IconComponent = iconMap[cat.id] || Sparkles;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 shadow-xs ${
              isSelected
                ? 'bg-forest-900 text-white shadow-md'
                : 'bg-white hover:bg-forest-50/80 text-forest-950 border border-forest-100 hover:border-forest-200'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-fresh' : 'text-forest-700'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
