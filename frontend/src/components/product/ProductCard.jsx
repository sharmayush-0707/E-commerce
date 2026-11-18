import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, showAiBadge = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
      {/* Top badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercentage > 0 && (
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-rose-500 text-white shadow-sm">
            {product.discountPercentage}% OFF
          </span>
        )}
        {showAiBadge && product.aiScore && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-900/90 text-indigo-200 backdrop-blur-md shadow-md border border-indigo-400/30">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {product.aiScore}% Match
          </span>
        )}
      </div>

      {/* Image container */}
      <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
            <span>{product.brand}</span>
            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-semibold">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* AI Recommendation Reason if provided */}
          {showAiBadge && product.aiReason && (
            <p className="mt-1 text-[11px] text-indigo-600 font-medium line-clamp-1">
              ✨ {product.aiReason}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.numReviews})</span>

            {product.stock <= 5 && product.stock > 0 && (
              <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-600 text-white shadow-md'
                : product.stock === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95'
            }`}
            title="Add to cart"
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
