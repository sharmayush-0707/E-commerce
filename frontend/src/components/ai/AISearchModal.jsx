import React, { useState } from 'react';
import { Sparkles, Search, X, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

const EXAMPLE_PROMPTS = [
  "Gift for a tech lover under $200",
  "Wireless noise-canceling headphones for long flights",
  "Ergonomic desk accessories for remote programming",
  "Premium barista coffee gear for morning espresso",
  "Comfortable sneakers with cushioning"
];

export default function AISearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearch = async (searchQuery) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const { data } = await aiAPI.searchAssistant(q);
      setResults(data);
    } catch (err) {
      console.error('AI search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (p) => {
    setQuery(p);
    handleSearch(p);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleProductClick = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-300 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  AI Shopping Assistant
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/40 text-indigo-200">
                    Smart Intent Engine
                  </span>
                </h3>
                <p className="text-xs text-indigo-200">
                  Describe what you need in plain English — budget, use case, or style.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search input inside header */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-4 relative"
          >
            <Search className="w-5 h-5 text-indigo-300 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I need headphones under $350 for focus and workouts..."
              className="w-full pl-12 pr-28 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-xl transition-all shadow disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Suggested prompts */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-slate-400 font-medium">Try:</span>
          {EXAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p)}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-600 font-medium">AI is evaluating semantic matches and budget constraints...</p>
            </div>
          )}

          {!loading && results && (
            <div>
              {/* Intent Summary */}
              <div className="mb-4 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-indigo-900">{results.summary}</p>
                  {results.extractedIntent?.maxPrice && (
                    <span className="inline-block mt-1 mr-2 px-2 py-0.5 rounded bg-white text-indigo-700 font-medium border border-indigo-200">
                      Budget: &le; ${results.extractedIntent.maxPrice}
                    </span>
                  )}
                  {results.extractedIntent?.detectedCategory && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white text-indigo-700 font-medium border border-indigo-200">
                      Category: {results.extractedIntent.detectedCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Result cards */}
              <div className="space-y-3">
                {results.results?.map((prod) => (
                  <div
                    key={prod._id}
                    onClick={() => handleProductClick(prod._id)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-white flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                            {prod.aiSearchScore}% Match
                          </span>
                          <span className="text-xs text-slate-400">{prod.brand}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mt-0.5">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">
                          {prod.matchedReason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-bold text-slate-900">${prod.price}</span>
                        {prod.originalPrice > prod.price && (
                          <div className="text-xs text-slate-400 line-through">
                            ${prod.originalPrice}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(prod, e)}
                        className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          addedId === prod._id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        }`}
                        title="Add to cart"
                      >
                        {addedId === prod._id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !results && (
            <div className="py-10 text-center text-slate-400 text-xs">
              Type what you are looking for above or click any suggested prompt!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
