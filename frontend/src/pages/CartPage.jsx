import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'AI10' || code === 'WELCOME10') {
      setCouponDiscount(0.10);
      setCouponApplied(true);
    } else if (code === 'VIP20') {
      setCouponDiscount(0.20);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try code "AI10" or "VIP20"');
    }
  };

  const discountAmount = parseFloat((itemsPrice * couponDiscount).toFixed(2));
  const finalTotal = parseFloat(Math.max(0, totalPrice - discountAmount).toFixed(2));

  const freeShippingThreshold = 150;
  const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - itemsPrice);
  const progressPercent = Math.min(100, Math.round((itemsPrice / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-slate-500">
          Looks like you haven't added anything to your cart yet. Explore our curated gadgets and fashion!
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {cartItems.length} unique item{cartItems.length > 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free shipping progress notification */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 mb-1.5">
              <span>
                {amountUntilFreeShipping === 0
                  ? '🎉 You unlocked FREE Expedited Shipping!'
                  : `Add $${amountUntilFreeShipping.toFixed(2)} more for FREE Shipping!`}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <Link
                      to={`/product/${item.product}`}
                      className="block text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-extrabold text-indigo-600 mt-1">
                      ${item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/60 rounded-l-xl"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/60 rounded-r-xl"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-black text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/shop"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Order Summary</h3>

          {/* Breakdown */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-900">${itemsPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="font-bold text-slate-900">
                {shippingPrice === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  `$${shippingPrice.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-slate-900">${taxPrice.toFixed(2)}</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount ({couponDiscount * 100}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Price</span>
              <span className="text-xl font-black text-indigo-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Code Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Have a Promo Code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. AI10"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" /> Coupon code applied successfully!
              </p>
            )}
            {couponError && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                {couponError}
              </p>
            )}
          </form>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted PCI-Compliant Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
