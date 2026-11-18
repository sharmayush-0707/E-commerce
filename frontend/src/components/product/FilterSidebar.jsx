import React from 'react';
import { Filter, RotateCcw, Star, Search, Check } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  searchKeyword,
  onSearchChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onReset
}) {
  return (
    <aside className="w-full lg:w-64 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 shrink-0 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Search Products
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g. Sony, Keyboard, Leather..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat || (!selectedCategory && cat === 'All');
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat === 'All' ? '' : cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-extrabold text-indigo-600">${priceRange}</span>
        </div>
        <input
          type="range"
          min="50"
          max="3000"
          step="25"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>$50</span>
          <span>$1500</span>
          <span>$3000+</span>
        </div>
      </div>

      {/* Brand selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => onSelectBrand(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {brands.map(b => (
            <option key={b} value={b === 'All' ? '' : b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Customer Rating
        </label>
        <div className="space-y-1.5">
          {[
            { label: '4★ & Above', value: 4 },
            { label: '4.5★ & Above', value: 4.5 },
            { label: 'All Ratings', value: 0 }
          ].map(r => (
            <button
              key={r.value}
              onClick={() => onRatingChange(r.value)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                minRating === r.value
                  ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {r.label}
              </span>
              {minRating === r.value && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span>In Stock items only</span>
        </label>
      </div>
    </aside>
  );
}
