import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';

export default function CheckoutPage() {
  const {
    cartItems,
    shippingAddress,
    saveShippingAddress,
    paymentMethod,
    savePaymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping form fields
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'United States');

  // Selected payment method
  const [method, setMethod] = useState(paymentMethod || 'Stripe');

  // Stripe Card Details
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(user ? user.name : 'Jane Doe');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <Link to="/shop" className="mt-4 inline-block text-indigo-600 font-semibold text-sm">
          Return to store
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode) {
      setError('Please provide all shipping address fields.');
      return;
    }

    if (!user) {
      setError('Please sign in before completing your order.');
      navigate('/login?redirect=checkout');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Save shipping info to context
      saveShippingAddress({ address, city, postalCode, country });
      savePaymentMethod(method);

      // 2. Format order items
      const orderItemsData = cartItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      }));

      // 3. Initiate payment with Stripe
      let paymentResult = null;
      if (method === 'Stripe') {
        const { data: paymentIntent } = await paymentAPI.createPaymentIntent({
          amount: totalPrice,
          currency: 'usd'
        });

        // Simulate payment confirmation
        paymentResult = {
          id: paymentIntent.id || `pi_stripe_${Date.now()}`,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: user.email
        };
      } else {
        paymentResult = {
          id: `cod_${Date.now()}`,
          status: 'pending_cash_on_delivery',
          update_time: new Date().toISOString(),
          email_address: user.email
        };
      }

      // 4. Create Order on backend
      const { data: createdOrder } = await orderAPI.createOrder({
        orderItems: orderItemsData,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: method,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      // 5. If Stripe payment succeeded, update order to paid
      if (method === 'Stripe' && paymentResult) {
        await orderAPI.payOrder(createdOrder._id, paymentResult);
      }

      // 6. Clear cart and navigate to success
      clearCart();
      navigate(`/order-success/${createdOrder._id}`);
    } catch (err) {
      console.error('Order creation error:', err);
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          SSL Encrypted 256-Bit Secure Payment Gateway
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Shipping + Payment selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Shipping Information</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 104 Innovation Way, Suite 400"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94105"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Payment Gateway</h2>
            </div>

            {/* Methods Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('Stripe')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  method === 'Stripe'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <CreditCard className={`w-5 h-5 shrink-0 mt-0.5 ${method === 'Stripe' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Credit Card (Stripe)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard, Amex</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('CashOnDelivery')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  method === 'CashOnDelivery'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${method === 'CashOnDelivery' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Cash on Delivery</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay upon package arrival</p>
                </div>
              </button>
            </div>

            {/* Stripe Card Input Simulator / Form */}
            {method === 'Stripe' && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Stripe Secure Elements
                  </span>
                  <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded font-bold">
                    Test Mode Active
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Pre-filled with Stripe test card 4242 4242 4242 4242</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="888"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Review Order</h3>

          {/* Cart items mini list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0 ml-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total</span>
              <span className="font-bold text-slate-900">${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-bold text-slate-900">
                {shippingPrice === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (8%)</span>
              <span className="font-bold text-slate-900">${taxPrice.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Grand Total</span>
              <span className="text-2xl font-black text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authorizing with Stripe...</span>
            ) : (
              <>
                <span>Complete Order (${totalPrice.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400">
            By placing this order you agree to our Terms of Service.
          </p>
        </div>
      </form>
    </div>
  );
}
