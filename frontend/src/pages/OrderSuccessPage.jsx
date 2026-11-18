import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, Truck, CreditCard, Sparkles } from 'lucide-react';
import { orderAPI } from '../services/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-500 font-medium">Generating order receipt...</p>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      {/* Success banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed & Paid
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Thank you for your order!
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            We have received your payment via Stripe. Your order is now being processed for delivery.
          </p>
        </div>

        <div className="inline-block bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs text-slate-600 font-mono">
          Order Reference: <span className="font-bold text-slate-900">{order?._id || id}</span>
        </div>
      </div>

      {order && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
            Order Summary & Receipt
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Delivery address */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <Truck className="w-4 h-4 text-indigo-600" /> Delivery Address
              </span>
              <p className="text-slate-800 font-semibold">{order.customerName}</p>
              <p className="text-slate-600">{order.shippingAddress?.address}</p>
              <p className="text-slate-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
              </p>
              <p className="text-slate-600">{order.shippingAddress?.country}</p>
            </div>

            {/* Payment details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Payment & Status
              </span>
              <p className="text-slate-800">
                Method: <span className="font-bold">{order.paymentMethod}</span>
              </p>
              <p className="text-slate-800">
                Payment Status: <span className="font-bold text-emerald-600">{order.isPaid ? 'Paid' : 'Pending'}</span>
              </p>
              <p className="text-slate-800">
                Fulfillment: <span className="font-bold text-indigo-600">{order.status}</span>
              </p>
              {order.paymentResult?.id && (
                <p className="text-slate-500 font-mono text-[10px] truncate">
                  Transaction: {order.paymentResult.id}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Items</h4>
            {order.orderItems?.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={it.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-slate-900">{it.name}</p>
                    <p className="text-slate-400">Quantity: {it.quantity} × ${it.price}</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900">
                  ${(it.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Total Paid</span>
            <span className="text-2xl font-black text-indigo-600">${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <Link
          to="/shop"
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/profile"
          className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
