import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search by produce name, category, or farm location...",
  onToggleFilters,
  hasActiveFilters = false
}) {
  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-forest-600 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-forest-100 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 text-sm text-forest-950 placeholder:text-agriText-muted/70 font-medium transition-all shadow-xs outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-agriText-muted hover:text-forest-900 rounded-full hover:bg-forest-50"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {onToggleFilters && (
        <button
          onClick={onToggleFilters}
          className={`relative p-3 rounded-2xl border transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-xs ${
            hasActiveFilters
              ? 'bg-forest-900 text-white border-forest-900'
              : 'bg-white text-forest-900 border-forest-100 hover:bg-forest-50'
          }`}
          title="Toggle filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-fresh rounded-full border-2 border-white" />
          )}
        </button>
      )}
    </div>
  );
}
