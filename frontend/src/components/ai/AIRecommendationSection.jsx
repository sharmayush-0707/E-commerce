import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import ProductCard from '../product/ProductCard';

export default function AIRecommendationSection({ currentProductId, category, title = "Recommended For You by AI" }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const cartIds = cartItems.map(i => i.product).join(',');
        const { data } = await aiAPI.getPersonalized({
          currentProductId,
          category,
          cartItems: cartIds
        });
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Failed to load AI recommendations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [currentProductId, category, cartItems.length]);

  if (!loading && recommendations.length === 0) return null;

  return (
    <section className="my-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/50 text-indigo-700 text-xs font-bold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI Neural Personalization Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Curated using collaborative filtering, feature semantics & real-time browsing momentum.
          </p>
        </div>

        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-80 bg-slate-200/60 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.slice(0, 4).map(product => (
            <ProductCard key={product._id} product={product} showAiBadge={true} />
          ))}
        </div>
      )}
    </section>
  );
}
