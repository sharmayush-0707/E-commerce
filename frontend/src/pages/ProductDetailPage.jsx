import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Send
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SmartBundleBox from '../components/ai/SmartBundleBox';
import AIRecommendationSection from '../components/ai/AIRecommendationSection';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getProductById(id);
        setProduct(data);
        setActiveImage(data.image || (data.images && data.images[0]) || '');
        setQuantity(1);
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewMessage(null);
    try {
      await productAPI.createReview(id, {
        rating: reviewRating,
        comment: reviewComment
      });
      // Refresh product to show new review
      const { data } = await productAPI.getProductById(id);
      setProduct(data);
      setReviewComment('');
      setReviewMessage({ type: 'success', text: 'Thank you! Your review has been added.' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      setReviewMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <Link to="/shop" className="mt-4 inline-block text-indigo-600 font-semibold text-sm">
          Return to shop
        </Link>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="pb-20 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-700">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-full bg-rose-500 text-white shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail switcher */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-indigo-600 scale-95 shadow-md' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-sm font-medium text-indigo-700/80 mt-1">
                {product.tagline}
              </p>
            )}

            {/* Ratings & reviews count */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating) ? 'fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">
                ({product.numReviews} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-slate-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                  Save ${(product.originalPrice - product.price).toFixed(2)} ({product.discountPercentage}% OFF)
                </p>
              )}
            </div>

            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In Stock & Ready to Ship'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Specs List */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-slate-800 font-bold mt-0.5">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : product.stock === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:scale-[1.02]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" /> Add {quantity > 1 ? `${quantity} to Cart` : 'to Cart'}
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="flex flex-col items-center gap-1 text-[11px] text-slate-500">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Free Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] text-slate-500">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Bundle section ("Frequently Bought Together") */}
      <SmartBundleBox productId={product._id} />

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified customer opinions and ratings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Review List */}
          <div className="lg:col-span-7 space-y-4">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p className="text-xs text-slate-400 py-6">No customer reviews yet. Be the first to review!</p>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev._id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-[11px] text-slate-400">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Write a Customer Review
            </h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewMessage && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    reviewMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {reviewMessage.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Experience</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe how the product performed, build quality, comfort, etc..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                <p className="text-xs text-indigo-900 font-medium">Please sign in to share your customer review.</p>
                <Link
                  to="/login"
                  className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm"
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section at bottom */}
      <AIRecommendationSection
        currentProductId={product._id}
        category={product.category}
        title="More AI Picks Based on This Product"
      />
    </div>
  );
}
