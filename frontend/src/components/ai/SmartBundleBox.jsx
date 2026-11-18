import React, { useEffect, useState } from 'react';
import { Plus, Check, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { aiAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function SmartBundleBox({ productId }) {
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addBundleToCart } = useCart();

  useEffect(() => {
    if (!productId) return;
    const fetchBundle = async () => {
      try {
        setLoading(true);
        const { data } = await aiAPI.getBundle(productId);
        setBundle(data);
      } catch (err) {
        console.error('Failed to load bundle', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [productId]);

  if (loading || !bundle || !bundle.bundleProducts || bundle.bundleProducts.length === 0) {
    return null;
  }

  const allItems = [bundle.primaryProduct, ...bundle.bundleProducts];

  const handleAddBundle = () => {
    addBundleToCart(allItems);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="my-10 p-6 sm:p-8 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm">
          <Sparkles className="w-4 h-4" />
        </span>
        <h3 className="text-lg font-bold text-slate-900">
          Frequently Bought Together
        </h3>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
          <Tag className="w-3 h-3" /> Save {bundle.savingsPercentage}% Bundle Discount
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
        {/* Images & Plus connectors */}
        <div className="flex items-center flex-wrap gap-3">
          {allItems.map((item, idx) => (
            <React.Fragment key={item._id}>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs max-w-[200px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">${item.price}</p>
                </div>
              </div>

              {idx < allItems.length - 1 && (
                <div className="w-7 h-7 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 font-bold shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/80 shrink-0">
          <div>
            <div className="text-xs text-slate-500">Bundle Price ({allItems.length} items):</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">${bundle.bundleTotal}</span>
              <span className="text-sm text-slate-400 line-through">${bundle.originalTotal}</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600">
              You save ${bundle.savingsAmount}
            </div>
          </div>

          <button
            onClick={handleAddBundle}
            className={`px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added {allItems.length} to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add Bundle to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
