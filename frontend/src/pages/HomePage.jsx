import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Truck, Headphones, Laptop, Watch, ShoppingBag } from 'lucide-react';
import AIRecommendationSection from '../components/ai/AIRecommendationSection';
import ProductCard from '../components/product/ProductCard';

export default function HomePage({ onOpenAISearch, featuredProducts = [] }) {
  const categories = [
    { name: 'Electronics', icon: Laptop, count: '6 items', color: 'from-blue-500 to-indigo-600' },
    { name: 'Audio', icon: Headphones, count: '3 items', color: 'from-purple-500 to-pink-600' },
    { name: 'Wearables', icon: Watch, count: '2 items', color: 'from-amber-500 to-orange-600' },
    { name: 'Fashion', icon: ShoppingBag, count: '2 items', color: 'from-emerald-500 to-teal-600' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-14 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            <span>AI-Driven E-Commerce Experience</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Next-Gen Store. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Powered by Intelligence.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            Explore curated tech, premium audio, and lifestyle gear with real-time AI product recommendations, seamless Stripe checkout, and instant smart search.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onOpenAISearch}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Ask AI Shopping Assistant</span>
            </button>
          </div>

          {/* Mini Stats */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <p className="text-2xl font-black text-white">99.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">AI Match Precision</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">&lt; 1s</p>
              <p className="text-xs text-slate-400 mt-0.5">Stripe Checkout</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">MERN Architecture</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browse Popular Categories</h2>
          <Link to="/shop" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      {featuredProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Editor's Choice</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Featured Flagship Products
              </h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Shop all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* AI Personalized Recommendations Section */}
      <AIRecommendationSection
        title="Personalized Recommendations by AI"
      />

      {/* Promotion & Trust Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            Limited Time Deal
          </span>
          <h3 className="text-3xl font-black tracking-tight mt-4">
            Get 10% Extra Savings With AI Smart Bundles
          </h3>
          <p className="mt-2 text-sm text-indigo-200 leading-relaxed">
            Our recommendation engine automatically pairs your favorite products with compatible gear and unlocks instant bundle discounts at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow hover:bg-slate-100 transition-all"
            >
              Start Exploring Bundles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
